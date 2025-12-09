import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import { guideService } from "../../apis/guideService";
import { placeService } from "../../apis/placeService";
import { tourItemService } from "../../apis/tourItemService";
import { toast } from "react-toastify";
import GoldenSpinner from "../../components/common/GoldenSpinner";
import StatsOverview from "../../components/analytics/StatsOverview";
import ChartComponent from "../../components/analytics/ChartComponent";
import {
  FaMapMarkedAlt,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaStar,
  FaPlus,
  FaTimes,
  FaBoxOpen,
  FaEye,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { main } from "motion/react-client";

const GuideDashboard = () => {
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [myTours, setMyTours] = useState([]);
  const [loadingTours, setLoadingTours] = useState(false);
  const [showAddTourModal, setShowAddTourModal] = useState(false);
  const [newTourForm, setNewTourForm] = useState({
    name: "",
    description: "",
    price: "",
    place: "",
    categories: "",
    tags: "",
    languages: "",
  });
  const [previewTab, setPreviewTab] = useState("all");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTour, setPreviewTour] = useState(null);
  const [previewItems, setPreviewItems] = useState([]);
  const [nearbyItems, setNearbyItems] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchPlaces();
    fetchMyTours();
  }, []);

  // Handle language/direction changes
  useEffect(() => {
    const handleLanguageChange = () => {
      const currentLanguage = i18n.language;
      const direction = currentLanguage === "ar" ? "rtl" : "ltr";
      document.documentElement.dir = direction;
      document.documentElement.lang = currentLanguage;
    };

    handleLanguageChange();
    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  const fetchMyTours = async () => {
    try {
      setLoadingTours(true);
      const response = await guideService.getMyTours(1, 100);
      // guideService returns the backend payload; backend returns { success, status, count, data }
      setMyTours((response && response.data) || []);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setMyTours([]);
    } finally {
      setLoadingTours(false);
    }
  };

  const fetchPlaces = async () => {
    try {
      setLoadingPlaces(true);
      const placesData = await placeService.getAllPlaces();
      setPlaces(placesData);
    } catch (err) {
      console.error("Error fetching places:", err);
      setPlaces([]);
    } finally {
      setLoadingPlaces(false);
    }
  };

  // Helper function to check if tour has published items
  const hasPublishedItems = (tour) => {
    if (!tour) return false;
    // Check if backend provided published items count
    if (typeof tour.publishedItemsCount === "number") {
      return tour.publishedItemsCount > 0;
    }
    // Fallback: check items array for published items
    const items = tour.tourItems || tour.items || tour.waypoints || [];
    return items.some((item) => item && item.isPublished === true);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await guideService.getDashboardStats();
      const data = response.data || {};

      setDashboardData({
        totalTours: data.totalTours || data.toursCount || 0,
        activeTours: data.publishedTours || data.published || 0,
        totalEnrollments: data.totalEnrollments || data.enrollmentsCount || 0,
        totalEarnings: data.totalEarnings || data.totalRevenue || 0,
        averageRating: data.averageRating || 0,
        enrollmentTrend: data.enrollmentTrends || data.enrollmentTrend || [],
        earningsTrend: data.earningsTrends || data.earningsTrend || [],
        tourPerformance: data.tourPerformance || [],
        recentEnrollments: data.recentEnrollments || [],
      });
    } catch (err) {
      console.error("Error fetching guide dashboard data:", err);
      setError("Failed to load dashboard data");
      setDashboardData({
        totalTours: 0,
        activeTours: 0,
        totalEnrollments: 0,
        totalEarnings: 0,
        averageRating: 0,
        enrollmentTrend: [],
        earningsTrend: [],
        tourPerformance: [],
        recentEnrollments: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // Preview helpers: open/close preview modal and load tour items
  const openPreview = async (tour) => {
    try {
      setPreviewTour(tour);
      setPreviewOpen(true);
      // try to load tour items (if service exists)
      const res = await tourItemService.getTourItems(tour._id || tour.id);
      // tourItemService may return either { data: [...] } or the array itself
      const items = res?.data || res || [];
      setPreviewItems(items);
      setNearbyItems(items);
      setPreviewTab("all");
    } catch (err) {
      console.error("Failed loading preview items:", err);
      setPreviewItems([]);
      setNearbyItems([]);
    }
  };

  const closePreview = () => {
    setPreviewOpen(false);
    setPreviewTour(null);
    setPreviewItems([]);
    setNearbyItems([]);
    setPreviewTab("all");
  };

  // Data is loaded from backend via `fetchDashboardData` using `guideService.getDashboardStats`

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";

  const handleAddTourChange = (e) => {
    const { name, value } = e.target;
    if (name === "mainImage") {
      setNewTourForm((prev) => ({ ...prev, [name]: e.target.files[0] }));
      console.log("Selected file:", e.target.files[0]);
      return;
    }
    setNewTourForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTourSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate inputs before submitting
      if (
        !newTourForm.name ||
        newTourForm.name.length < 3 ||
        newTourForm.name.length > 100
      ) {
        toast.error("Tour name must be between 3 and 100 characters");
        return;
      }

      if (
        !newTourForm.description ||
        newTourForm.description.length < 10 ||
        newTourForm.description.length > 2000
      ) {
        toast.error("Description must be between 10 and 2000 characters");
        return;
      }

      if (!newTourForm.price || parseFloat(newTourForm.price) < 0.99) {
        toast.error("Price must be at least 0.99");
        return;
      }

      if (!newTourForm.place) {
        toast.error("Please select a place/location");
        return;
      }

      // Call API to add tour
      const tourData = {
        name: newTourForm.name,
        description: newTourForm.description,
        price: parseFloat(newTourForm.price),
        place: newTourForm.place,
        categories: newTourForm.categories
          ? newTourForm.categories
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c)
          : [],
        tags: newTourForm.tags
          ? newTourForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t)
          : [],
        languages: newTourForm.languages
          ? newTourForm.languages
              .split(",")
              .map((l) => l.trim())
              .filter((l) => l)
          : [],
        mainImage: newTourForm.mainImage,
      };

      console.log("Submitting tour data:", tourData);
      await guideService.createTour(tourData);

      // Reset form and close modal
      setNewTourForm({
        name: "",
        description: "",
        price: "",
        place: "",
        categories: "",
        tags: "",
        languages: "",
      });
      setShowAddTourModal(false);

      // Refresh dashboard data
      fetchDashboardData();
      toast.success("Tour created successfully!");
    } catch (err) {
      console.error("Error creating tour:", err);
      console.error("Full error response:", err.response?.data);

      // Extract detailed error message
      let errorMessage = "Failed to create tour. ";

      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        // Format validation errors
        const fieldErrors = err.response.data.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join("\n");
        errorMessage += "\n" + fieldErrors;
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += "Please check all required fields.";
      }

      toast.error(errorMessage);
    }
  };

  // helper for safe translations with default fallbacks
  const safeT = (key, def) => t(key, { defaultValue: def });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-center ${textColor}`}>
          <GoldenSpinner
            size={56}
            label={t("common.loading") || "Loading..."}
          />
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-center ${textColor}`}>
          <p className="text-red-500">{error || "Failed to load dashboard"}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-opacity-90"
          >
            {t("common.retry") || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: t("guide.totalTours"),
      value: dashboardData.totalTours,
      icon: FaMapMarkedAlt,
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      title: t("guide.activeTours"),
      value: dashboardData.activeTours,
      icon: FaCalendarCheck,
      bgColor: "from-green-500 to-green-600",
    },
    {
      title: t("guide.totalEnrollments"),
      value: dashboardData.totalEnrollments,
      icon: FaCalendarCheck,
      bgColor: "from-purple-500 to-purple-600",
    },
    {
      title: t("guide.totalEarnings"),
      value: `${dashboardData.totalEarnings.toLocaleString()}`,
      icon: FaMoneyBillWave,
      unit: t("guide.currency") || "EGP",
      bgColor: "from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <div className="space-y-6  p-4">
      {/* Header with Add Tour Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-2xl font-bold ${textColor} mb-2`}>
            {t("guide.myOverview")}
          </h2>
        </div>
        <button
          onClick={() => setShowAddTourModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#D5B36A] text-black rounded-lg 
                   hover:bg-[#E2C784] transition-all font-medium shadow-lg"
        >
          <FaPlus />
          {t("guide.tours.add") || "Add Tour"}
        </button>
      </div>

      {/* Stats Overview */}
      <div>
        <StatsOverview stats={stats} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="line"
          title={t("guide.enrollmentsTrend")}
          data={dashboardData.enrollmentTrend}
          dataKey="enrollments"
          colors={["#7C3AED", "#C7A15C"]}
        />
        <ChartComponent
          type="line"
          title={t("guide.earningsTrend")}
          data={dashboardData.earningsTrend}
          dataKey="earnings"
          colors={["#10B981", "#D5B36A"]}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="bar"
          title={t("guide.tourPerformance")}
          data={dashboardData.tourPerformance}
          dataKey="enrollments"
          colors={["#F59E0B", "#D5B36A"]}
        />
        <ChartComponent
          type="pie"
          title={t("guide.analytics.tourPerformance")}
          data={dashboardData.tourPerformance}
          dataKey="value"
          colors={["#D5B36A", "#C7A15C", "#E2C784", "#B8860B", "#DAA520"]}
        />
      </div>

      {/* My Tours Section */}
      <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          {t("guide.myTours") || "My Tours"}
        </h3>
        {loadingTours ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D5B36A]"></div>
          </div>
        ) : myTours.length === 0 ? (
          <p className={`${secondaryText} text-center py-8`}>
            {t("guide.noTours") ||
              "No tours created yet. Create your first tour!"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myTours.map((tour) => (
              <div
                key={tour._id}
                className={`relative overflow-hidden rounded-lg border ${borderColor} hover:shadow-lg transition-shadow group`}
                style={{ background: isDarkMode ? "#1B1A17" : "#fff" }}
              >
                <div className="relative">
                  {tour.mainImage?.url ? (
                    <img
                      src={tour.mainImage.url}
                      alt={tour.name}
                      title={tour.mainImage?.url || "No image URL"}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-200 dark:bg-[#1f1f1f] flex items-center justify-center text-gray-500">
                      <span>{t("guide.noImage") || "No Image"}</span>
                    </div>
                  )}

                  {/* Center preview button with blurred translucent background; small external link opens full page in new tab */}
                  <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none">
                    {hasPublishedItems(tour) && (
                      <button
                        onClick={() => navigate(`/guide/tour/${tour._id}`)}
                        className={`pointer-events-auto flex items-center justify-center w-12 h-12 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100`}
                        aria-label={`Preview ${tour.name}`}
                      >
                        <FaEye />
                      </button>
                    )}
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <h4 className={`text-white font-semibold truncate`}>
                      {tour.name}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`w-full max-w-5xl rounded-xl overflow-hidden ${cardBg} border ${borderColor} p-4`}
          >
            <div className="flex items-start justify-between">
              <h3 className={`text-xl font-bold ${textColor}`}>
                {previewTour?.name || "Preview"}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    window.open(
                      `/guide/tour/${previewTour?._id || previewTour?.id}`,
                      "_blank"
                    )
                  }
                  className="px-3 py-1 rounded bg-[#D5B36A] text-black"
                >
                  {t("guide.openFull") || "Open full page"}
                </button>
                <button
                  onClick={closePreview}
                  className="p-2 rounded hover:bg-gray-200"
                >
                  <FaTimes className={textColor} />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {previewTour?.mainImage?.url ? (
                  <img
                    src={previewTour.mainImage.url}
                    alt={previewTour.name}
                    className="w-full h-64 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 dark:bg-[#1f1f1f] flex items-center justify-center text-gray-500 rounded">
                    {t("guide.noImage") || "No Image"}
                  </div>
                )}

                <div className={`mt-4 ${textColor} leading-relaxed`}>
                  <p>
                    {previewTour?.description ||
                      previewTour?.shortDescription ||
                      ""}
                  </p>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-3">
                  <button
                    onClick={() => setPreviewTab("all")}
                    className={`px-3 py-1 rounded ${
                      previewTab === "all"
                        ? "bg-[#D5B36A] text-black dark:text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {t("guide.showAll") || "Show All"}
                  </button>
                  <button
                    onClick={() => setPreviewTab("live")}
                    className={`px-3 py-1 rounded ${
                      previewTab === "live"
                        ? "bg-[#D5B36A] text-black dark:text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {t("guide.liveMode") || "Live Mode"}
                  </button>
                </div>

                <div className="overflow-y-auto max-h-80 pr-2">
                  {(previewTab === "all" ? previewItems : nearbyItems)
                    .length === 0 ? (
                    <div className={`text-sm ${secondaryText}`}>
                      {previewTab === "live"
                        ? t("guide.liveNone") || "No nearby items"
                        : t("guide.noItems") || "No items"}
                    </div>
                  ) : (
                    (previewTab === "all" ? previewItems : nearbyItems).map(
                      (it) => (
                        <div
                          key={it._id || it.id}
                          className={`p-3 mb-2 rounded border ${borderColor} ${cardBg}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold">
                                {it.title || it.name}
                              </div>
                              <div
                                className={`text-sm ${secondaryText} line-clamp-2`}
                              >
                                {it.script ||
                                  it.content ||
                                  it.description ||
                                  "—"}
                              </div>
                            </div>
                            {it.distance != null && (
                              <div className="text-xs text-gray-500 ml-2">
                                {Math.round(it.distance)} m
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Table */}
      <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          {t("guide.recentEnrollments")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  Tour Name
                </th>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  Guest Name
                </th>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  Date
                </th>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  Amount
                </th>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentEnrollments.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b ${borderColor} hover:${
                    isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"
                  } transition-colors`}
                >
                  <td className={`py-3 px-4 ${textColor}`}>{item.tourName}</td>
                  <td className={`py-3 px-4 ${textColor}`}>{item.guestName}</td>
                  <td className={`py-3 px-4 ${secondaryText}`}>{item.date}</td>
                  <td className={`py-3 px-4 ${textColor}`}>
                    {item.amount} EGP
                  </td>
                  <td className={`py-3 px-4`}>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Completed"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tour Modal */}
      {showAddTourModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`${cardBg} rounded-xl border ${borderColor} p-6 max-w-md w-full`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${textColor}`}>
                {t("guide.tours.addNew") || "Add New Tour"}
              </h3>
              <button
                onClick={() => setShowAddTourModal(false)}
                className="p-2 hover:bg-[#D5B36A]/20 rounded-lg transition"
              >
                <FaTimes className={textColor} />
              </button>
            </div>

            <form onSubmit={handleAddTourSubmit} className="space-y-4">
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {t("guide.tours.name") || "Tour Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={newTourForm.name}
                  onChange={handleAddTourChange}
                  placeholder="Enter tour name"
                  required
                  maxLength={100}
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
                <span className={`text-xs ${secondaryText}`}>
                  {newTourForm.name.length}/100 characters
                </span>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {t("guide.tours.description") || "Description"}
                </label>
                <textarea
                  name="description"
                  value={newTourForm.description}
                  onChange={handleAddTourChange}
                  placeholder="Enter tour description (min 10 characters)"
                  required
                  rows="3"
                  maxLength={2000}
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
                <span className={`text-xs ${secondaryText}`}>
                  {newTourForm.description.length}/2000 characters (min 10)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-2`}
                  >
                    {t("guide.tours.price") || "Price (EGP)"}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newTourForm.price}
                    onChange={handleAddTourChange}
                    placeholder="0.99"
                    step="0.01"
                    min="0.99"
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                              ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} 
                              ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-2`}
                  >
                    {t("guide.tours.place") || "Place/Location"}
                  </label>
                  <select
                    name="place"
                    value={newTourForm.place}
                    onChange={handleAddTourChange}
                    required
                    disabled={loadingPlaces || places.length === 0}
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                              ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} 
                              ${textColor} focus:outline-none focus:border-[#D5B36A]
                              ${
                                loadingPlaces || places.length === 0
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                  >
                    <option value="">
                      {loadingPlaces ? "Loading places..." : "Select a place"}
                    </option>
                    {places.map((place) => (
                      <option key={place._id} value={place._id}>
                        {place.name} ({place.city}, {place.country})
                      </option>
                    ))}
                  </select>
                  {places.length === 0 && !loadingPlaces && (
                    <p className={`text-xs ${secondaryText} mt-1`}>
                      {t("guide.tours.noPlacesAvailable") ||
                        "No places available. Contact admin to add places."}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {t("guide.tours.categories") ||
                    "Categories (comma-separated)"}
                </label>
                <input
                  type="text"
                  name="categories"
                  value={newTourForm.categories}
                  onChange={handleAddTourChange}
                  placeholder="e.g., Adventure, Cultural, Historical"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {t("Tags (comma-separated)") || "Tags (comma-separated)"}
                </label>
                <input
                  type="text"
                  name="tags"
                  value={newTourForm.tags}
                  onChange={handleAddTourChange}
                  placeholder="e.g., outdoor, guided, family-friendly"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {t("Languages (comma-separated)") ||
                    "Languages (comma-separated)"}
                </label>
                <input
                  type="text"
                  name="languages"
                  value={newTourForm.languages}
                  onChange={handleAddTourChange}
                  placeholder="e.g., English, Arabic, French"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {/* {t("guide.tours.languages") || "Languages (comma-separated)"} */}
                  Image
                </label>
                <input
                  type="file"
                  name="mainImage"
                  onChange={handleAddTourChange}
                  accept="image/*"
                  placeholder="Select Cover Image"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} 
                            ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} 
                            ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTourModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} 
                            ${textColor} hover:bg-[#D5B36A]/10 transition-all font-medium`}
                >
                  {t("Cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg 
                           hover:bg-[#E2C784] transition-all font-medium"
                >
                  {t("Create") || "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuideDashboard;
