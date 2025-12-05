import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  FaTimes,
  FaBars,
  FaChevronLeft,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { guideService } from "../../apis/guideService";
import { tourItemService } from "../../apis/tourItemService";

const TourPreview = ({ tourId, onClose }) => {
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();
  const safeT = (k, def) => t(k, { defaultValue: def });
  const [tour, setTour] = useState(null);
  const [items, setItems] = useState([]);
  const [nearbyItems, setNearbyItems] = useState([]);
  const [tab, setTab] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef(null);
  const playTimeoutRef = useRef(null);

  // Distance helper (meters)
  const distanceMeters = (lat1, lon1, lat2, lon2) => {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

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
        updateNearby(list);
      } catch (err) {
        console.error("Failed to load preview", err);
      }
    })();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId]);

  const updateNearby = (itemsSource = items) => {
    if (!navigator.geolocation) return setNearbyItems([]);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const found = (itemsSource || [])
          .map((it) => {
            const lat = it.location?.lat || it.location?.latitude;
            const lng = it.location?.lng || it.location?.longitude;
            if (!lat || !lng) return null;
            const dist = distanceMeters(latitude, longitude, lat, lng);
            return { ...it, distance: dist };
          })
          .filter(Boolean)
          .filter((it) => it.distance <= 25)
          .sort((a, b) => a.distance - b.distance);
        setNearbyItems(found);
      },
      (err) => {
        console.warn("Geolocation failed", err);
        setNearbyItems([]);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  };

  useEffect(() => {
    if (tab !== "live") return;
    updateNearby(items);
    const id = setInterval(() => updateNearby(items), 10000);
    return () => clearInterval(id);
  }, [tab, items]);

  // Autoplay audio 2s after selecting an item
  useEffect(() => {
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    if (!selectedItem) {
      if (audioRef.current) {
        try {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlaying(false);
        } catch (e) {}
      }
      return;
    }

    // Reset audio progress when item changes
    setAudioProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }

    playTimeoutRef.current = setTimeout(() => {
      if (!audioRef.current) return;
      const p = audioRef.current.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    }, 2000);
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
    };
  }, [selectedItem]);

  // Cleanup event listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  };

  // Audio event handlers
  const handleAudioTimeUpdate = () => {
    if (audioRef.current && !isDragging) {
      const progress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  // Progress bar drag handlers
  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    updateProgressFromMouse(e);

    // Add global mouse event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateProgressFromMouse(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Remove global event listeners
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const updateProgressFromMouse = (e) => {
    if (!audioRef.current) return;

    // Find the progress bar element
    const progressBar =
      e.currentTarget || document.querySelector("[data-progress-bar]");
    if (!progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    setAudioProgress(clampedPercentage);
    audioRef.current.currentTime =
      (clampedPercentage / 100) * audioRef.current.duration;
  };

  const currentItems = tab === "all" ? items : nearbyItems;

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-[#0d0c0a]" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div
        className={`
             mx-auto relative
             ${
               isDarkMode ? "bg-[#1B1A17]/80" : "bg-white/80"
             } backdrop-blur-md border-b ${
          isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
        }`}
      >
        <div className="flex items-center justify-center h-16">
          <h1
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {tour?.name || safeT("guide.preview", "Tour Preview")}
          </h1>
        </div>
        {/* Toggler positioned at screen right edge */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-[#D5B36A] text-white hover:bg-[#C4A55A] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          aria-label="Toggle navigation"
        >
          <FaBars className="w-5 h-5" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className={`absolute right-16 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:${
              isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-100"
            } transition-colors duration-200`}
          >
            <FaTimes
              className={`w-5 h-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
          </button>
        )}
      </div>

      {/* Main Content with Sidebar */}
      <div className="relative">
        {/* Main Content Area */}
        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "lg:mr-80" : "mr-0"
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
                  {/* Image with Play/Pause Overlay and Progress Bar */}
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
                        className={`w-full h-80 ${
                          isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-200"
                        } flex items-center justify-center relative`}
                      >
                        <div className="text-center">
                          <div
                            className={`w-16 h-16 ${
                              isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-300"
                            } rounded-full flex items-center justify-center mx-auto mb-4`}
                          >
                            <FaPlay
                              className={`w-6 h-6 ${
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                              } ml-1`}
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

                  {/* Audio Progress Bar - Break Line */}
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

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h2
                      className={`text-2xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
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
                          className={`text-lg font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          } mb-2`}
                        >
                          {safeT("guide.script", "Script")}
                        </h3>
                        <p
                          className={`whitespace-pre-wrap leading-relaxed ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {selectedItem.script}
                        </p>
                      </div>
                    )}

                    {/* Audio Controls */}
                    {/* <div
                      className={`${
                        isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"
                      } rounded-lg p-4 border ${
                        isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
                      }`}
                    > */}
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
                    {/* </div> */}
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
                  {tour?.mainImage?.url ? (
                    <img
                      src={tour.mainImage.url}
                      alt={tour.name}
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-80 ${
                        isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-200"
                      } flex items-center justify-center`}
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

            {/* Fixed Sidebar */}
            <div
              className={`fixed top-32 right-0 h-[calc(100vh-8rem)] w-80 ${
                isDarkMode ? "bg-[#1B1A17]" : "bg-white"
              } border-l ${
                isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
              } shadow-2xl transform transition-transform duration-300 z-50 ${
                sidebarOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="h-full flex flex-col">
                {/* Tab Buttons */}
                <div className="p-4 border-b border-[#D5B36A]/20">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTab("all")}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        tab === "all"
                          ? "bg-[#D5B36A] text-white shadow-lg transform scale-105"
                          : `${
                              isDarkMode
                                ? "bg-[#2c1b0f] text-gray-300 hover:bg-[#1B1A17]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } shadow-md`
                      }`}
                    >
                      {safeT("guide.showAll", "All Items")}
                    </button>
                    <button
                      onClick={() => setTab("live")}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        tab === "live"
                          ? "bg-[#D5B36A] text-white shadow-lg transform scale-105"
                          : `${
                              isDarkMode
                                ? "bg-[#2c1b0f] text-gray-300 hover:bg-[#1B1A17]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } shadow-md`
                      }`}
                    >
                      {safeT("guide.liveMode", "Nearby")}
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-hidden">
                  <div className="p-4 border-b border-[#D5B36A]/20">
                    <h3
                      className={`text-lg font-semibold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {tab === "live"
                        ? safeT("guide.nearbyItems", "Nearby Items")
                        : safeT("guide.tourItems", "Tour Items")}
                    </h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {currentItems.length === 0 ? (
                      <div className="p-6 text-center text-gray-400">
                        {tab === "live"
                          ? safeT("guide.liveNone", "No nearby items found")
                          : safeT("guide.noItems", "No items available")}
                      </div>
                    ) : (
                      <div className="p-2 space-y-1">
                        {currentItems.map((it, index) => {
                          const isSel =
                            selectedItem &&
                            (selectedItem._id || selectedItem.id) ===
                              (it._id || it.id);
                          return (
                            <button
                              key={it._id || it.id}
                              onClick={() => setSelectedItem(it)}
                              className={`w-full text-left p-4 rounded-xl transition-all duration-200 transform hover:scale-102 ${
                                isSel
                                  ? "bg-[#D5B36A] text-white shadow-lg"
                                  : `${
                                      isDarkMode
                                        ? "bg-[#2c1b0f] text-white hover:bg-[#1B1A17]"
                                        : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                                    }`
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                    isSel ? "bg-white/20" : "bg-[#D5B36A]/20"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">
                                    {it.title || it.name}
                                  </p>
                                  {tab === "live" && it.distance && (
                                    <p className="text-sm opacity-75">
                                      {Math.round(it.distance)}m away
                                    </p>
                                  )}
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
            className={`absolute top-0 right-0 h-full w-80 max-w-[85vw] ${
              isDarkMode ? "bg-[#1B1A17]" : "bg-white"
            } shadow-2xl transform transition-transform duration-300 ease-out ${
              sidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
              }`}
            >
              <h2
                className={`text-xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {safeT("guide.navigation", "Navigation")}
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-2 rounded-lg hover:${
                  isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-100"
                } transition-colors duration-200`}
              >
                <FaTimes
                  className={`w-5 h-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            {/* Mobile Tab Buttons */}
            <div className="p-4 border-b border-[#D5B36A]/20">
              <div className="flex space-x-2">
                <button
                  onClick={() => setTab("all")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    tab === "all"
                      ? "bg-[#D5B36A] text-white shadow-lg transform scale-105"
                      : `${
                          isDarkMode
                            ? "bg-[#2c1b0f] text-gray-300 hover:bg-[#1B1A17]"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } shadow-md`
                  }`}
                >
                  {safeT("guide.showAll", "All Items")}
                </button>
                <button
                  onClick={() => setTab("live")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    tab === "live"
                      ? "bg-[#D5B36A] text-white shadow-lg transform scale-105"
                      : `${
                          isDarkMode
                            ? "bg-[#2c1b0f] text-gray-300 hover:bg-[#1B1A17]"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } shadow-md`
                  }`}
                >
                  {safeT("guide.liveMode", "Nearby")}
                </button>
              </div>
            </div>

            {/* Mobile Items List */}
            <div className="flex-1 overflow-hidden">
              <div className="p-4 border-b border-[#D5B36A]/20">
                <h3
                  className={`text-lg font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tab === "live"
                    ? safeT("guide.nearbyItems", "Nearby Items")
                    : safeT("guide.tourItems", "Tour Items")}
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {currentItems.length === 0 ? (
                  <div className="p-6 text-center text-gray-400">
                    {tab === "live"
                      ? safeT("guide.liveNone", "No nearby items found")
                      : safeT("guide.noItems", "No items available")}
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {currentItems.map((it, index) => {
                      const isSel =
                        selectedItem &&
                        (selectedItem._id || selectedItem.id) ===
                          (it._id || it.id);
                      return (
                        <button
                          key={it._id || it.id}
                          onClick={() => {
                            setSelectedItem(it);
                            setSidebarOpen(false);
                          }}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-200 transform hover:scale-102 ${
                            isSel
                              ? "bg-[#D5B36A] text-white shadow-lg"
                              : `${
                                  isDarkMode
                                    ? "bg-[#2c1b0f] text-white hover:bg-[#1B1A17]"
                                    : "bg-gray-50 text-gray-900 hover:bg-gray-100"
                                }`
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                isSel ? "bg-white/20" : "bg-[#D5B36A]/20"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {it.title || it.name}
                              </p>
                              {tab === "live" && it.distance && (
                                <p className="text-sm opacity-75">
                                  {Math.round(it.distance)}m away
                                </p>
                              )}
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
    </div>
  );
};

export default TourPreview;
