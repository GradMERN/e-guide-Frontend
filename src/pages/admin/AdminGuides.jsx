import { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaPhone, FaStar, FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import axiosClient from "../../apis/axiosClient";
import LoadingScreen from "../../components/common/LoadingScreen"; 

const AdminGuides = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [guideTours, setGuideTours] = useState({});

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setIsDarkMode(storedTheme === "dark");

    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme") || "dark";
      setIsDarkMode(theme === "dark");
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get("/admin");
      const guidesList = response.data.data.filter(
        (user) => user.role === "guide"
      );
      setGuides(guidesList);

      const tourPromises = guidesList.map(async (guide) => {
        try {
          const toursResponse = await axiosClient.get(`/tours/guide/${guide._id}`);
          return { id: guide._id, tours: toursResponse.data.data || [] };
        } catch (err) {
          console.error(`Error fetching tours for guide ${guide._id}:`, err);
          return { id: guide._id, tours: [] };
        }
      });

      const results = await Promise.all(tourPromises);
      const toursMap = {};
      results.forEach(res => { toursMap[res.id] = res.tours; });
      setGuideTours(toursMap);

    } catch (err) {
      console.error("Error fetching guides:", err);
      setError(t("admin.guides.loadError") || "Failed to load guides");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 800);
    }
  };

  const filteredGuides = guides.filter(
    (guide) =>
      guide.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guide.city && guide.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const bgColor = isDarkMode ? "bg-[#0F0E0C]" : "bg-gray-50";
  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const inputBg = isDarkMode ? "bg-[#0F0E0C]" : "bg-gray-50";
  const statsBg = isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-100";

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`space-y-6 animate-fadeIn pb-10`} dir="ltr">

      <div className="text-left">
        <h1 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-2`}>
          {t("admin.guides.title", "Guides Management")}
        </h1>
        <p className={secondaryText}>{t("admin.guides.subtitle", "Monitor and manage registered guides")}</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className={`${cardBg} border ${borderColor} rounded-xl p-3 sm:p-4 shadow-sm`}>
        <div className="relative">
          <FaSearch className={`absolute left-4 top-1/2 -translate-y-1/2 ${secondaryText}`} />
          <input type="text" placeholder={t("admin.guides.searchPlaceholder", "Search by name or city...")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-11 pr-4 py-2.5 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D5B36A]/50 transition-all`}/>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t("admin.guides.totalGuides", "Total Guides"), val: guides.length, color: "text-[#D5B36A]" },
          { label: t("admin.guides.activeGuides", "Active Guides"), val: guides.filter((g) => (guideTours[g._id] || []).length > 0).length, color: "text-blue-500" },
          { label: t("admin.guides.totalTours", "Total Tours"), val: Object.values(guideTours).reduce((sum, tours) => sum + tours.length, 0), color: "text-green-500" }
        ].map((stat, i) => (
          <div key={i} className={`${cardBg} border ${borderColor} rounded-xl p-5 shadow-sm`}>
            <p className={`${secondaryText} text-xs font-bold uppercase tracking-wider mb-1`}>{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((guide) => (
            <div key={guide._id} className={`${cardBg} border ${borderColor} rounded-2xl p-6 hover:shadow-xl hover:border-[#D5B36A]/40 transition-all duration-300 group flex flex-col`}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-xl shadow-lg shrink-0">
                  {guide.firstName?.charAt(0)}
                </div>
                <div className="min-w-0 text-left">
                  <p className={`${textColor} font-bold text-lg truncate`}>
                    {guide.firstName} {guide.lastName}
                  </p>
                  <p className={`text-xs ${secondaryText} font-medium`}>
                    {guide.age ? `${guide.age} ${t("common.yearsOld", "years old")}` : t("common.ageNotSet", "Age not set")}
                  </p>
                </div>
              </div>

              <div className={`space-y-3 mb-6 pb-6 border-b ${borderColor} text-left`}>
                <div className="flex items-center gap-3 text-sm">
                  <FaPhone className="text-[#D5B36A] shrink-0" />
                  <span className={secondaryText}>{guide.phone || "---"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FaMapMarkedAlt className="text-[#D5B36A] shrink-0" />
                  <span className={`${secondaryText} truncate`}>
                    {guide.city || "N/A"}, {guide.country || "N/A"}
                  </span>
                </div>
                <p className={`text-xs ${secondaryText} truncate opacity-70`}>{guide.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className={`${statsBg} rounded-xl p-3 text-center`}>
                  <p className="text-xl font-bold text-[#D5B36A]">
                    {(guideTours[guide._id] || []).length}
                  </p>
                  <p className={`text-[10px] uppercase font-bold tracking-tighter ${secondaryText}`}>
                    {t("admin.guides.tours", "Tours")}
                  </p>
                </div>
                <div className={`${statsBg} rounded-xl p-3 text-center`}>
                  <p className="flex items-center justify-center gap-1">
                    <FaStar className="text-yellow-500 text-sm" />
                    <span className="text-xl font-bold text-white">
                      {guide.ratingsAverage || "4.5"}
                    </span>
                  </p>
                  <p className={`text-[10px] uppercase font-bold tracking-tighter ${secondaryText}`}>
                    {t("admin.guides.rating", "Rating")}
                  </p>
                </div>
              </div>

              <div className="mt-auto text-left">
                <p className={`text-xs font-bold uppercase tracking-widest ${secondaryText} mb-3`}>
                  {t("admin.guides.recentTours", "Recent Activity")}
                </p>
                {(guideTours[guide._id] || []).length > 0 ? (
                  <div className="space-y-2">
                    {(guideTours[guide._id] || []).slice(0, 2).map((tour) => (
                      <div key={tour._id} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#D5B36A]" />
                          <p className={`text-xs ${secondaryText} truncate italic`}>
                            {tour.name}
                          </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-xs ${secondaryText} italic opacity-50`}>{t("admin.guides.noTours", "No tours listed yet")}</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <div className={`text-lg ${secondaryText}`}>
              {searchTerm ? t("admin.guides.notFound", "No guides match your search") : t("admin.guides.empty", "No guides found in the system")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuides;