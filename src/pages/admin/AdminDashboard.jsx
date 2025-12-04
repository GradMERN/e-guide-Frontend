import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/adminService';
import StatsOverview from '../../components/analytics/StatsOverview';
import ChartComponent from '../../components/analytics/ChartComponent';
import {
  FaUsers,
  FaUserTie,
  FaMapMarkedAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';

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
      
      if (response.success && response.data) {
        // Process the data
        const data = response.data;
        
        setDashboardData({
          totalUsers: data.usersCount || 0,
          totalGuides: data.guidesCount || 0,
          totalAdmins: data.adminsCount || 0,
          totalTours: data.toursCount || 0,
          totalEnrollments: data.enrollmentsCount || 0,
          totalRevenue: (data.paymentsPaid || 0) * 1000, // Mock calculation
          userGrowth: generateGrowthData(data),
          revenueData: generateRevenueData(data),
          userDistribution: [
            { name: 'Tourists', value: Math.max(0, (data.usersCount || 0) - (data.guidesCount || 0) - (data.adminsCount || 0)) },
            { name: 'Guides', value: data.guidesCount || 0 },
            { name: 'Admin', value: data.adminsCount || 0 },
          ],
          recentActivity: transformRecentUsers(data.recentUsers || []),
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const generateGrowthData = (data) => {
    // Generate mock monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, idx) => ({
      month,
      users: Math.floor((data.usersCount || 0) * (0.6 + idx * 0.07)),
      guides: Math.floor((data.guidesCount || 0) * (0.6 + idx * 0.07)),
      tours: Math.floor((data.toursCount || 0) * (0.6 + idx * 0.08)),
    }));
  };

  const generateRevenueData = (data) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseRevenue = (data.paymentsPaid || 0) * 5000;
    return months.map((month) => ({
      month,
      revenue: Math.floor(baseRevenue * (0.7 + Math.random() * 0.5)),
    }));
  };

  const transformRecentUsers = (recentUsers) => {
    return recentUsers.slice(0, 4).map((user, idx) => ({
      id: idx + 1,
      type: idx % 2 === 0 ? 'user_joined' : 'guide_joined',
      user: `${user.firstName} ${user.lastName}`,
      description: `${user.firstName} ${user.lastName} joined the platform`,
      time: new Date(user.createdAt).toLocaleDateString(),
    }));
  };

  const cardBg = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-center ${textColor}`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5B36A] mx-auto mb-4"></div>
          <p>{t('common.loading') || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-center ${textColor}`}>
          <p className="text-red-500">{error || 'Failed to load dashboard'}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-opacity-90"
          >
            {t('common.retry') || 'Retry'}
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: t('admin.totalUsers'),
      value: dashboardData.totalUsers.toLocaleString(),
      icon: FaUsers,
      trend: 8,
      bgColor: 'from-blue-500 to-blue-600',
    },
    {
      title: t('admin.totalGuides'),
      value: dashboardData.totalGuides,
      icon: FaUserTie,
      trend: 12,
      bgColor: 'from-purple-500 to-purple-600',
    },
    {
      title: t('admin.totalTours'),
      value: dashboardData.totalTours,
      icon: FaMapMarkedAlt,
      trend: 18,
      bgColor: 'from-green-500 to-green-600',
    },
    {
      title: t('admin.totalRevenue'),
      value: `${(dashboardData.totalRevenue / 1000).toLocaleString()}K`,
      icon: FaMoneyBillWave,
      unit: 'EGP',
      trend: 25,
      bgColor: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-2xl font-bold ${textColor} mb-2`}>
          {t('admin.adminPanel')}
        </h2>
        <p className={`${secondaryText}`}>{t('admin.manageEgyptTours')}</p>
      </div>

      {/* Stats Overview */}
      <div>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Overview</h3>
        <StatsOverview stats={stats} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="line"
          title={t('admin.growthTrend')}
          data={dashboardData.userGrowth}
          dataKey="users"
          colors={['#3B82F6', '#D5B36A']}
        />
        <ChartComponent
          type="bar"
          title={t('admin.monthlyRevenue')}
          data={dashboardData.revenueData}
          dataKey="revenue"
          colors={['#10B981', '#D5B36A']}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartComponent
          type="bar"
          title="Platform Growth"
          data={dashboardData.userGrowth}
          dataKey="guides"
          colors={['#8B5CF6', '#D5B36A']}
        />
        <ChartComponent
          type="pie"
          title={t('admin.userDistribution')}
          data={dashboardData.userDistribution}
          dataKey="value"
          colors={['#D5B36A', '#C7A15C', '#E2C784']}
        />
      </div>

      {/* Recent Activity */}
      <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Recent Activity</h3>
        <div className="space-y-3">
          {dashboardData.recentActivity && dashboardData.recentActivity.length > 0 ? (
            dashboardData.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start gap-4 p-3 rounded-lg ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-50'}`}
              >
                <div className="w-2 h-2 rounded-full bg-[#D5B36A] mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className={`font-medium ${textColor}`}>{activity.user}</p>
                  <p className={`text-sm ${secondaryText}`}>{activity.description}</p>
                  <p className={`text-xs ${secondaryText} mt-1`}>{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className={secondaryText}>No recent activity</p>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
          <h4 className={`text-sm font-semibold ${secondaryText} mb-2`}>Active Tours</h4>
          <p className={`text-3xl font-bold ${textColor}`}>{dashboardData.totalTours}</p>
          <p className={`text-xs text-green-400 mt-2`}>+14% this month</p>
        </div>
        <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
          <h4 className={`text-sm font-semibold ${secondaryText} mb-2`}>Total Bookings</h4>
          <p className={`text-3xl font-bold ${textColor}`}>{dashboardData.totalEnrollments}</p>
          <p className={`text-xs text-blue-400 mt-2`}>Current enrollments</p>
        </div>
        <div className={`${cardBg} rounded-xl border ${borderColor} p-6`}>
          <h4 className={`text-sm font-semibold ${secondaryText} mb-2`}>Platform Users</h4>
          <p className={`text-3xl font-bold ${textColor}`}>{dashboardData.totalUsers}</p>
          <p className={`text-xs text-purple-400 mt-2`}>Active users</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
