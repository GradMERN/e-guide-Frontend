import React, { useEffect, useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FaTimes,
  FaBars,
  FaThLarge,
  FaList,
  FaSpinner,
  FaLanguage,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { guideService } from "../../apis/guideService";
import { tourItemService } from "../../apis/tourItemService";
import enrollmentApi from "../../apis/enrollment.api";
import TourView from "./subcomponents/TourView";
import Review from "./subcomponents/Review";
import useAudioPlayer from "../../hooks/useAudioPlayer";
import {
  translateText,
  detectLanguage,
  SUPPORTED_LANGUAGES,
} from "../../services/aiService";

const TourPreview = ({ tourId, onClose }) => {
  const { isDarkMode, user } = useAuth();
  const { t, i18n } = useTranslation();
  const safeT = (k, def) => t(k, { defaultValue: def });

  const [tour, setTour] = useState(null);
  const [items, setItems] = useState([]);
  const [nearbyItems, setNearbyItems] = useState([]);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const [tab, setTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [displayMode, setDisplayMode] = useState("card");
  const [initialLoading, setInitialLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  const playTimeoutRef = useRef(null);
  const [enrollments, setEnrollments] = useState([]);

  // Translation state
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translatedScript, setTranslatedScript] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [originalScript, setOriginalScript] = useState(null);

  const currentEnrollment = useMemo(() => {
    if (!enrollments || !tour) return null;
    return (
      enrollments.find((e) => {
        const tId =
          e.tour?._id ||
          e.tour?.id ||
          (e.tour && typeof e.tour === "string" ? e.tour : null);
        const tourIdLocal = tour._id || tour.id || tourId;
        return tId && tourIdLocal && String(tId) === String(tourIdLocal);
      }) || null
    );
  }, [enrollments, tour, tourId]);

  const isRtl =
    (typeof document !== "undefined" &&
      document.documentElement?.dir === "rtl") ||
    (i18n && typeof i18n.dir === "function" && i18n.dir() === "rtl");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (mounted) {
          setItems([]);
          setSelectedItem(null);
          setInitialLoading(true);
        }
        const res = await guideService.getTour(tourId);
        const payload = res?.data || res || null;
        if (!mounted) return;
        setTour(payload);
        const its = await tourItemService.getTourItems(tourId);
        if (!mounted) return;
        const list = its || [];
        const visible = (list || []).filter((it) => {
          if (it?.isPublished) return true;
          if (!user) return false;
          const isAdmin = user.role === "admin";
          const guideId = payload?.guide?._id || payload?.guide;
          const userId = user._id || user.id;
          const isOwner =
            userId && guideId && String(userId) === String(guideId);
          return isAdmin || isOwner;
        });
        setItems(visible);
        setSelectedItem((prev) => prev || visible[0] || null);
        try {
          updateNearby(visible, false, false);
        } catch (e) {}
        try {
          const enr = await enrollmentApi.getUserEnrollments();
          const data = enr?.data?.data || enr?.data || enr || [];
          if (mounted) setEnrollments(Array.isArray(data) ? data : []);
        } catch (e) {}
        if (mounted) setInitialLoading(false);
      } catch (err) {
        console.error("Failed to load preview", err);
        if (mounted) setInitialLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [tourId, user]);

  useEffect(() => {
    setInitialLoading(true);
    setItems([]);
    setSelectedItem(null);
    // Reset translation state when tour changes
    setTranslatedScript(null);
    setOriginalScript(null);
  }, [tourId]);

  // Stop audio and TTS when selected item changes
  useEffect(() => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Stop any TTS
    window.speechSynthesis?.cancel();
  }, [selectedItem?._id]);

  // Stop audio and TTS when language changes
  useEffect(() => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Stop any TTS
    window.speechSynthesis?.cancel();
  }, [selectedLanguage]);

  // Auto-translate when selected item changes (if a language is already selected)
  useEffect(() => {
    const autoTranslate = async () => {
      // Reset first
      setTranslatedScript(null);
      setOriginalScript(null);

      // If a language is selected and item has script, auto-translate
      if (selectedLanguage && selectedItem?.script) {
        const scriptLang = await detectLanguage(selectedItem.script);

        // Only translate if different from original
        if (selectedLanguage !== scriptLang) {
          setIsTranslating(true);
          setOriginalScript(selectedItem.script);

          try {
            const result = await translateText(
              selectedItem.script,
              scriptLang,
              selectedLanguage
            );
            setTranslatedScript(result.translatedText);
          } catch (err) {
            console.error("Auto-translation failed:", err);
            setTranslatedScript(null);
          } finally {
            setIsTranslating(false);
          }
        }
      }
    };

    autoTranslate();
  }, [selectedItem?._id, selectedLanguage]);

  // Handle translation when language changes
  const handleLanguageChange = async (newLang) => {
    setSelectedLanguage(newLang);

    if (!newLang || !selectedItem?.script) {
      setTranslatedScript(null);
      setOriginalScript(null);
      return;
    }

    // Detect original language
    const scriptLang = await detectLanguage(selectedItem.script);

    // If same language, show original
    if (newLang === scriptLang) {
      setTranslatedScript(null);
      setOriginalScript(null);
      return;
    }

    // Translate on-demand
    setIsTranslating(true);
    setOriginalScript(selectedItem.script);

    try {
      const result = await translateText(
        selectedItem.script,
        scriptLang,
        newLang
      );
      setTranslatedScript(result.translatedText);
    } catch (err) {
      console.error("Translation failed:", err);
      setTranslatedScript(null);
    } finally {
      setIsTranslating(false);
    }
  };

  // Get the display script (translated or original)
  const displayScript = translatedScript || selectedItem?.script;

  const distanceMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDistance = (dist) => {
    if (dist >= 1000) {
      return `≈ ${(dist / 1000).toFixed(1)} km`;
    }
    return `≈ ${Math.round(dist)} m`;
  };

  const updateNearby = (
    itemsSource = items,
    showLoading = false,
    isLiveTab = false
  ) => {
    if (showLoading) setNearbyLoading(true);
    if (!navigator.geolocation) {
      setNearbyItems([]);
      if (showLoading) setNearbyLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const mapDist = (it) => {
          const lat =
            it.location?.coordinates?.[1] ??
            it.location?.lat ??
            it.location?.latitude;
          const lng =
            it.location?.coordinates?.[0] ??
            it.location?.lng ??
            it.location?.longitude;
          if (lat == null || lng == null) return null;
          const rawDist = distanceMeters(latitude, longitude, lat, lng);
          const displayDist = rawDist > 4 ? Math.max(0, rawDist - 3) : rawDist;
          return { ...it, distance: displayDist, _rawDistance: rawDist };
        };
        const allWithDistances = (itemsSource || []).map(mapDist);
        const found = allWithDistances
          .filter(Boolean)
          .filter((it) => it._rawDistance <= 25)
          .sort(
            (a, b) =>
              (a._rawDistance ?? Infinity) - (b._rawDistance ?? Infinity)
          );
        if (isLiveTab) setNearbyItems(found);
        try {
          const prevMap = new Map(
            (itemsRef.current || []).map((it) => [
              it._id || it.id,
              it._rawDistance,
            ])
          );
          const needUpdate = allWithDistances.some((it) => {
            const key = it?._id || it?.id;
            return it && prevMap.get(key) !== it._rawDistance;
          });
          if (needUpdate) setItems(allWithDistances);
        } catch (e) {
          setItems(allWithDistances);
        }
        if (showLoading) setNearbyLoading(false);
      },
      () => {
        if (isLiveTab) setNearbyItems([]);
        if (showLoading) setNearbyLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  };

  useEffect(() => {
    const run = () =>
      updateNearby(itemsRef.current, tab === "live", tab === "live");
    run();
    const id = setInterval(run, 10000);
    return () => clearInterval(id);
  }, [tab]);

  useEffect(() => {
    return () => {};
  }, [selectedItem]);

  const audioSrc =
    selectedItem?.audioUrl ||
    selectedItem?.audio?.url ||
    selectedItem?.audioFile ||
    selectedItem?.media?.audio ||
    "";
  const {
    audioRef,
    isPlaying,
    progress: audioProgress,
    currentTime,
    duration,
    isDragging,
    setIsDragging,
    toggle,
    seekPercent,
  } = useAudioPlayer(audioSrc);

  const currentItems = tab === "all" ? items : nearbyItems;
  // Always hide unpublished items in the preview on the client side
  const displayedItems = (currentItems || []).filter((it) => !!it?.isPublished);

  useEffect(() => {
    if (!selectedItem) return;
    const selectedVisible = displayedItems.find(
      (d) => (d._id || d.id) === (selectedItem._id || selectedItem.id)
    );
    if (!selectedVisible) {
      setSelectedItem(displayedItems[0] || null);
    }
  }, [displayedItems]);

  return (
    <div
      className={`${isDarkMode ? "bg-[#0d0c0a]" : "bg-gray-50"} min-h-screen`}
    >
      <div
        className={`mx-auto fixed start-20 end-0 top-16 z-10 ${
          isDarkMode ? "bg-[#1B1A17]/80" : "bg-white/80"
        } backdrop-blur-md border-b ${
          isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-center h-16">
          <h1
            className={`${
              isDarkMode ? "text-white" : "text-gray-900"
            } text-xl font-bold`}
          >
            {tour?.name || safeT("guide.preview", "Tour Preview")}
          </h1>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle navigation"
          className="absolute end-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-[#D5B36A] text-white hover:bg-[#C4A55A] transition-colors duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <FaBars className="w-5 h-5" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className={`absolute end-16 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100"
            }`}
          >
            <FaTimes
              className={`${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              } w-5 h-5`}
            />
          </button>
        )}
      </div>

      <div className="relative mt-16">
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "lg:me-80" : "me-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {selectedItem ? (
                <>
                  <TourView
                    selectedItem={selectedItem}
                    isDarkMode={isDarkMode}
                    safeT={safeT}
                    audioRef={audioRef}
                    audioSrc={audioSrc}
                    isPlaying={isPlaying}
                    progress={audioProgress}
                    currentTime={currentTime}
                    duration={duration}
                    setIsDragging={setIsDragging}
                    toggle={toggle}
                    seekPercent={seekPercent}
                    translatedScript={translatedScript}
                    isTranslating={isTranslating}
                    isRtl={isRtl}
                    selectedLanguage={selectedLanguage}
                    stopAudio={() => {
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                      }
                      window.speechSynthesis?.cancel();
                    }}
                  />
                  <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Review
                      tourId={tourId}
                      enrollment={currentEnrollment}
                      tour={tour}
                    />
                  </div>
                </>
              ) : (
                <div
                  className={`${
                    isDarkMode ? "bg-[#1B1A17]" : "bg-white"
                  } rounded-2xl shadow-xl overflow-hidden border ${
                    isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
                  }`}
                >
                  {initialLoading ? (
                    <div
                      className={`${
                        isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-200"
                      } w-full h-80 flex items-center justify-center`}
                    >
                      <FaSpinner
                        className={`w-10 h-10 animate-spin ${
                          isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                      />
                    </div>
                  ) : tour?.mainImage?.url ? (
                    <img
                      src={tour.mainImage.url}
                      alt={tour.name}
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div
                      className={`${
                        isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-200"
                      } w-full h-80 flex items-center justify-center`}
                    >
                      <p
                        className={`${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {safeT("guide.noImage", "No Image")}
                      </p>
                    </div>
                  )}
                  <div className="p-6">
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } leading-relaxed`}
                    >
                      {tour?.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={`fixed top-32 end-0 h-[calc(100vh-8rem)] w-80 ${
            isDarkMode ? "bg-[#1B1A17]" : "bg-white"
          } border-start ${
            isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
          } shadow-2xl transform transition-transform duration-300 z-10 ${
            sidebarOpen
              ? "translate-x-0"
              : isRtl
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="sticky top-0 z-20 bg-transparent">
              <div
                className="p-4 border-b"
                style={{
                  borderColor: isDarkMode
                    ? "rgba(213,179,106,0.12)"
                    : undefined,
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTab("all")}
                      className={`flex-1 py-2 px-3 rounded-xl font-medium ${
                        tab === "all"
                          ? "bg-[#D5B36A] text-white"
                          : isDarkMode
                          ? "bg-[#2c1b0f] text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {safeT("guide.showAll", "All Items")}
                    </button>
                    <button
                      onClick={() => setTab("live")}
                      className={`flex-1 py-2 px-3 rounded-xl font-medium ${
                        tab === "live"
                          ? "bg-[#D5B36A] text-white"
                          : isDarkMode
                          ? "bg-[#2c1b0f] text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {safeT("guide.liveMode", "Nearby")}
                    </button>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDisplayMode("card")}
                        title="Card view"
                        className={`p-2 rounded-md ${
                          displayMode === "card"
                            ? "bg-[#D5B36A] text-black"
                            : isDarkMode
                            ? "bg-[#2c1b0f] text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <FaThLarge />
                      </button>
                      <button
                        onClick={() => setDisplayMode("list")}
                        title="List view"
                        className={`p-2 rounded-md ${
                          displayMode === "list"
                            ? "bg-[#D5B36A] text-black"
                            : isDarkMode
                            ? "bg-[#2c1b0f] text-gray-300"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <FaList />
                      </button>
                    </div>
                  </div>
                  {tab === "live" && (
                    <button
                      onClick={() => updateNearby(items, true)}
                      disabled={nearbyLoading}
                      className={`w-full mt-2 py-2 px-3 rounded-xl font-medium ${
                        isDarkMode
                          ? "bg-[#2c1b0f] text-gray-300 hover:bg-[#3c2b1f] border border-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                      } disabled:opacity-50`}
                    >
                      {nearbyLoading
                        ? safeT("guide.refreshing", "Refreshing...")
                        : safeT("guide.refreshNearby", "Refresh Nearby")}
                    </button>
                  )}

                  {/* Language Selector for Translation */}
                  <div className="mt-3 pt-3 border-t border-[#2b2b2b]">
                    <div className="flex items-center gap-2 mb-2">
                      <FaLanguage
                        className={`${
                          isDarkMode ? "text-[#D5B36A]" : "text-amber-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {safeT(
                          "guide.translation.selectLanguage",
                          "Translate Script"
                        )}
                      </span>
                    </div>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      disabled={isTranslating}
                      className={`w-full py-2 px-3 rounded-xl text-sm font-medium ${
                        isDarkMode
                          ? "bg-[#2c1b0f] text-gray-300 border border-gray-600"
                          : "bg-gray-100 text-gray-700 border border-gray-300"
                      } disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#D5B36A]`}
                    >
                      <option value="" disabled>
                        {safeT(
                          "guide.translation.selectLanguage",
                          "Select your language..."
                        )}
                      </option>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.nativeName} ({lang.name})
                        </option>
                      ))}
                    </select>
                    {isTranslating && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-[#D5B36A]">
                        <FaSpinner className="w-3 h-3 animate-spin" />
                        <span>
                          {safeT(
                            "guide.translation.translating",
                            "Translating..."
                          )}
                        </span>
                      </div>
                    )}
                    {translatedScript && !isTranslating && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-green-500">
                          ✓{" "}
                          {safeT("guide.translation.translated", "Translated")}
                        </span>
                        <button
                          onClick={() => {
                            setTranslatedScript(null);
                            setSelectedLanguage("");
                          }}
                          className="text-xs text-[#D5B36A] hover:underline"
                        >
                          {safeT(
                            "guide.translation.showOriginal",
                            "Show Original"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {initialLoading ? (
                <div className="p-6 text-center">
                  <FaSpinner className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
                  <p className="mt-2 text-gray-400">
                    {safeT("guide.loadingItems", "Loading items...")}
                  </p>
                </div>
              ) : nearbyLoading ? (
                <div className="p-6 text-center">
                  <FaSpinner className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
                  <p className="mt-2 text-gray-400">
                    {safeT("guide.findingNearby", "Finding nearby items...")}
                  </p>
                </div>
              ) : displayedItems.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  {tab === "live"
                    ? safeT("guide.liveNone", "No nearby items found")
                    : safeT("guide.noItems", "No items available")}
                </div>
              ) : (
                <div className="space-y-2">
                  {displayedItems.map((it) => {
                    const isSel =
                      selectedItem &&
                      (selectedItem._id || selectedItem.id) ===
                        (it._id || it.id);
                    const img = it.mainImage?.url || it.image || it.cover || "";
                    if (displayMode === "card") {
                      return (
                        <button
                          key={it._id || it.id}
                          onClick={() => setSelectedItem(it)}
                          className={`w-full text-left rounded-xl overflow-hidden transition-all ${
                            isSel
                              ? "ring-2 ring-[#D5B36A]"
                              : "hover:scale-[1.01]"
                          } ${isDarkMode ? "bg-[#15120f]" : "bg-white"}`}
                        >
                          <div className="relative w-full h-36 bg-gray-100">
                            {img ? (
                              <img
                                src={img}
                                alt={it.title || it.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={` ${
                                  isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-100"
                                } w-full h-full flex items-center justify-center`}
                              >
                                <span
                                  className={`${
                                    isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                >
                                  No Image
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            className={`p-3 ${
                              isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <div className="font-semibold truncate">
                              {it.title || it.name}
                            </div>
                            {it.distance ? (
                              <div className="text-sm opacity-70 mt-1">
                                {formatDistance(it.distance)}
                              </div>
                            ) : null}
                            <div className="text-sm opacity-80 mt-1">
                              {(
                                it.shortDescription ||
                                it.description ||
                                ""
                              ).slice(0, 80)}
                            </div>
                          </div>
                        </button>
                      );
                    }
                    return (
                      <button
                        key={it._id || it.id}
                        onClick={() => setSelectedItem(it)}
                        className={`w-full text-left rounded-xl p-3 flex items-center gap-3 transition-all ${
                          isSel
                            ? "bg-[#D5B36A] text-black shadow-lg"
                            : isDarkMode
                            ? "bg-[#13100e] text-white"
                            : "bg-white text-gray-900"
                        }`}
                      >
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          {img ? (
                            <img
                              src={img}
                              alt={it.title || it.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className={`${
                                isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-100"
                              } w-full h-full flex items-center justify-center`}
                            >
                              <span
                                className={`${
                                  isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                              >
                                No Image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {it.title || it.name}
                          </p>
                          {it.distance ? (
                            <div className="text-sm opacity-70 mt-1">
                              {formatDistance(it.distance)}
                            </div>
                          ) : null}
                          <div className="text-sm opacity-75 mt-1 truncate">
                            {(
                              it.shortDescription ||
                              it.description ||
                              ""
                            ).slice(0, 80)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPreview;
