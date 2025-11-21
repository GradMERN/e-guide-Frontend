import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaUsers, FaMapMarkedAlt, FaEye, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGuides: 0,
    totalTours: 0,
    totalRevenue: 0
  });
  const [users, setUsers] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart data
  const chartData = [
    { month: 'Jan', users: 120, tours: 30, revenue: 4000 },
    { month: 'Feb', users: 150, tours: 35, revenue: 5200 },
    { month: 'Mar', users: 180, tours: 40, revenue: 6100 },
    { month: 'Apr', users: 220, tours: 50, revenue: 7500 },
    { month: 'May', users: 280, tours: 65, revenue: 9200 },
    { month: 'Jun', users: 320, tours: 80, revenue: 11000 }
  ];

  const roleDistribution = [
    { name: 'Users', value: stats.totalUsers - stats.totalGuides, fill: '#3B82F6' },
    { name: 'Guides', value: stats.totalGuides, fill: '#10B981' },
    { name: 'Admin', value: 1, fill: '#F59E0B' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch users
      const usersResponse = await api.get('/admin');
      const usersData = usersResponse.data.data || [];
      setUsers(usersData);

      // Fetch tours
      const toursResponse = await api.get('/tours?limit=100');
      const toursData = toursResponse.data.data || [];
      setTours(toursData);

      // Calculate stats
      const guides = usersData.filter(u => u.role === 'guide');
      const totalRevenue = toursData.reduce((sum, tour) => sum + (tour.price || 0), 0);

      setStats({
        totalUsers: usersData.length,
        totalGuides: guides.length,
        totalTours: toursData.length,
        totalRevenue
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5B36A] mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6 hover:border-[#D5B36A]/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <FaUsers className="text-2xl text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6 hover:border-[#D5B36A]/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Guides</p>
              <p className="text-3xl font-bold text-white">{stats.totalGuides}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <FaEye className="text-2xl text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6 hover:border-[#D5B36A]/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Tours</p>
              <p className="text-3xl font-bold text-white">{stats.totalTours}</p>
            </div>
            <div className="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <FaMapMarkedAlt className="text-2xl text-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6 hover:border-[#D5B36A]/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-2">Total Revenue (EGP)</p>
              <p className="text-3xl font-bold text-white">{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="text-2xl text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Growth Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D5B36A/20" />
              <XAxis stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1B1A17', border: '1px solid #D5B36A' }}
                labelStyle={{ color: '#D5B36A' }}
              />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} name="Users" />
              <Line type="monotone" dataKey="tours" stroke="#10B981" strokeWidth={2} name="Tours" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">User Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleDistribution.filter(item => item.value > 0)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Tours</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tours.slice(0, 5).map((tour) => (
              <div key={tour._id} className="flex items-center justify-between p-3 bg-[#2c1b0f] rounded-lg">
                <div className="flex-1">
                  <p className="text-white font-medium">{tour.name}</p>
                  <p className="text-sm text-gray-400">{tour.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#D5B36A] font-bold">{tour.price} {tour.currency}</p>
                  <p className="text-xs text-gray-400">{tour.duration}h</p>
                </div>
              </div>
            ))}
            {tours.length === 0 && (
              <p className="text-gray-400 text-center py-4">No tours yet</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Users</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {users.slice(0, 5).map((user) => (
              <div key={user._id} className="flex items-center justify-between p-3 bg-[#2c1b0f] rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                    {user.firstName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                  user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-500' :
                  user.role === 'guide' ? 'bg-green-500/20 text-green-500' :
                  'bg-blue-500/20 text-blue-500'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-gray-400 text-center py-4">No users yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-[#1B1A17] border border-[#D5B36A]/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D5B36A/20" />
            <XAxis stroke="#999" />
            <YAxis stroke="#999" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1B1A17', border: '1px solid #D5B36A' }}
              labelStyle={{ color: '#D5B36A' }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#D5B36A" name="Revenue (EGP)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;