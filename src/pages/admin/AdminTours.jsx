import { useState, useEffect } from "react";
import {FaEye,FaTrash,FaSearch,FaTimes,FaSpinner,FaStar,FaUsers,FaMapMarkerAlt,FaFilter,FaChevronLeft,FaChevronRight,} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";
import LoadingScreen from "../../components/common/LoadingScreen";

const AdminTours = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const toursPerPage = 10;

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
    fetchTours();
  }, [currentPage, statusFilter]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      setError(null);
      let url = `/tours?limit=${toursPerPage}&page=${currentPage}`;
      if (statusFilter === "published") url += "&isPublished=true";
      else if (statusFilter === "draft") url += "&isPublished=false";

      const response = await axiosClient.get(url);
      const toursData = response.data.data || [];
      setTours(toursData);
      const total = response.data.count || response.data.total || toursData.length;
      setTotalPages(Math.ceil(total / toursPerPage) || 1);
    } catch (err) {
      setError(t("admin.tours.loadError") || "Failed to load tours");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleDeleteTour = async (id, tourName) => {
    if (window.confirm(`${t("admin.tours.confirmDelete") || "Delete"} "${tourName}"?`)) {
      try {
        setActionLoading(id);
        await axiosClient.delete(`/tours/${id}`);
        setTours(tours.filter((t) => t._id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete tour");
      } finally {
        setActionLoading(null);
      }
    }
  };

  const filteredTours = tours.filter((tour) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tour.name?.toLowerCase().includes(searchLower) ||
      tour.place?.name?.toLowerCase().includes(searchLower) ||
      tour.guide?.firstName?.toLowerCase().includes(searchLower)
    );
  });

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const inputBg = isDarkMode ? "bg-[#0F0E0C]" : "bg-gray-50";
  const rowHover = isDarkMode ? "hover:bg-[#2c1b0f]/50" : "hover:bg-gray-50";

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6 pb-20 md:pb-10 animate-fadeIn px-4 sm:px-6" dir="ltr">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4">
        <div className="text-left">
          <h1 className={`text-2xl sm:text-3xl font-bold ${textColor}`}>
            {t("admin.tours.title", "Tours Management")}
          </h1>
          <p className={`${secondaryText} text-sm sm:text-base`}>{t("admin.tours.subtitle", "Review and manage all platform tours")}</p>
        </div>
        <div className={`w-full md:w-auto px-4 py-2 rounded-xl ${cardBg} border ${borderColor} shadow-sm text-center`}>
          <span className={secondaryText}>{t("admin.tours.total", "Total Tours")}: </span>
          <span className="text-[#D5B36A] font-bold">{tours.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl flex items-center justify-between animate-shake">
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => setError(null)} className="p-1"><FaTimes /></button>
        </div>
      )}

      <div className={`${cardBg} border ${borderColor} rounded-xl p-3 sm:p-4 shadow-sm`}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${secondaryText}`} />
            <input
              type="text"
              placeholder={t("admin.tours.searchPlaceholder", "Search...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 sm:py-2.5 ${inputBg} ${textColor} border ${borderColor} rounded-lg outline-none transition-all text-sm`}
            />
          </div>
          <div className="flex items-center gap-2">
            <FaFilter className={secondaryText} />
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className={`flex-1 md:flex-none px-3 py-2 sm:py-2.5 ${inputBg} ${textColor} border ${borderColor} rounded-lg outline-none text-sm`}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`hidden md:block ${cardBg} border ${borderColor} rounded-2xl shadow-xl overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"} border-b ${borderColor}`}>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#D5B36A]">Tour Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#D5B36A]">Guide</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#D5B36A]">Pricing</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#D5B36A]">Stats</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#D5B36A]">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#D5B36A] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5B36A]/10">
              {filteredTours.map((tour) => (
                <tr key={tour._id} className={`${rowHover} transition-colors group`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={tour.mainImage?.url || "/placeholder-tour.jpg"} className="w-10 h-10 rounded-lg object-cover" alt="" />
                      <div>
                        <p className={`font-bold ${textColor} text-sm`}>{tour.name}</p>
                        <p className="text-[10px] text-amber-500 uppercase flex items-center gap-1"><FaMapMarkerAlt /> {tour.place?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{tour.guide?.firstName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#D5B36A]">{tour.price} {tour.currency}</td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    <div className="flex flex-col gap-1">
                      <span className="text-yellow-500 flex items-center gap-1"><FaStar /> {tour.rating || 0}</span>
                      <span className="flex items-center gap-1"><FaUsers /> {tour.enrollmentsCount || 0}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${tour.isPublished ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}>
                      {tour.isPublished ? "Live" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => navigate(`/admin/tour/${tour._id}`)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg"><FaEye size={14} /></button>
                      <button onClick={() => handleDeleteTour(tour._id, tour.name)} disabled={actionLoading === tour._id} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                        {actionLoading === tour._id ? <FaSpinner className="animate-spin" /> : <FaTrash size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredTours.map((tour) => (
          <div key={tour._id} className={`${cardBg} border ${borderColor} rounded-2xl p-4 shadow-lg space-y-4`}>
            <div className="flex items-center gap-4">
              <img src={tour.mainImage?.url || "/placeholder-tour.jpg"} className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#D5B36A]/20" alt="" />
              <div className="flex-1 min-w-0">
                <p className={`font-bold ${textColor} truncate`}>{tour.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-amber-500 uppercase font-bold">
                    <FaMapMarkerAlt /> {tour.place?.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${tour.isPublished ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"}`}>
                      {tour.isPublished ? "Live" : "Draft"}
                    </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#D5B36A]/10">
              <div className="text-center">
                <p className="text-[9px] text-gray-500 uppercase">Price</p>
                <p className="text-xs font-bold text-[#D5B36A]">{tour.price} {tour.currency}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-gray-500 uppercase">Rating</p>
                <p className="text-xs font-bold text-yellow-500 flex items-center justify-center gap-1"><FaStar size={10}/> {tour.rating || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-gray-500 uppercase">Enrolled</p>
                <p className="text-xs font-bold text-gray-400 flex items-center justify-center gap-1"><FaUsers size={10}/> {tour.enrollmentsCount || 0}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button  onClick={() => navigate(`/admin/tour/${tour._id}`)}  className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-500/10 text-blue-400 rounded-xl text-sm font-bold">
                <FaEye /> View
              </button>
              <button onClick={() => handleDeleteTour(tour._id, tour.name)} disabled={actionLoading === tour._id} className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-bold">
                {actionLoading === tour._id ? <FaSpinner className="animate-spin" /> : <><FaTrash /> Delete</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className={`flex items-center justify-between p-4 ${cardBg} border-t ${borderColor} rounded-xl md:rounded-none`}>
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`p-2 rounded-lg border ${borderColor} ${textColor} disabled:opacity-30`}>
            <FaChevronLeft />
          </button>
          <span className={`text-sm ${textColor} font-bold`}>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`p-2 rounded-lg border ${borderColor} ${textColor} disabled:opacity-30`}>
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTours;