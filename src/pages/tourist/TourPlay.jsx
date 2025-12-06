import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaSpinner,
  FaThLarge,
  FaList,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import tourService from "../../apis/tourService";
import { tourItemService } from "../../apis/tourItemService";
import enrollmentApi from "../../apis/enrollment.api";
import TourView from "../../components/guide/subcomponents/TourView";
import Review from "../../components/guide/subcomponents/Review";
import useAudioPlayer from "../../hooks/useAudioPlayer";
import { useAuth } from "../../context/AuthContext";

export default function TourPlay() {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode, user } = useAuth();

  console.log("TourPlay component mounted");
  console.log("Tour ID from params:", tourId);
  console.log("User from auth:", user);
  console.log("Is authenticated:", !!user);

  const isRtl =
    (typeof document !== "undefined" &&
      document.documentElement?.dir === "rtl") ||
    false;

  const [tour, setTour] = useState(null);
  const [items, setItems] = useState([]);
  const [nearbyItems, setNearbyItems] = useState([]);
  const [tab, setTab] = useState("all");
  const [displayMode, setDisplayMode] = useState("card");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.log("Fetching tour with ID:", tourId);
        const tRes = await tourService.getTourById(tourId);
        console.log("Tour API response:", tRes);
        console.log("Tour API response type:", typeof tRes);
        console.log("Tour API response keys:", Object.keys(tRes || {}));
        const t = tRes?.data || tRes;
        console.log("Parsed tour data:", t);
        console.log("Parsed tour data type:", typeof t);
        console.log("Parsed tour data keys:", Object.keys(t || {}));
        if (!mounted) return;
        setTour(t);

        console.log("Fetching tour items for ID:", tourId);
        const its = await tourItemService.getTourItems(tourId);
        console.log("Tour items response:", its);
        if (!mounted) return;
        setItems(its || []);
        setSelectedItem((prev) => prev || (its && its[0]) || null);
        // fetch user enrollments
        try {
          console.log("Fetching user enrollments...");
          const enr = await enrollmentApi.getUserEnrollments();
          console.log("Enrollment API response:", enr);
          const data =
            enr?.data?.data?.all ||
            enr?.data?.all ||
            enr?.data?.data ||
            enr?.data ||
            enr ||
            [];
          console.log("Parsed enrollment data:", data);
          if (mounted) setEnrollments(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error("Enrollment fetch error:", e);
          console.error("Error details:", e.response?.data || e.message);
          // Set empty array on error
          if (mounted) setEnrollments([]);
        } finally {
          if (mounted) setEnrollmentLoading(false);
        }
      } catch (err) {
        console.error("Failed to load tour play", err);
      } finally {
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

  const updateNearby = (itemsSource = items, showLoading = false) => {
    if (showLoading) setNearbyLoading(true);
    if (!navigator.geolocation) {
      setNearbyItems([]);
      if (showLoading) setNearbyLoading(false);
      return;
    }
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
            // compute raw distance (meters)
            const rawDist = distanceMeters(latitude, longitude, lat, lng);
            // adjust displayed distance to account for GPS inaccuracy:
            // when raw distance > 4m, subtract 3m for display purposes
            const displayDist =
              rawDist > 4 ? Math.max(0, rawDist - 3) : rawDist;
            // keep raw distance in a separate field to use for filtering/sorting
            return { ...it, distance: displayDist, _rawDistance: rawDist };
          })
          .filter(Boolean)
          // use the raw distance for filtering/sorting so adjustment only affects display
          .filter((it) => it._rawDistance <= 25)
          .sort((a, b) => a._rawDistance - b._rawDistance);
        setNearbyItems(found);
        if (showLoading) setNearbyLoading(false);
      },
      () => {
        setNearbyItems([]);
        if (showLoading) setNearbyLoading(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  };

  useEffect(() => {
    if (tab !== "live") return;
    updateNearby(items, true);
    const id = setInterval(() => updateNearby(items, false), 10000);
    return () => clearInterval(id);
  }, [tab, items]);

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

  const canView = useMemo(() => {
    // Allow if user is the guide of the tour
    const isGuide = user && tour && user._id === tour.guide._id;
    if (isGuide) return true;
    console.log("Current enrollment:", currentEnrollment);
    console.log("User:", user);
    console.log("Tour:", tour);
    // Allow if enrolled, started, and not expired
    if (!currentEnrollment) return false;
    const isExpired =
      currentEnrollment.expiresAt &&
      new Date(currentEnrollment.expiresAt) < new Date();
    return currentEnrollment.status === "started" && !isExpired;
  }, [currentEnrollment, user, tour]);

  // audio hook
  const audioSrc =
    selectedItem?.audioUrl ||
    selectedItem?.audio?.url ||
    selectedItem?.audioFile ||
    selectedItem?.media?.audio ||
    "";
  console.log("Selected item:", selectedItem);
  console.log("Audio src:", audioSrc);
  const audio = useAudioPlayer(audioSrc);

  const currentItems = tab === "all" ? items : nearbyItems;

  if (initialLoading || enrollmentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-text-secondary">Loading tour...</p>
        </div>
      </div>
    );
  }

  if (!initialLoading && !enrollmentLoading && !canView) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-xl text-center p-8 bg-surface rounded-2xl shadow-lg border border-border">
          <h2 className="text-2xl font-bold text-text mb-3">
            Access Restricted
          </h2>
          <p className="text-text-secondary mb-6">
            You must be enrolled and within the valid access window to view this
            tour. If you already paid, go to{" "}
            <button
              onClick={() => navigate("/my-tours")}
              className="underline font-medium"
            >
              My Tours
            </button>{" "}
            and start the enrollment.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg bg-surface/80 border border-border text-text-secondary"
            >
              Back
            </button>
            <button
              onClick={() => navigate(`/tours/${tourId}`)}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-background"
            >
              View Tour Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-surface border border-border"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-text">{tour?.name}</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
            className="p-2 rounded-lg bg-primary text-background hover:bg-primary/80 transition-colors"
          >
            {isRtl ? (
              <FaChevronRight className="w-5 h-5" />
            ) : (
              <FaChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <div
          className={`transition-all duration-300 ${
            sidebarOpen ? "lg:me-80" : "me-0"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-6">
              {selectedItem && (
                <>
                  <TourView
                    selectedItem={selectedItem}
                    isDarkMode={isDarkMode}
                    safeT={(k, def) => def}
                    audioRef={audio.audioRef}
                    audioSrc={audioSrc}
                    isPlaying={audio.isPlaying}
                    progress={audio.progress}
                    currentTime={audio.currentTime}
                    duration={audio.duration}
                    setIsDragging={audio.setIsDragging}
                    toggle={audio.toggle}
                    seekPercent={audio.seekPercent}
                  />
                </>
              )}

              {/* Show reviews for the tour */}
              <div>
                <Review
                  tourId={tourId}
                  enrollment={currentEnrollment}
                  tour={tour}
                  readOnly={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (desktop) */}
        <div
          className={`fixed top-32 end-0 h-[calc(100vh-8rem)] w-80 ${
            isDarkMode ? "bg-surface" : "bg-background"
          } border-start ${
            isDarkMode ? "border-border" : "border-border"
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
                  borderColor: isDarkMode ? "var(--border)" : "var(--border)",
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTab("all")}
                      className={`flex-1 py-2 px-3 rounded-xl font-medium ${
                        tab === "all"
                          ? "bg-primary text-background"
                          : "bg-surface text-text-secondary hover:bg-surface/80"
                      }`}
                    >
                      All Items
                    </button>
                    <button
                      onClick={() => setTab("live")}
                      className={`flex-1 py-2 px-3 rounded-xl font-medium ${
                        tab === "live"
                          ? "bg-primary text-background"
                          : "bg-surface text-text-secondary hover:bg-surface/80"
                      }`}
                    >
                      Nearby
                    </button>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDisplayMode("card")}
                        title="Card view"
                        className={`p-2 rounded-md ${
                          displayMode === "card"
                            ? "bg-primary text-background"
                            : "bg-surface text-text-secondary hover:bg-surface/80"
                        }`}
                      >
                        <FaThLarge />
                      </button>
                      <button
                        onClick={() => setDisplayMode("list")}
                        title="List view"
                        className={`p-2 rounded-md ${
                          displayMode === "list"
                            ? "bg-primary text-background"
                            : "bg-surface text-text-secondary hover:bg-surface/80"
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
                      className="w-full mt-2 py-2 px-3 rounded-xl font-medium bg-surface text-text-secondary hover:bg-surface/80 border border-border disabled:opacity-50"
                    >
                      {nearbyLoading ? "Refreshing..." : "Refresh Nearby"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {nearbyLoading ? (
                <div className="p-6 text-center">
                  <FaSpinner className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
                  <p className="mt-2 text-text-secondary">
                    Finding nearby items...
                  </p>
                </div>
              ) : currentItems.length === 0 ? (
                <div className="p-6 text-center text-text-secondary">
                  {tab === "live"
                    ? "No nearby items found"
                    : "No items available"}
                </div>
              ) : (
                <div className="space-y-2">
                  {currentItems.map((it) => {
                    const isSel =
                      selectedItem &&
                      (selectedItem._id || selectedItem.id) ===
                        (it._id || it.id);
                    const img = it.mainImage?.url || it.image || it.cover || "";
                    console.log("Item:", it.name || it.title, "Image:", img);
                    if (displayMode === "card") {
                      return (
                        <button
                          key={it._id || it.id}
                          onClick={() => setSelectedItem(it)}
                          className={`w-full text-left rounded-xl overflow-hidden transition-all ${
                            isSel ? "ring-2 ring-primary" : "hover:scale-[1.01]"
                          } bg-surface`}
                        >
                          <div className="relative w-full h-36 bg-gray-100">
                            {img ? (
                              <img
                                src={img}
                                alt={it.title || it.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                                <span className="text-gray-500">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3 text-text">
                            <div className="font-semibold truncate">
                              {it.title || it.name}
                            </div>
                            {tab === "live" && it.distance ? (
                              <div className="text-sm text-text-secondary mt-1">
                                ≈ {Math.round(it.distance)} m
                              </div>
                            ) : null}
                            <div className="text-sm text-text-secondary mt-1">
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
                            ? "bg-primary text-background shadow-lg"
                            : "bg-surface text-text hover:bg-surface/80"
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
                            <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {it.title || it.name}
                          </p>
                          {tab === "live" && it.distance ? (
                            <div className="text-sm text-text-secondary mt-1">
                              ≈ {Math.round(it.distance)} m
                            </div>
                          ) : null}
                          <div className="text-sm text-text-secondary mt-1 truncate">
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
              isDarkMode ? "bg-surface" : "bg-background"
            } absolute top-0 end-0 h-full w-80 max-w-[85vw] shadow-2xl transform transition-transform duration-300 ${
              sidebarOpen
                ? "translate-x-0"
                : isRtl
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <div
              className={`flex items-center justify-between p-4 border-b ${
                isDarkMode ? "border-border" : "border-border"
              }`}
            >
              <h2
                className={`${
                  isDarkMode ? "text-text" : "text-text"
                } text-xl font-bold`}
              >
                Navigation
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode ? "hover:bg-surface/80" : "hover:bg-surface/80"
                }`}
              >
                <FaTimes
                  className={`${
                    isDarkMode ? "text-text-secondary" : "text-text-secondary"
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
                      ? "bg-primary text-background"
                      : "bg-surface text-text-secondary hover:bg-surface/80"
                  }`}
                >
                  All Items
                </button>
                <button
                  onClick={() => setTab("live")}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium ${
                    tab === "live"
                      ? "bg-primary text-background"
                      : "bg-surface text-text-secondary hover:bg-surface/80"
                  }`}
                >
                  Nearby
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {nearbyLoading ? (
                <div className="p-6 text-center">
                  <FaSpinner className="w-8 h-8 animate-spin text-yellow-500 mx-auto" />
                  <p className="mt-2 text-text-secondary">
                    Finding nearby items...
                  </p>
                </div>
              ) : currentItems.length === 0 ? (
                <div className="p-6 text-center text-text-secondary">
                  {tab === "live"
                    ? "No nearby items found"
                    : "No items available"}
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {currentItems.map((it) => {
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
                          isSel ? "ring-2 ring-primary" : "hover:scale-[1.01]"
                        } bg-surface`}
                      >
                        <div className="relative w-full h-36 bg-gray-100">
                          {img ? (
                            <img
                              src={img}
                              alt={it.title || it.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 text-text">
                          <div className="font-semibold truncate">
                            {it.title || it.name}
                          </div>
                          <div className="text-sm text-text-secondary mt-1">
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
}
