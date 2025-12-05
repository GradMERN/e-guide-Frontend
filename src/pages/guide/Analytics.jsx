import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import ChartComponent from "../../components/analytics/ChartComponent";
import AnalyticsCard from "../../components/analytics/AnalyticsCard";
import { FaEye, FaExchangeAlt, FaCoins, FaMapMarkedAlt } from "react-icons/fa";

const Analytics = () => {
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();

  const [analyticsData] = useState({
    totalViews: 1245,
    conversionRate: 8.5,
    averageBookingValue: 1650,
    topTour: "Pyramids Tour",
    dailyViews: [
      { day: "Mon", views: 150, enrollments: 8 },
      { day: "Tue", views: 180, enrollments: 10 },
      { day: "Wed", views: 220, enrollments: 12 },
      { day: "Thu", views: 200, enrollments: 11 },
      { day: "Fri", views: 290, enrollments: 18 },
      { day: "Sat", views: 340, enrollments: 22 },
      { day: "Sun", views: 310, enrollments: 20 },
    ],
    monthlyComparison: [
      { month: "Jan", views: 2100, enrollments: 45, revenue: 45000 },
      { month: "Feb", views: 2400, enrollments: 52, revenue: 52000 },
      { month: "Mar", views: 2800, enrollments: 58, revenue: 58000 },
      { month: "Apr", views: 3100, enrollments: 65, revenue: 65000 },
      { month: "May", views: 3500, enrollments: 75, revenue: 75000 },
      { month: "Jun", views: 4200, enrollments: 88, revenue: 88000 },
    ],
    tourAnalytics: [
      { name: "Nile Cruise", views: 450, enrollments: 28, revenue: 70000 },
      { name: "Pyramids Tour", views: 620, enrollments: 32, revenue: 48000 },
      { name: "Desert Safari", views: 380, enrollments: 18, revenue: 21600 },
      { name: "Temple Tour", views: 290, enrollments: 12, revenue: 19200 },
      { name: "City Tour", views: 200, enrollments: 8, revenue: 9600 },
    ],
    sourceDistribution: [
      { name: "Direct", value: 45 },
      { name: "Search", value: 30 },
      { name: "Social", value: 15 },
      { name: "Referral", value: 10 },
    ],
  });

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";

  const stats = [
    {
      title: t("guide.analytics.totalViews"),
      value: analyticsData.totalViews.toLocaleString(),
      icon: FaEye,
      trend: 12,
      bgColor: "from-blue-500 to-blue-600",
    },
    {
      title: t("guide.analytics.conversionRate"),
      value: analyticsData.conversionRate,
      icon: FaExchangeAlt,
      unit: "%",
      trend: 5,
      bgColor: "from-green-500 to-green-600",
    },
    {
      title: t("guide.analytics.averageBookingValue"),
      value: analyticsData.averageBookingValue.toLocaleString(),
      icon: FaCoins,
      unit: "EGP",
      trend: 8,
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
