import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  FaTimes,
  FaBars,
  FaPlay,
  FaPause,
  FaThLarge,
  FaList,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { guideService } from "../../apis/guideService";
import { tourItemService } from "../../apis/tourItemService";

const TourPreview = ({ tourId, onClose }) => {
  const { isDarkMode } = useAuth();
  const { t, i18n } = useTranslation();
  const safeT = (k, def) => t(k, { defaultValue: def });

  const [tour, setTour] = useState(null);
  const [items, setItems] = useState([]);
  const [nearbyItems, setNearbyItems] = useState([]);
  const [tab, setTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState("card");
  const [initialLoading, setInitialLoading] = useState(true);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);
  const playTimeoutRef = useRef(null);

  const isRtl =
    (typeof document !== "undefined" &&
      document.documentElement?.dir === "rtl") ||
    (i18n && typeof i18n.dir === "function" && i18n.dir() === "rtl");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await guideService.getTour(tourId);
        const payload = res?.data || res || null;
        if (!mounted) return;
        setTour(payload);
        const its = await tourItemService.getTourItems(tourId);
        if (!mounted) return;
        const list = its || [];
        setItems(list);
        setSelectedItem((prev) => prev || list[0] || null);
        if (mounted) setInitialLoading(false);
      } catch (err) {
        console.error("Failed to load preview", err);
        if (mounted) setInitialLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [tourId]);

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

  const updateNearby = (itemsSource = items) => {
    if (!navigator.geolocation) return setNearbyItems([]);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const found = (itemsSource || [])
          .map((it) => {
            const lat =
              it.location?.coordinates?.[1] ||
              it.location?.lat ||
              it.location?.latitude;
            const lng =
              it.location?.coordinates?.[0] ||
              it.location?.lng ||
              it.location?.longitude;
            if (!lat || !lng) return null;
            const dist = distanceMeters(latitude, longitude, lat, lng);
            return { ...it, distance: dist };
          })
          .filter(Boolean)
          .filter((it) => it.distance <= 25)
          .sort((a, b) => a.distance - b.distance);
        setNearbyItems(found);
      },
      () => setNearbyItems([]),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  };

  useEffect(() => {
    if (tab !== "live") return;
    updateNearby(items);
    const id = setInterval(() => updateNearby(items), 10000);
    return () => clearInterval(id);
  }, [tab, items]);

  useEffect(() => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    if (!selectedItem) return;
    setAudioProgress(0);
    if (audioRef.current) {
      // reset position and ensure audio is paused — do NOT auto-play
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.pause();
      } catch (e) {
        // ignore if not ready
      }
    }
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
    };
  }, [selectedItem]);

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const p =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(isFinite(p) ? p : 0);
    }
  };

  const handleAudioLoadedMetadata = () => {};
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    updateProgressFromMouse(e);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDragging) updateProgressFromMouse(e);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    if (audioRef.current) audioRef.current.play().catch(() => {});
  };

  const updateProgressFromMouse = (e) => {
    if (!audioRef.current) return;
    const progressBar =
      e.currentTarget || document.querySelector("[data-progress-bar]");
    if (!progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clamped = Math.max(0, Math.min(100, percentage));
    setAudioProgress(clamped);
    if (audioRef.current && isFinite(audioRef.current.duration))
      audioRef.current.currentTime =
        (clamped / 100) * audioRef.current.duration;
  };

  const currentItems = tab === "all" ? items : nearbyItems;

  return (
    <div
      className={`${isDarkMode ? "bg-[#0d0c0a]" : "bg-gray-50"} min-h-screen`}
    >
      {/* header */}
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
                <div
                  className={`${
                    isDarkMode ? "bg-[#1B1A17]" : "bg-white"
                  } rounded-2xl shadow-xl overflow-hidden border ${
                    isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
                  }`}
                >
                  <div className="relative group">
                    {selectedItem.mainImage?.url ? (
                      <>
                        <img
                          src={selectedItem.mainImage.url}
                          alt={selectedItem.title || selectedItem.name}
                          className="w-full h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                          <button
                            onClick={toggleAudio}
                            className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-200"
                          >
                            {isPlaying ? (
                              <FaPause className="w-6 h-6 text-gray-800" />
                            ) : (
                              <FaPlay className="w-6 h-6 text-gray-800 ml-1" />
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      <div
                        className={`${
                          isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-200"
                        } w-full h-80 flex items-center justify-center`}
                      >
                        <div className="text-center">
                          <div
                            className={`${
                              isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-300"
                            } w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}
                          >
                            <FaPlay
                              className={`${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              } w-6 h-6 ml-1`}
                            />
                          </div>
                          <p
                            className={`${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {safeT("guide.noImage", "No Image")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-2">
                    <div
                      data-progress-bar
                      className={`w-full h-3 rounded-full cursor-pointer select-none ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-300"
                      }`}
                      onMouseDown={handleProgressMouseDown}
                    >
                      <div
                        className={`h-full rounded-full transition-all duration-100 ${
                          isDarkMode ? "bg-white" : "bg-black"
                        }`}
                        style={{ width: `${audioProgress}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <h2
                      className={`${
                        isDarkMode ? "text-white" : "text-gray-900"
                      } text-2xl font-bold`}
                    >
                      {selectedItem.title || selectedItem.name}
                    </h2>
                    <p
                      className={`${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      } leading-relaxed`}
                    >
                      {selectedItem.description ||
                        selectedItem.shortDescription ||
                        ""}
                    </p>
                    {selectedItem.script && (
                      <div
                        className={`${
                          isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"
                        } rounded-lg p-4`}
                      >
                        <h3
                          className={`${
                            isDarkMode ? "text-white" : "text-gray-900"
                          } text-lg font-semibold mb-2`}
                        >
                          {safeT("guide.script", "Script")}
                        </h3>
                        <p
                          className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          } whitespace-pre-wrap leading-relaxed`}
                        >
                          {selectedItem.script}
                        </p>
                      </div>
                    )}
                    <audio
                      ref={audioRef}
                      src={
                        selectedItem.audioUrl ||
                        selectedItem.audio?.url ||
                        selectedItem.audioFile ||
                        selectedItem.media?.audio ||
                        ""
                      }
                      onTimeUpdate={handleAudioTimeUpdate}
                      onLoadedMetadata={handleAudioLoadedMetadata}
                      onEnded={handleAudioEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
                  </div>
                </div>
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

        {/* Sidebar (desktop) */}
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
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {currentItems.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  {tab === "live"
                    ? safeT("guide.liveNone", "No nearby items found")
                    : safeT("guide.noItems", "No items available")}
                </div>
              ) : (
                <div className="space-y-2">
                  {currentItems.map((it, index) => {
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
                                className={`${
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
                          <div className="text-sm opacity-75 flex items-center gap-2">
                            {tab === "live" && it.distance ? (
                              <span>{Math.round(it.distance)}m</span>
                            ) : null}
                            <span className="truncate">
                              {(
                                it.shortDescription ||
                                it.description ||
                                ""
                              ).slice(0, 80)}
                            </span>
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

        {/* Mobile Sidebar Overlay */}
        <div
          className={`fixed inset-0 z-60 lg:hidden transition-opacity duration-300 ${
            sidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div
            className={`${
              isDarkMode ? "bg-[#1B1A17]" : "bg-white"
            } absolute top-0 ${
              isRtl ? "start-0" : "end-0"
            } h-full w-80 max-w-[85vw] shadow-2xl transform transition-transform duration-300 ${
              sidebarOpen
                ? "translate-x-0"
                : isRtl
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
              }`}
            >
              <h2
                className={`${
                  isDarkMode ? "text-white" : "text-gray-900"
                } text-xl font-bold`}
              >
                {safeT("guide.navigation", "Navigation")}
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100"
                }`}
              >
                <FaTimes
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } w-5 h-5`}
                />
              </button>
            </div>
            <div className="p-4 border-b">
              <div className="flex space-x-2">
                <button
                  onClick={() => setTab("all")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium ${
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
                  className={`flex-1 py-3 px-4 rounded-xl font-medium ${
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
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {currentItems.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  {tab === "live"
                    ? safeT("guide.liveNone", "No nearby items found")
                    : safeT("guide.noItems", "No items available")}
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {currentItems.map((it, index) => {
                    const isSel =
                      selectedItem &&
                      (selectedItem._id || selectedItem.id) ===
                        (it._id || it.id);
                    const img = it.mainImage?.url || it.image || it.cover || "";
                    return (
                      <button
                        key={it._id || it.id}
                        onClick={() => {
                          setSelectedItem(it);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left rounded-xl overflow-hidden transition-all ${
                          isSel ? "ring-2 ring-[#D5B36A]" : "hover:scale-[1.01]"
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
                        <div
                          className={`p-3 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          <div className="font-semibold truncate">
                            {it.title || it.name}
                          </div>
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
