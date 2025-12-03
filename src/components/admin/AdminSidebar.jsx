import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  FaHome,
  FaMapMarkedAlt,
  FaUsers,
  FaUserTie,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEye,
} from 'react-icons/fa';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, isDarkMode, isRtl }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { name: t('admin.dashboard'), path: '/admin/dashboard', icon: FaHome },
    { name: t('admin.toursMenu'), path: '/admin/tours', icon: FaMapMarkedAlt },
    { name: t('admin.usersMenu'), path: '/admin/users', icon: FaUsers },
    { name: t('admin.guidesMenu'), path: '/admin/guides', icon: FaUserTie },
    { name: t('admin.settings'), path: '/admin/settings', icon: FaCog },
  ];

  const handleLogout = () => {
    if (window.confirm(t('admin.confirmLogout'))) {
      logout();
      navigate('/');
    }
  };

  const bgColor = isDarkMode ? 'bg-[#1B1A17]' : 'bg-white';
  const borderColor = isDarkMode ? 'border-[#D5B36A]/20' : 'border-gray-200';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const hoverBg = isDarkMode ? 'hover:bg-[#2c1b0f]' : 'hover:bg-gray-100';
  const secondaryText = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const accentColor = '#D5B36A';

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } ${bgColor} ${isRtl ? 'border-l' : 'border-r'} ${borderColor} transition-all duration-300 flex flex-col fixed h-screen z-40 ${isRtl ? 'right-0' : 'left-0'}`}
    >
      {/* Logo */}
      <div className={`h-16 flex items-center justify-between px-4 border-b ${borderColor}`}>
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center">
              <FaEye className="text-black text-xl" />
            </div>
            <span className="text-[#D5B36A] font-semibold">{t('admin.adminPanel')}</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`text-[#D5B36A] hover:text-[#E2C784] p-2 ${hoverBg} rounded-lg transition-all`}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black shadow-lg'
                  : `${secondaryText} ${hoverBg} hover:text-[#D5B36A]`
              }`
            }
          >
            <item.icon className="text-xl flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Profile */}
      <div className={`border-t ${borderColor} p-4`}>
        {sidebarOpen ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold flex-shrink-0">
                {user?.firstName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${textColor} truncate`}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className={`text-xs ${secondaryText} truncate`}>{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all"
            >
              <FaSignOutAlt />
              <span>{t('admin.logout')}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            title={t('admin.logout')}
          >
            <FaSignOutAlt />
          </button>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
