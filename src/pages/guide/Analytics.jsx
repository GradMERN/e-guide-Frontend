import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import ChartComponent from "../../components/analytics/ChartComponent";
import AnalyticsCard from "../../components/analytics/AnalyticsCard";
import { FaEye, FaExchangeAlt, FaCoins, FaMapMarkedAlt } from "react-icons/fa";
import { guideService } from "../../apis/guideService";
import { toast } from "react-toastify";

const Analytics = () => {
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";

  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await guideService.getAnalytics();
        setAnalyticsData(response.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !analyticsData) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="text-[var(--text-secondary)]">Loading analytics...</div>
      </div>
    );
  }

  // Check if there's any data
  const hasData =
    analyticsData.totalViews > 0 ||
    analyticsData.monthlyComparison.some((m) => m.enrollments > 0);

  if (!hasData) {
    return (
      <div className="p-6">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>
            {t("guide.analytics.title")}
          </h1>
          <p className={`${secondaryText} mt-1`}>
            {t("guide.analytics.subtitle") ||
              "Track your tours performance and growth"}
          </p>
        </div>
        <div className="mt-8 text-center">
          <div className="text-6xl text-gray-300 mb-4">📊</div>
          <h3 className={`text-xl font-semibold ${textColor} mb-2`}>
            {t("guide.analytics.noDataTitle") || "No Analytics Data Yet"}
          </h3>
          <p className={`${secondaryText}`}>
            {t("guide.analytics.noDataMessage") ||
              "Start publishing tours and getting enrollments to see analytics here."}
          </p>
        </div>
      </div>
    );
  }
  const stats = [
    {
      title: t("guide.analytics.totalViews"),
      value: analyticsData.totalViews.toLocaleString(),
      icon: FaEye,
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      title: t("guide.analytics.conversionRate"),
      value: analyticsData.conversionRate,
      icon: FaExchangeAlt,
      unit: "%",
      bgColor: "from-green-500 to-green-600",
    },
    {
      title: t("guide.analytics.averageBookingValue"),
      value: analyticsData.averageBookingValue.toLocaleString(),
      icon: FaCoins,
      unit: t("guide.currency"),
      bgColor: "from-purple-500 to-purple-600",
    },
    {
      title: t("guide.analytics.topPerformingTour"),
      value: analyticsData.topTour,
      icon: FaMapMarkedAlt,
      bgColor: "from-amber-500 to-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-3xl font-bold ${textColor}`}>
          {t("guide.analytics.title")}
        </h1>
        <p className={`${secondaryText} mt-1`}>
          {t("guide.analytics.subtitle") ||
            "Track your tours performance and growth"}
        </p>
      </div>

      {/* Stats Cards */}
      <div>
        <h2 className={`text-xl font-bold ${textColor} mb-4`}>
          {t("guide.analytics.overview")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <AnalyticsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="line"
          title={t("guide.analytics.dailyViews") || "Daily Views & Enrollments"}
          data={analyticsData.dailyViews}
          dataKey="views"
          colors={["#3B82F6", "#D5B36A"]}
        />
        <ChartComponent
          type="bar"
          title={t("guide.analytics.monthlyComparison") || "Monthly Comparison"}
          data={analyticsData.monthlyComparison}
          dataKey="views"
          colors={["#F59E0B", "#D5B36A"]}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="bar"
          title={t("guide.analytics.tourPerformance")}
          data={analyticsData.tourAnalytics}
          dataKey="enrollments"
          colors={["#8B5CF6", "#D5B36A"]}
        />
        <ChartComponent
          type="pie"
          title={
            t("guide.analytics.trafficSource") || "Traffic Source Distribution"
          }
          data={analyticsData.sourceDistribution}
          dataKey="value"
          colors={["#D5B36A", "#C7A15C", "#E2C784", "#DAA520"]}
        />
      </div>

      {/* Detailed Table */}
      <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>
          {t("guide.analytics.tourPerformance")}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor}`}>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  {t("guide.analytics.columns.tourName") || "Tour Name"}
                </th>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  {t("guide.analytics.columns.views") || "Views"}
                </th>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  {t("guide.analytics.columns.enrollments") || "Enrollments"}
                </th>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  {t("guide.analytics.columns.conversion") || "Conversion"}
                </th>
                <th
                  className={`text-left py-3 px-4 font-semibold ${secondaryText}`}
                >
                  {t("guide.analytics.columns.revenue") || "Revenue"}
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.tourAnalytics.map((tour, index) => {
                const conversion = (
                  (tour.enrollments / tour.views) *
                  100
                ).toFixed(1);
                return (
                  <tr
                    key={index}
                    className={`border-b ${borderColor} hover:${
                      isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"
                    }`}
                  >
                    <td className={`py-3 px-4 ${textColor}`}>{tour.name}</td>
                    <td className={`py-3 px-4 ${textColor}`}>{tour.views}</td>
                    <td className={`py-3 px-4 ${textColor}`}>
                      {tour.enrollments}
                    </td>
                    <td className={`py-3 px-4 text-green-400`}>
                      {conversion}%
                    </td>
                    <td className={`py-3 px-4 ${textColor} font-semibold`}>
                      {tour.revenue.toLocaleString()}{" "}
                      {t("guide.currency") || "EGP"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
