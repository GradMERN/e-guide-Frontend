import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth as useReduxAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import {
  FaHome,
  FaMapMarkedAlt,
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaEye,
  FaUserTie,
} from "react-icons/fa";

const GuideSidebar = ({ sidebarOpen, setSidebarOpen, isDarkMode, isRtl }) => {
  const { user, logout } = useReduxAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    {
      name: t("guide.sidebar.dashboard"),
      path: "/guide/dashboard",
      icon: FaHome,
    },
    {
      name: t("guide.sidebar.myTours"),
      path: "/guide/tours",
      icon: FaMapMarkedAlt,
    },
    {
      name: t("guide.sidebar.analytics"),
      path: "/guide/analytics",
      icon: FaChartLine,
    },
    {
      name: t("guide.profileTitle", "Guide Profile"),
      path: "/guide/profile",
      icon: FaUserTie,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const bgColor = "bg-[var(--surface)]";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";
  const hoverBg = "hover:bg-[var(--glass-bg-hover)]";
  const secondaryText = "text-[var(--text-secondary)]";
  const accentColor = "var(--primary)";

  return (
    <aside
      className={`${sidebarOpen ? "w-64" : "w-20"} ${bgColor} ${
        isRtl ? "border-l" : "border-r"
      } ${borderColor} transition-all duration-300 flex flex-col fixed h-screen z-40 ${
        isRtl ? "right-0" : "left-0"
      }`}
    >
      {/* Logo/Header */}
      <div
        className={`p-4 border-b ${borderColor} flex items-center justify-between`}
      >
        {sidebarOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
              <FaEye className="text-[var(--text-loop)]" />
            </div>
            <span className={`font-semibold ${textColor}`}>
              {t("guide.sidebar.title")}
            </span>
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
                  ? `bg-[var(--glass-bg)] ${textColor} ${
                      isRtl ? "border-r-4" : "border-l-4"
                    }`
                  : `${secondaryText} ${hoverBg}`
              }`
            }
            style={({ isActive }) =>
              isActive
                ? isRtl
                  ? { borderRightColor: accentColor }
                  : { borderLeftColor: accentColor }
                : {}
            }
          >
            <item.icon className="text-lg flex-shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className={`p-2 border-t ${borderColor}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg ${secondaryText} ${hoverBg} transition-all text-red-400 hover:text-red-300`}
        >
          <FaSignOutAlt className="text-lg flex-shrink-0" />
          {sidebarOpen && (
            <span className="text-sm font-medium">
              {t("guide.sidebar.logout")}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default GuideSidebar;
