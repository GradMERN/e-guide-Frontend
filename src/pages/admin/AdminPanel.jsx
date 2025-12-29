import { useState, useEffect } from "react";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { adminService } from "../../apis/adminService";
import LoadingScreen from "../../components/common/LoadingScreen"; 
import StatsOverview from "../../components/analytics/StatsOverview";
import ChartComponent from "../../components/analytics/ChartComponent";
import { FaUsers, FaUserTie, FaMapMarkedAlt, FaMoneyBillWave } from "react-icons/fa";

const AdminDashboard = () => {
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getDashboardStats();

      if (response?.success && response?.data) {
        const data = response.data;
        setDashboardData({
          totalUsers: data.usersCount || 0,
          totalGuides: data.guidesCount || 0,
          totalAdmins: data.adminsCount || 0,
          totalTours: data.toursCount || 0,
          totalEnrollments: data.enrollmentsCount || 0,
          totalRevenue: data.totalRevenue || 0,
          userGrowth: data.growthChartData || [],
          revenueData: data.revenueChartData || [],
          userDistribution: [
            { name: "Tourists", value: Math.max(0, (data.usersCount || 0) - (data.guidesCount || 0) - (data.adminsCount || 0)) },
            { name: "Guides", value: data.guidesCount || 0 },
            { name: "Admin", value: data.adminsCount || 0 },
          ],
          recentActivity: transformRecentUsers(data.recentUsers || []),
        });
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const transformRecentUsers = (recentUsers) => {
    return recentUsers.slice(0, 4).map((user, idx) => ({
      id: idx + 1,
      user: `${user.firstName} ${user.lastName}`,
      description: `${user.firstName} ${user.lastName} joined as ${user.role}`,
      time: new Date(user.createdAt).toLocaleDateString(),
    }));
  };

  const cardBg = isDarkMode ? "bg-surface" : "bg-white";
  const borderColor = isDarkMode ? "border-border" : "border-gray-200";
  const textColor = isDarkMode ? "text-text" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-text-secondary" : "text-gray-600";

  if (loading) return <LoadingScreen fullPage={false} />;

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className={`text-center ${textColor}`}>
          <p className="text-red-500 font-medium">{error || "Failed to load dashboard"}</p>
          <button onClick={fetchDashboardData} className="mt-6 px-6 py-2 bg-primary text-white rounded-xl hover:bg-secondary transition-all">
            {t("common.retry") || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  const formatRevenue = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toLocaleString();
  };

  const stats = [
    { title: t("admin.totalUsers"), value: dashboardData.totalUsers.toLocaleString(), icon: FaUsers, bgColor: "from-blue-500 to-blue-600" },
    { title: t("admin.totalGuides"), value: dashboardData.totalGuides.toLocaleString(), icon: FaUserTie, bgColor: "from-purple-500 to-purple-600" },
    { title: t("admin.totalTours"), value: dashboardData.totalTours.toLocaleString(), icon: FaMapMarkedAlt, bgColor: "from-green-500 to-green-600" },
    { title: t("admin.totalRevenue"), value: formatRevenue(dashboardData.totalRevenue), icon: FaMoneyBillWave, unit: t("admin.currency") || "EGP", bgColor: "from-emerald-500 to-emerald-600" },
  ];

  return (
    <div className="w-full max-w-full overflow-hidden px-1 sm:px-0 space-y-6 text-left" dir="ltr">
      <div className="px-2 sm:px-0">
        <h2 className={`text-xl sm:text-2xl font-bold ${textColor} mb-1 sm:mb-2`}>
          {t("admin.adminPanel")}
        </h2>
        <p className={`text-sm sm:text-base ${secondaryText}`}>{t("admin.manageEgyptTours")}</p>
      </div>

      <StatsOverview stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="min-h-[300px] sm:min-h-[350px]">
          <ChartComponent type="line" title={t("admin.growthTrend")} data={dashboardData.userGrowth} dataKey="users" xAxisKey="month" colors={["#3B82F6", "#D5B36A"]}/>
        </div>
        <div className="min-h-[300px] sm:min-h-[350px]">
          <ChartComponent type="bar" title={t("admin.monthlyRevenue")} data={dashboardData.revenueData} dataKey="revenue" xAxisKey="month" colors={["#10B981", "#D5B36A"]}/>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className={`lg:col-span-2 ${cardBg} rounded-xl border ${borderColor} p-4 sm:p-6 shadow-sm`}>
          <h3 className={`text-base sm:text-lg font-semibold ${textColor} mb-4`}>
            {t("admin.recentUsers") || "Recent Activity"}
          </h3>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 border-b border-border/50 pb-3 last:border-0 last:pb-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs sm:text-sm shrink-0">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-[150px]">
                  <p className={`text-xs sm:text-sm font-semibold ${textColor} truncate`}>{activity.user}</p>
                  <p className={`text-[10px] sm:text-xs ${secondaryText} line-clamp-1`}>{activity.description}</p>
                </div>
                <span className={`text-[10px] sm:text-xs ${secondaryText} italic whitespace-nowrap`}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="min-h-[300px]">
          <ChartComponent type="pie" title={t("admin.userDistribution")} data={dashboardData.userDistribution} dataKey="value" colors={["#D5B36A", "#3B82F6", "#8B5CF6"]}/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;