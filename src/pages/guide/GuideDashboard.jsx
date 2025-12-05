import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { guideService } from "../../apis/guideService";
import {
  FaMapMarkedAlt,
  FaEye,
  FaCoins,
  FaStar,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await guideService.getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        toast.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-[var(--text-secondary)]">
          {t("common.loading") || "Loading..."}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="text-[var(--text)]">
          {t("guide.dashboard") || "Dashboard"}
        </div>
      </div>
    );
  }

  const cardBg = "bg-[var(--surface)]";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";
  const secondaryText = "text-[var(--text-secondary)]";

  const statCards = [
    {
      title: t("guide.totalTours") || "Total Tours",
      value: stats.totalTours,
      icon: FaMapMarkedAlt,
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      title: t("guide.activeTours") || "Active Tours",
      value: stats.publishedTours,
      icon: FaEye,
      bgColor: "from-green-500 to-green-600",
    },
    {
      title: t("guide.totalEnrollments") || "Total Enrollments",
      value: stats.totalEnrollments,
      icon: FaCoins,
      bgColor: "from-purple-500 to-purple-600",
    },
    {
      title: t("guide.totalEarnings") || "Total Earnings",
      value: `${Number(stats.totalEarnings || 0).toLocaleString()} EGP`,
      icon: FaStar,
      bgColor: "from-amber-500 to-amber-600",
    },
  ];

  // Helpers to safely compute maxima and format numbers when arrays may be empty
  const safeNumber = (n) => Number(n || 0);
  const getMax = (arr, key) => {
    if (!arr || arr.length === 0) return 1;
    const vals = arr.map((i) => safeNumber(i[key]));
    const m = Math.max(...vals);
    return m > 0 ? m : 1;
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${textColor}`}>
          {t("guide.myOverview") || "My Overview"}
        </h1>
        <p className={`${secondaryText} mt-1`}>
          {t("guide.dashboard.subtitle") ||
            "Overview of your tours and performance"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`rounded-lg ${cardBg} ${borderColor} border p-6 shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`${secondaryText} text-sm`}>{card.title}</p>
                <p className={`text-2xl font-bold ${textColor} mt-1`}>
                  {card.value}
                </p>
              </div>
              <div
                className={`p-3 rounded-full bg-gradient-to-r ${card.bgColor} text-white`}
              >
                <card.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends */}
        <div className={`rounded-lg ${cardBg} ${borderColor} border p-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            {t("guide.enrollmentsTrend") || "Enrollments Trend"}
          </h3>
          <div className="space-y-2">
            {stats.enrollmentTrends?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={secondaryText}>{item.day}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (safeNumber(item.count) /
                            getMax(stats.enrollmentTrends, "count")) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className={`text-sm ${textColor}`}>
                    {Number(item.count || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Earnings Trends */}
        <div className={`rounded-lg ${cardBg} ${borderColor} border p-6`}>
          <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
            {t("guide.earningsTrend") || "Earnings Trend"}
          </h3>
          <div className="space-y-2">
            {stats.earningsTrends?.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={secondaryText}>{item.day}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${
                          (safeNumber(item.amount) /
                            getMax(stats.earningsTrends, "amount")) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className={`text-sm ${textColor}`}>
                    {Number(item.amount || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tour Performance */}
      <div className={`rounded-lg ${cardBg} ${borderColor} border p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          {t("guide.tourPerformance") || "Tour Performance"}
        </h3>
        <div className="space-y-3">
          {stats.tourPerformance?.slice(0, 5).map((tour, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <span className={textColor}>{tour.name}</span>
                <span className={`${secondaryText} text-sm ml-2`}>
                  {Number(tour.enrollments || 0).toLocaleString()}{" "}
                  {t("guide.enrollments") || "enrollments"}
                </span>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{
                    width: `${
                      (safeNumber(tour.enrollments) /
                        getMax(stats.tourPerformance, "enrollments")) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Tours */}
      <div className={`rounded-lg ${cardBg} ${borderColor} border p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          {t("guide.myTours") || "My Tours"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.tours?.map((tour) => (
            <div
              key={tour.id}
              className={`rounded-lg ${borderColor} border p-4`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className={`font-medium ${textColor}`}>{tour.name}</h4>
                <span className={`text-sm ${secondaryText}`}>
                  {Number(tour.price || 0).toLocaleString()}{" "}
                  {tour.currency || t("guide.currency") || "EGP"}
                </span>
              </div>
              <button
                onClick={() => navigate(`/guide/tours/${tour.id}/items`)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <FaPlus size={14} />
                {t("guide.tours.addItem") || "Add Item"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className={`rounded-lg ${cardBg} ${borderColor} border p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          {t("guide.recentEnrollments") || "Recent Enrollments"}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${borderColor} border-b`}>
                <th className={`text-left py-2 px-4 ${secondaryText}`}>
                  {t("guide.tourName") || "Tour Name"}
                </th>
                <th className={`text-left py-2 px-4 ${secondaryText}`}>
                  {t("guide.guestName") || "Guest Name"}
                </th>
                <th className={`text-left py-2 px-4 ${secondaryText}`}>
                  {t("common.date") || "Date"}
                </th>
                <th className={`text-left py-2 px-4 ${secondaryText}`}>
                  {t("common.amount") || "Amount"}
                </th>
                <th className={`text-left py-2 px-4 ${secondaryText}`}>
                  {t("common.status") || "Status"}
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.recentEnrollments?.map((enrollment, index) => (
                <tr key={index} className={`${borderColor} border-b`}>
                  <td className={`py-2 px-4 ${textColor}`}>
                    {enrollment.tourName}
                  </td>
                  <td className={`py-2 px-4 ${textColor}`}>
                    {enrollment.guestName}
                  </td>
                  <td className={`py-2 px-4 ${textColor}`}>
                    {enrollment.date}
                  </td>
                  <td className={`py-2 px-4 ${textColor}`}>
                    {Number(enrollment.amount || 0).toLocaleString()}{" "}
                    {enrollment.currency || t("guide.currency") || "EGP"}
                  </td>
                  <td className={`py-2 px-4`}>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        enrollment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {t(`common.statuses.${enrollment.status}`) ||
                        enrollment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
