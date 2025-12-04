import React, { useState, useEffect } from 'react';
import { FaTrash, FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import axiosClient from '../../apis/axiosClient';

const AdminUsers = () => {
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  // Theme detection
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'dark';
    setIsDarkMode(storedTheme === 'dark');

    const handleThemeChange = () => {
      const theme = localStorage.getItem('theme') || 'dark';
      setIsDarkMode(theme === 'dark');
    };

    window.addEventListener('storage', handleThemeChange);
    return () => window.removeEventListener('storage', handleThemeChange);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get('/admin');
      setUsers(response.data.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(t('admin.users.loadError') || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await axiosClient.patch(`/admin/${userId}/role`, { role: newRole });
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, role: newRole } : u
        )
      );
      setEditingUserId(null);
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err.response?.data?.message || t('admin.users.roleError'));
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm(t('admin.users.confirmDelete') || 'Are you sure?')) {
      try {
        await axiosClient.delete(`/admin/${userId}`);
        setUsers(users.filter((u) => u._id !== userId));
      } catch (err) {
        console.error('Error deleting user:', err);
        setError(err.response?.data?.message || t('admin.users.deleteError'));
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const bgColor = isDarkMode ? 'bg-[#0F0E0C]' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDarkMode ? 'bg-[#0F0E0C]' : 'bg-gray-50';
  const rowHover = isDarkMode ? 'hover:bg-[#2c1b0f]/50' : 'hover:bg-gray-50';

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${bgColor}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5B36A] mx-auto mb-4"></div>
          <p className={textColor}>{t('admin.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className={`text-3xl font-bold ${textColor}`}>{t('admin.users.title')}</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`${cardBg} border ${borderColor} rounded-lg px-4 py-2 flex items-center`}>
          <FaSearch className={`${secondaryText} mr-3`} />
          <input
            type="text"
            placeholder={t('admin.users.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent ${textColor} outline-none placeholder-${isDarkMode ? 'gray-500' : 'gray-400'}`}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className={`${cardBg} border ${borderColor} ${textColor} px-4 py-2 rounded-lg focus:outline-none focus:border-[#D5B36A]`}
        >
          <option value="all">{t('admin.users.allRoles')}</option>
          <option value="user">{t('admin.users.roleUser')}</option>
          <option value="guide">{t('admin.users.roleGuide')}</option>
          <option value="admin">{t('admin.users.roleAdmin')}</option>
        </select>
      </div>

      {/* Users Table */}
      <div className={`${cardBg} border ${borderColor} rounded-lg overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${borderColor} ${isDarkMode ? 'bg-[#2c1b0f]' : 'bg-gray-100'}`}>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.users.name')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.users.email')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.users.phone')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.users.location')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.users.role')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.users.joined')}
                </th>
                <th className={`px-6 py-3 text-left text-sm font-semibold text-[#D5B36A]`}>
                  {t('admin.users.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-b ${borderColor} ${rowHover} transition-all`}
                  >
                    <td className={`px-6 py-3`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-sm">
                          {user.firstName?.charAt(0)}
                        </div>
                        <div>
                          <p className={`${textColor} font-medium`}>
                            {user.firstName} {user.lastName}
                          </p>
                          <p className={`text-xs ${secondaryText}`}>{user.age} years old</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-6 py-3 ${secondaryText} text-sm`}>{user.email}</td>
                    <td className={`px-6 py-3 ${secondaryText} text-sm`}>{user.phone || 'N/A'}</td>
                    <td className={`px-6 py-3 ${secondaryText} text-sm`}>
                      {user.city}, {user.country}
                    </td>
                    <td className={`px-6 py-3`}>
                      {editingUserId === user._id ? (
                        <select
                          value={selectedRole}
                          onChange={(e) => {
                            setSelectedRole(e.target.value);
                            handleChangeRole(user._id, e.target.value);
                          }}
                          className={`${inputBg} ${textColor} px-2 py-1 rounded text-sm border ${borderColor}`}
                        >
                          <option value="">{t('admin.users.selectRole')}</option>
                          <option value="user">{t('admin.users.roleUser')}</option>
                          <option value="guide">{t('admin.users.roleGuide')}</option>
                          <option value="admin">{t('admin.users.roleAdmin')}</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${
                            user.role === 'admin'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : user.role === 'guide'
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-blue-500/20 text-blue-500'
                          }`}
                          onClick={() => {
                            setEditingUserId(user._id);
                            setSelectedRole(user.role);
                          }}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-3 ${secondaryText} text-sm`}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className={`px-6 py-3`}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title={t('admin.delete')}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className={`px-6 py-8 text-center ${secondaryText}`}
                  >
                    {searchTerm || roleFilter !== 'all'
                      ? t('admin.users.notFound')
                      : t('admin.users.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
          <p className={`${secondaryText} text-sm mb-1`}>{t('admin.users.totalUsers')}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{users.length}</p>
        </div>
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
          <p className={`${secondaryText} text-sm mb-1`}>{t('admin.users.guides')}</p>
          <p className="text-2xl font-bold text-green-500">
            {users.filter((u) => u.role === 'guide').length}
          </p>
        </div>
        <div className={`${cardBg} border ${borderColor} rounded-lg p-4`}>
          <p className={`${secondaryText} text-sm mb-1`}>{t('admin.users.regularUsers')}</p>
          <p className="text-2xl font-bold text-blue-500">
            {users.filter((u) => u.role === 'user').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
