import { useState, useEffect } from "react";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import { guideService } from "../../apis/guideService";
import { placeService } from "../../apis/placeService";
import { tourItemService } from "../../apis/tourItemService";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/common/LoadingScreen";
import StatsOverview from "../../components/analytics/StatsOverview";
import ChartComponent from "../../components/analytics/ChartComponent";
import {FaMapMarkedAlt,FaCalendarCheck,FaMoneyBillWave,FaStar,FaPlus,FaTimes,FaEye} from "react-icons/fa";

const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(20px); 
    }
    to { 
      opacity: 1;
      transform: translateY(0); 
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
  
  .animate-slideUp {
    animation: slideUp 0.3s ease-out;
  }

  /* Custom Scrollbar for Webkit browsers */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: ${document.documentElement.classList.contains('dark') ? '#2c1b0f' : '#f3f4f6'};
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #D5B36A;
    border-radius: 10px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #C7A15C;
  }
`;

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
    if (showAddTourModal || previewOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddTourModal, previewOpen]);

  useEffect(() => {
    fetchDashboardData();
    fetchPlaces();
    fetchMyTours();
  }, []);

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

  const hasPublishedItems = (tour) => {
    if (!tour) return false;
    if (typeof tour.publishedItemsCount === "number") {
      return tour.publishedItemsCount > 0;
    }
    const items = tour.tourItems || tour.items || tour.waypoints || [];
    return items.some((item) => item && item.isPublished === true);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await guideService.getDashboardStats();
      const data = response.data || {};

      const enrollmentTrend = (data.enrollmentTrends || []).map((item) => ({
        name: item.day,
        enrollments: item.count || 0,
      }));

      const earningsTrend = (data.earningsTrends || []).map((item) => ({
        name: item.day,
        earnings: item.amount || 0,
      }));

      const tourPerformance = (data.tourPerformance || []).map((item) => ({
        name: item.name,
        enrollments: item.enrollments || 0,
        value: item.enrollments || 0,
        revenue: item.revenue || 0,
      }));

      setDashboardData({
        totalTours: data.totalTours || data.toursCount || 0,
        activeTours: data.publishedTours || data.published || 0,
        totalEnrollments: data.totalEnrollments || data.enrollmentsCount || 0,
        totalEarnings: data.totalEarnings || data.totalRevenue || 0,
        averageRating: data.averageRating || 0,
        enrollmentTrend,
        earningsTrend,
        tourPerformance,
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

      fetchDashboardData();
      toast.success("Tour created successfully!");
    } catch (err) {
      console.error("Error creating tour:", err);
      console.error("Full error response:", err.response?.data);

      let errorMessage = "Failed to create tour. ";

      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
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

  if (loading) {
    return <LoadingScreen />;
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen px-4">
        <div className={`text-center ${textColor}`}>
          <p className="text-red-500 mb-4">{error || "Failed to load dashboard"}</p>
          <button onClick={fetchDashboardData} className="px-6 py-3 bg-[#D5B36A] text-black rounded-lg hover:bg-opacity-90 transition-all">
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
    {
      title: t("guide.totalRating") || "Average Rating",
      value: dashboardData.averageRating.toFixed(1),
      icon: FaStar,
      unit: "/ 5",
      bgColor: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <>
      <style>{customStyles}</style>
      
      <div className="space-y-4 md:space-y-6 p-3 md:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className={`text-xl md:text-2xl font-bold ${textColor} mb-1`}>
            {t("guide.myOverview")}
          </h2>
        </div>
        <button onClick={() => setShowAddTourModal(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium shadow-lg whitespace-nowrap w-full sm:w-auto">
          <FaPlus />
          <span className="text-sm md:text-base">{t("guide.tours.add") || "Add Tour"}</span>
        </button>
      </div>

      <div>
        <StatsOverview stats={stats} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <ChartComponent type="line" title={t("guide.enrollmentsTrend")} data={dashboardData.enrollmentTrend} dataKey="enrollments" colors={["#7C3AED", "#C7A15C"]}/>
        <ChartComponent type="line" title={t("guide.earningsTrend")} data={dashboardData.earningsTrend} dataKey="earnings" colors={["#10B981", "#D5B36A"]}/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <ChartComponent type="bar" title={t("guide.tourPerformance")} data={dashboardData.tourPerformance} dataKey="enrollments" colors={["#F59E0B", "#D5B36A"]}/>
        <ChartComponent type="pie" title={t("guide.analytics.tourPerformance")} data={dashboardData.tourPerformance} dataKey="value" colors={["#D5B36A", "#C7A15C", "#E2C784", "#B8860B", "#DAA520"]}/>
      </div>

      <div className={`${cardBg} rounded-xl border ${borderColor} p-4 md:p-6`}>
        <h3 className={`text-base md:text-lg font-semibold ${textColor} mb-4`}>
          {t("guide.myTours") || "My Tours"}
        </h3>
        {loadingTours ? (
          <div className="flex items-center justify-center py-12">
            <LoadingScreen />
          </div>
        ) : myTours.length === 0 ? (
          <p className={`${secondaryText} text-center py-8 text-sm md:text-base`}>
            {t("guide.noTours") || "No tours created yet. Create your first tour!"}
          </p>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {myTours.map((tour) => (
              <div key={tour._id} className={`relative overflow-hidden rounded-lg border ${borderColor} hover:shadow-lg transition-shadow group`} style={{ background: isDarkMode ? "#1B1A17" : "#fff" }}>
                <div className="relative">
                  {tour.mainImage?.url ? (
                    <img src={tour.mainImage.url} alt={tour.name} title={tour.mainImage?.url || "No image URL"} className="w-full h-40 sm:h-48 md:h-56 object-cover"/>
                  ) : (
                    <div className="w-full h-40 sm:h-48 md:h-56 bg-gray-200 dark:bg-[#1f1f1f] flex items-center justify-center text-gray-500 text-xs md:text-sm">
                      <span>{t("guide.noImage") || "No Image"}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none">
                    {hasPublishedItems(tour) && (
                      <button onClick={() => navigate(`/guide/tour/${tour._id}`)} className={`pointer-events-auto flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/50 transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100`} aria-label={`Preview ${tour.name}`}>
                        <FaEye className="text-sm md:text-base" />
                      </button>
                    )}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent px-2 md:px-3 py-2">
                    <h4 className={`text-white font-semibold truncate text-xs md:text-sm`}>
                      {tour.name}
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={`${cardBg} rounded-xl border ${borderColor} p-4 md:p-6`}>
        <h3 className={`text-base md:text-lg font-semibold ${textColor} mb-4`}>
          {t("guide.recentEnrollments")}
        </h3>
        {dashboardData.recentEnrollments.length === 0 ? (
          <p className={`${secondaryText} text-center py-8 text-sm md:text-base`}>
            {t("guide.noEnrollments") || "No enrollments yet"}
          </p>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b ${borderColor}`}>
                    <th className={`text-left py-2 md:py-3 px-2 md:px-4 font-semibold ${secondaryText} whitespace-nowrap`}>
                      {t("guide.tourName") || "Tour Name"}
                    </th>
                    <th className={`text-left py-2 md:py-3 px-2 md:px-4 font-semibold ${secondaryText} whitespace-nowrap hidden sm:table-cell`}>
                      {t("guide.guestName") || "Guest Name"}
                    </th>
                    <th className={`text-left py-2 md:py-3 px-2 md:px-4 font-semibold ${secondaryText} whitespace-nowrap hidden md:table-cell`}>
                      {t("common.date") || "Date"}
                    </th>
                    <th className={`text-left py-2 md:py-3 px-2 md:px-4 font-semibold ${secondaryText} whitespace-nowrap`}>
                      {t("common.amount") || "Amount"}
                    </th>
                    <th className={`text-left py-2 md:py-3 px-2 md:px-4 font-semibold ${secondaryText} whitespace-nowrap`}>
                      {t("common.status") || "Status"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentEnrollments.map((item, index) => (
                    <tr key={item.id || index} className={`border-b ${borderColor} hover:${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} transition-colors`}>
                      <td className={`py-2 md:py-3 px-2 md:px-4 ${textColor}`}>
                        <div className="line-clamp-2">{item.tourName}</div>
                      </td>
                      <td className={`py-2 md:py-3 px-2 md:px-4 ${textColor} hidden sm:table-cell`}>
                        {item.guestName}
                      </td>
                      <td className={`py-2 md:py-3 px-2 md:px-4 ${secondaryText} hidden md:table-cell`}>
                        {item.date}
                      </td>
                      <td className={`py-2 md:py-3 px-2 md:px-4 ${textColor} whitespace-nowrap`}>
                        {item.amount} {t("guide.currency") || "EGP"}
                      </td>
                      <td className={`py-2 md:py-3 px-2 md:px-4`}>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ item.status === "started" || item.status === "active" ? "bg-green-500/20 text-green-400" : item.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>
                          {t(`common.statuses.${item.status}`) || item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showAddTourModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-4 animate-fadeIn overflow-hidden">
          <div className={`${cardBg} rounded-2xl border ${borderColor} shadow-2xl p-4 md:p-6 lg:p-8 max-w-md md:max-w-3xl lg:max-w-5xl w-full my-4 animate-slideUp custom-scrollbar overflow-y-auto`} style={{maxHeight: 'calc(100vh - 2rem)'}}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={`text-lg md:text-2xl font-bold ${textColor} mb-1`}>
                  {t("guide.tours.addNew") || "Add New Tour"}
                </h3>
                <p className={`text-xs md:text-sm ${secondaryText}`}>
                  Fill in the details below to create a new tour experience
                </p>
              </div>
              <button onClick={() => setShowAddTourModal(false)} className="p-2 hover:bg-[#D5B36A]/20 rounded-lg transition shrink-0">
                <FaTimes className={`${textColor} text-lg md:text-xl`} />
              </button>
            </div>

            <form onSubmit={handleAddTourSubmit} className="space-y-4 md:space-y-6">
              <div className="w-full">
                <label className={`block text-sm md:text-base font-semibold ${textColor} mb-2`}>
                  {t("guide.tours.name") || "Tour Name"} <span className="text-red-500">*</span>
                </label>
                <input type="text" name="name" value={newTourForm.name} onChange={handleAddTourChange} placeholder="Enter a captivating tour name" required maxLength={100} className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20 text-sm md:text-base transition-all`}/>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs ${secondaryText}`}>
                    {newTourForm.name.length}/100 characters
                  </span>
                </div>
              </div>

              <div className="w-full">
                <label className={`block text-sm md:text-base font-semibold ${textColor} mb-2`}>
                  {t("guide.tours.description") || "Description"} <span className="text-red-500">*</span>
                </label>
                <textarea name="description" value={newTourForm.description} onChange={handleAddTourChange} placeholder="Describe what makes this tour special and unique..." required rows="4" maxLength={2000} className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20 text-sm md:text-base transition-all resize-none`}/>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-xs ${secondaryText}`}>
                    Minimum 10 characters required
                  </span>
                  <span className={`text-xs ${secondaryText}`}>
                    {newTourForm.description.length}/2000
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className={`block text-sm md:text-base font-semibold ${textColor} mb-2`}>
                    {t("guide.tours.price") || "Price (EGP)"} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${secondaryText} font-medium`}>
                      EGP
                    </span>
                    <input type="number" name="price" value={newTourForm.price} onChange={handleAddTourChange} placeholder="0.99" step="0.01" min="0.99" required className={`w-full pl-16 pr-4 py-3 rounded-lg border ${borderColor} ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20 text-sm md:text-base transition-all`}/>
                  </div>
                  <span className={`text-xs ${secondaryText} mt-1 block`}>
                    Minimum price: 0.99 EGP
                  </span>
                </div>
                <div>
                  <label className={`block text-sm md:text-base font-semibold ${textColor} mb-2`}>
                    {t("guide.tours.place") || "Place/Location"} <span className="text-red-500">*</span>
                  </label>
                  <select name="place" value={newTourForm.place} onChange={handleAddTourChange} required disabled={loadingPlaces || places.length === 0} className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20 text-sm md:text-base transition-all ${ loadingPlaces || places.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}>
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
                      {t("guide.tours.noPlacesAvailable") || "No places available. Contact admin to add places."}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className={`block text-sm md:text-base font-semibold ${textColor} mb-2`}>
                    {t("guide.tours.categories") || "Categories"}
                  </label>
                  <input type="text" name="categories" value={newTourForm.categories} onChange={handleAddTourChange} placeholder="Adventure, Cultural..." className={`w-full px-4 py-3 rounded-lg border ${borderColor}  ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"}  ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20 text-sm md:text-base transition-all`}/>
                  <span className={`text-xs ${secondaryText} mt-1 block`}>
                    Comma-separated
                  </span>
                </div>

                <div>
                  <label className={`block text-sm md:text-base font-semibold ${textColor} mb-2`}>
                    {t("Tags") || "Tags"}
                  </label>
                  <input type="text" name="tags" value={newTourForm.tags} onChange={handleAddTourChange} placeholder="outdoor, guided..." className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20 text-sm md:text-base transition-all`}/>
                  <span className={`text-xs ${secondaryText} mt-1 block`}>
                    Comma-separated
                  </span>
                </div>

                <div>
                  <label className={`block text-sm md:text-base font-semibold ${textColor} mb-2`}>
                    {t("Languages") || "Languages"}
                  </label>
                  <input type="text" name="languages" value={newTourForm.languages} onChange={handleAddTourChange} placeholder="English, Arabic..." className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20 text-sm md:text-base transition-all`}/>
                  <span className={`text-xs ${secondaryText} mt-1 block`}>
                    Comma-separated
                  </span>
                </div>
              </div>

              <div className="w-full">
                <label className={`block text-sm md:text-base font-semibold ${textColor} mb-2`}>
                  Cover Image
                </label>
                <div className={`relative border-2 border-dashed ${borderColor} rounded-lg p-6 md:p-8 text-center hover:border-[#D5B36A] transition-all`}>
                  <input type="file" name="mainImage" onChange={handleAddTourChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                  <div className={`${secondaryText}`}>
                    <div className="mb-2">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm md:text-base font-medium">
                      {newTourForm.mainImage?.name || "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>

              <div className={`flex flex-col sm:flex-row gap-3 pt-6 border-t ${borderColor}`}>
                <button type="button" onClick={() => setShowAddTourModal(false)} className={`flex-1 px-6 py-3 rounded-lg border-2 ${borderColor}  ${textColor} hover:bg-[#D5B36A]/10 transition-all font-semibold text-sm md:text-base`}>
                  {t("Cancel") || "Cancel"}
                </button>
                <button type="submit" className="flex-1 px-6 py-3 bg-linear-to-r from-[#C7A15C] to-[#E2C784] text-black rounded-lg hover:from-[#D5B36A] hover:to-[#F0D9A0] transition-all font-semibold text-sm md:text-base shadow-lg shadow-[#C7A15C]/30">
                  {t("Create") || "Create Tour"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default GuideDashboard;