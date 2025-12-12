import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaTrash,
  FaSearch,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaStar,
  FaUsers,
  FaMapMarkerAlt,
  FaUser,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";

const AdminTours = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, published, draft
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState(null);
  const toursPerPage = 10;

  // Theme detection
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

      // Build query params
      let url = `/tours?limit=${toursPerPage}&page=${currentPage}`;

      // For admin, we need to fetch all tours including unpublished
      // The backend should return all tours for admin role
      if (statusFilter === "published") {
        url += "&isPublished=true";
      } else if (statusFilter === "draft") {
        url += "&isPublished=false";
      }

      const response = await axiosClient.get(url);
      const toursData = response.data.data || [];
      setTours(toursData);

      // Calculate total pages from response
      const total =
        response.data.count || response.data.total || toursData.length;
      setTotalPages(Math.ceil(total / toursPerPage) || 1);
    } catch (err) {
      console.error("Error fetching tours:", err);
      setError(t("admin.tours.loadError") || "Failed to load tours");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (tour) => {
    try {
      setActionLoading(tour._id);

      if (tour.isPublished) {
        // Unpublish - update tour with isPublished: false
        await axiosClient.patch(`/tours/${tour._id}`, { isPublished: false });
      } else {
        // Publish tour
        await axiosClient.put(`/tours/${tour._id}/publish`);
      }

      // Refresh tours
      await fetchTours();
    } catch (err) {
      console.error("Error toggling publish status:", err);
      setError(err.response?.data?.message || "Failed to update tour status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteTour = async (id, tourName) => {
    if (
      window.confirm(
        `${
          t("admin.tours.confirmDelete") || "Are you sure you want to delete"
        } "${tourName}"? ${
          t("admin.tours.deleteWarning") || "This action cannot be undone."
        }`
      )
    ) {
      try {
        setActionLoading(id);
        await axiosClient.delete(`/tours/${id}`);
        setTours(tours.filter((t) => t._id !== id));
      } catch (err) {
        console.error("Error deleting tour:", err);
        setError(
          err.response?.data?.message ||
            t("admin.tours.deleteError") ||
            "Failed to delete tour"
        );
      } finally {
        setActionLoading(null);
      }
    }
  };

  const handleViewTour = (tourId) => {
    navigate(`/admin/tour/${tourId}`);
  };

  // Filter tours by search term
  const filteredTours = tours.filter((tour) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      tour.name?.toLowerCase().includes(searchLower) ||
      tour.place?.name?.toLowerCase().includes(searchLower) ||
      tour.place?.city?.toLowerCase().includes(searchLower) ||
      tour.guide?.firstName?.toLowerCase().includes(searchLower) ||
      tour.guide?.lastName?.toLowerCase().includes(searchLower);

    return matchesSearch;
  });

  // Theme colors
  const bgColor = isDarkMode ? "bg-[#0F0E0C]" : "bg-gray-50";
  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const inputBg = isDarkMode ? "bg-[#0F0E0C]" : "bg-gray-50";
  const rowHover = isDarkMode ? "hover:bg-[#2c1b0f]/50" : "hover:bg-gray-50";

  if (loading && tours.length === 0) {
    return (
      <div className={`flex items-center justify-center h-64 ${bgColor}`}>
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-[#D5B36A] mx-auto mb-4" />
          <p className={textColor}>
            {t("admin.loadingTours") || "Loading tours..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>
            {t("admin.tours.title") || "Tours Management"}
          </h1>
          <p className={secondaryText}>
            {t("admin.tours.subtitle") ||
              "View and manage all tours on the platform"}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-lg ${cardBg} border ${borderColor}`}>
          <span className={secondaryText}>
            {t("admin.tours.total") || "Total"}:{" "}
          </span>
          <span className="text-[#D5B36A] font-bold">{tours.length}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="hover:bg-red-500/20 p-1 rounded"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${secondaryText}`}
            />
            <input
              type="text"
              placeholder={
                t("admin.tours.searchPlaceholder") ||
                "Search by name, location, or guide..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className={secondaryText} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 ${inputBg} ${textColor} border ${borderColor} rounded-lg focus:outline-none focus:border-[#D5B36A]`}
            >
              <option value="all">
                {t("admin.tours.allTours") || "All Tours"}
              </option>
              <option value="published">
                {t("admin.tours.published") || "Published"}
              </option>
              <option value="draft">
                {t("admin.tours.drafts") || "Drafts"}
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Tours Table */}
      <div
        className={`${cardBg} border ${borderColor} rounded-lg overflow-hidden`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`border-b ${borderColor} ${
                  isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-100"
                }`}
              >
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">
                  {t("admin.tours.tour") || "Tour"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">
                  {t("admin.tours.guide") || "Guide"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">
                  {t("admin.tours.location") || "Location"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">
                  {t("admin.tours.price") || "Price"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">
                  {t("admin.tours.stats") || "Stats"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">
                  {t("admin.tours.statusHeader") || "Status"}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]">
                  {t("admin.tours.actions") || "Actions"}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.length > 0 ? (
                filteredTours.map((tour) => (
                  <tr
                    key={tour._id}
                    className={`border-b ${borderColor} ${rowHover} transition-all`}
                  >
                    {/* Tour Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {tour.mainImage?.url ? (
                          <img
                            src={tour.mainImage.url}
                            alt={tour.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#D5B36A]/20 flex items-center justify-center">
                            <FaMapMarkerAlt className="text-[#D5B36A]" />
                          </div>
                        )}
                        <div>
                          <p className={`font-medium ${textColor}`}>
                            {tour.name}
                          </p>
                          <p className={`text-xs ${secondaryText}`}>
                            {tour.itemsCount || 0}{" "}
                            {t("admin.tours.items") || "items"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Guide */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tour.guide?.avatar?.url ? (
                          <img
                            src={tour.guide.avatar.url}
                            alt={tour.guide.firstName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#D5B36A]/20 flex items-center justify-center">
                            <FaUser className="text-[#D5B36A] text-xs" />
                          </div>
                        )}
                        <span className={secondaryText}>
                          {tour.guide?.firstName} {tour.guide?.lastName}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className={`px-6 py-4 ${secondaryText}`}>
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-[#D5B36A] text-xs" />
                        <span>
                          {tour.place?.name || tour.place?.city || "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-[#D5B36A] font-semibold">
                      {tour.price} {tour.currency}
                    </td>

                    {/* Stats */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-yellow-500">
                          <FaStar className="text-xs" />
                          <span className="text-sm">
                            {tour.rating?.toFixed(1) || "N/A"}
                          </span>
                        </span>
                        <span
                          className={`flex items-center gap-1 ${secondaryText}`}
                        >
                          <FaUsers className="text-xs" />
                          <span className="text-sm">
                            {tour.enrollmentsCount || 0}
                          </span>
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          tour.isPublished
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {tour.isPublished
                          ? t("admin.tours.published") || "Published"
                          : t("admin.tours.draft") || "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewTour(tour._id)}
                          className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                          title={t("admin.view") || "View"}
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleTogglePublish(tour)}
                          disabled={actionLoading === tour._id}
                          className={`p-2 rounded-lg transition-all ${
                            tour.isPublished
                              ? "text-yellow-500 hover:bg-yellow-500/10"
                              : "text-green-500 hover:bg-green-500/10"
                          }`}
                          title={
                            tour.isPublished
                              ? t("admin.tours.unpublish") || "Unpublish"
                              : t("admin.tours.publish") || "Publish"
                          }
                        >
                          {actionLoading === tour._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : tour.isPublished ? (
                            <FaTimes />
                          ) : (
                            <FaCheck />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour._id, tour.name)}
                          disabled={actionLoading === tour._id}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title={t("admin.delete") || "Delete"}
                        >
                          {actionLoading === tour._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className={`px-6 py-12 text-center ${secondaryText}`}
                  >
                    {searchTerm
                      ? t("admin.tours.notFound") ||
                        "No tours found matching your search"
                      : t("admin.tours.empty") || "No tours available"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className={`flex items-center justify-between px-6 py-4 border-t ${borderColor}`}
          >
            <p className={secondaryText}>
              {t("admin.tours.page") || "Page"} {currentPage}{" "}
              {t("admin.tours.of") || "of"} {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || loading}
                className={`p-2 rounded-lg ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : `${rowHover}`
                } ${textColor}`}
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || loading}
                className={`p-2 rounded-lg ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : `${rowHover}`
                } ${textColor}`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTours;
