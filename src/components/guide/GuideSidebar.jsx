import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  FaHome,
  FaMapMarkedAlt,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEye,
} from 'react-icons/fa';

const GuideSidebar = ({ sidebarOpen, setSidebarOpen, isDarkMode, isRtl }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { name: t('guide.dashboard'), path: '/guide/dashboard', icon: FaHome },
    { name: t('guide.myTours'), path: '/guide/tours', icon: FaMapMarkedAlt },
    { name: t('guide.analyticsMenu'), path: '/guide/analytics', icon: FaChartLine },

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
      {/* Logo/Header */}
      <div className="p-4 border-b border-[#D5B36A]/20 flex items-center justify-between">
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center">
              <FaEye className="text-black" />
            </div>
            <span className={`font-semibold ${textColor}`}>{t('guide.guidePanel')}</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`p-2 rounded-lg ${hoverBg} ${secondaryText} transition-colors`}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? `bg-[#2c1b0f] ${textColor} ${isRtl ? 'border-r-4' : 'border-l-4'}`
                  : `${secondaryText} ${hoverBg}`
              }`
            }
            style={({ isActive }) =>
              isActive ? (isRtl ? { borderRightColor: accentColor } : { borderLeftColor: accentColor }) : {}
            }
          >
            <item.icon className="text-lg flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-2 border-t border-[#D5B36A]/20">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg ${secondaryText} ${hoverBg} transition-all text-red-400 hover:text-red-300`}
        >
          <FaSignOutAlt className="text-lg flex-shrink-0" />
          {sidebarOpen && <span className="text-sm font-medium">{t('admin.logout')}</span>}
        </button>
      </div>
    </aside>
  );
};

export default GuideSidebar;
