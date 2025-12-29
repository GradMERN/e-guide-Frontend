import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import ChartComponent from "../../components/analytics/ChartComponent";
import AnalyticsCard from "../../components/analytics/AnalyticsCard";
import LoadingScreen from "../../components/common/LoadingScreen"; 
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

  if (loading) return <LoadingScreen />;

  const hasData =
    analyticsData?.totalViews > 0 ||
    analyticsData?.monthlyComparison?.some((m) => m.enrollments > 0);

  if (!hasData) {
    return (
      <div className="p-4 md:p-6 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="text-7xl mb-6 opacity-20">📊</div>
        <h1 className={`text-3xl font-bold ${textColor}`}>
          {t("guide.analytics.title")}
        </h1>
        <p className={`${secondaryText} mt-2 max-w-md`}>
          {t("guide.analytics.noDataMessage") ||
            "Start publishing tours and getting enrollments to see your performance metrics here."}
        </p>
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
      unit: t("guide.currency") || "EGP",
      bgColor: "from-purple-500 to-purple-600",
    },
    {
      title: t("guide.analytics.topPerformingTour"),
      value: analyticsData.topTour || "N/A",
      icon: FaMapMarkedAlt,
      bgColor: "from-amber-500 to-amber-600",
      isLongText: true,
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8 p-2 sm:p-4 md:p-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${textColor} tracking-tight`}>
          {t("guide.analytics.title")}
        </h1>
        <p className={`${secondaryText} text-xs sm:text-sm md:text-base`}>
          {t("guide.analytics.subtitle") || "Track your tours performance and growth"}
        </p>
      </div>

      <div className="space-y-3 md:space-y-4">
        <h2 className={`text-base sm:text-lg font-bold ${textColor} flex items-center gap-2`}>
          <span className="w-1 h-5 md:h-6 bg-[#D5B36A] rounded-full"></span>
          {t("guide.analytics.overview")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <AnalyticsCard key={index} {...stat} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <div className={`${cardBg} p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl border ${borderColor}`}>
          <ChartComponent type="line" title={t("guide.analytics.dailyViews") || "Daily Views & Enrollments"} data={analyticsData.dailyViews} dataKey="views" colors={["#3B82F6", "#D5B36A"]}/>
        </div>
        <div className={`${cardBg} p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl border ${borderColor}`}>
          <ChartComponent type="bar" title={t("guide.analytics.monthlyComparison") || "Monthly Comparison"} data={analyticsData.monthlyComparison} dataKey="views" colors={["#F59E0B", "#D5B36A"]} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
        <div className={`${cardBg} p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl border ${borderColor}`}>
          <ChartComponent type="bar" title={t("guide.analytics.tourPerformance")} data={analyticsData.tourAnalytics} dataKey="enrollments" colors={["#8B5CF6", "#D5B36A"]}/>
        </div>
        <div className={`${cardBg} p-3 sm:p-4 md:p-6 rounded-xl md:rounded-2xl border ${borderColor}`}>
          <ChartComponent type="pie" title={t("guide.analytics.trafficSource") || "Traffic Source Distribution"} data={analyticsData.sourceDistribution} dataKey="value" colors={["#D5B36A", "#C7A15C", "#E2C784", "#DAA520"]}/>
        </div>
      </div>

      <div className={`${cardBg} rounded-xl md:rounded-2xl border ${borderColor} shadow-sm overflow-hidden`}>
        <div className="p-4 md:p-6 border-b border-gray-500/10">
          <h3 className={`text-base sm:text-lg font-bold ${textColor}`}>
            {t("guide.analytics.tourPerformance")}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm md:text-base">
            <thead>
              <tr className={`bg-gray-500/5 ${secondaryText} text-[10px] sm:text-xs uppercase tracking-wider text-left`}>
                <th className="py-3 px-3 sm:px-4 md:px-6 font-bold whitespace-nowrap">
                  {t("guide.analytics.columns.tourName") || "Tour Name"}
                </th>
                <th className="py-3 px-3 sm:px-4 md:px-6 font-bold whitespace-nowrap">
                  {t("guide.analytics.columns.views") || "Views"}
                </th>
                <th className="py-3 px-3 sm:px-4 md:px-6 font-bold whitespace-nowrap">
                  {t("guide.analytics.columns.enrollments") || "Bookings"}
                </th>
                <th className="py-3 px-3 sm:px-4 md:px-6 font-bold whitespace-nowrap">
                  {t("guide.analytics.columns.conversion") || "Conv %"}
                </th>
                <th className="py-3 px-3 sm:px-4 md:px-6 font-bold whitespace-nowrap">
                  {t("guide.analytics.columns.revenue") || "Revenue"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500/10">
              {analyticsData.tourAnalytics.map((tour, index) => {
                const conversion = tour.views > 0  ? ((tour.enrollments / tour.views) * 100).toFixed(1) : "0.0";
                return (
                  <tr key={index} className={`transition-colors hover:${isDarkMode ? "bg-white/5" : "bg-gray-50"}`}>
                    <td className={`py-3 px-3 sm:px-4 md:px-6 font-medium ${textColor} max-w-[120px] sm:max-w-[200px] truncate`}>
                      {tour.name}
                    </td>
                    <td className={`py-3 px-3 sm:px-4 md:px-6 ${secondaryText}`}>
                      {tour.views}
                    </td>
                    <td className={`py-3 px-3 sm:px-4 md:px-6 ${secondaryText}`}>
                      {tour.enrollments}
                    </td>
                    <td className="py-3 px-3 sm:px-4 md:px-6">
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] sm:text-xs font-bold border border-green-500/20 whitespace-nowrap">
                        {conversion}%
                      </span>
                    </td>
                    <td className={`py-3 px-3 sm:px-4 md:px-6 font-bold ${textColor} whitespace-nowrap`}>
                      {tour.revenue.toLocaleString()}
                      <span className="text-[9px] sm:text-[10px] opacity-60 ml-1">
                        {t("guide.currency") || "EGP"}
                      </span>
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