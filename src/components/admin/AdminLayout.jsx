import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import AdminSidebar from "./AdminSidebar";
import { FaBell, FaMoon, FaSun, FaGlobe } from "react-icons/fa";

const AdminLayout = () => {
  const { user, logout, isDarkMode, toggleTheme, language, changeLanguage } =
    useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Protect admin routes - redirect if not logged in or not an admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "admin") {
      navigate("/");
      return;
    }
  }, [user, navigate]);

  // when language changes in context, also update i18n
  useEffect(() => {
    if (language && i18n?.changeLanguage) i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleLogout = () => {
    if (window.confirm(t("admin.confirmLogout"))) {
      logout();
      navigate("/");
    }
  };

  // Don't render if not authorized
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  const mainBg = isDarkMode ? "bg-[#0F0E0C]" : "bg-gray-50";
  const headerBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const hoverBg = isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100";

  const isRtl =
    i18n?.language === "ar" || document.documentElement.dir === "rtl";

  return (
    <div className={`min-h-screen ${mainBg} flex`}>
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isDarkMode={isDarkMode}
        isRtl={isRtl}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${
          sidebarOpen ? (isRtl ? "mr-64" : "ml-64") : isRtl ? "mr-20" : "ml-20"
        } transition-all duration-300`}
      >
        {/* Header */}
        <header
          className={`h-16 ${headerBg} border-b ${borderColor} flex items-center justify-between px-6 sticky top-0 z-30`}
        >
          <div>
            <h1 className={`text-xl font-semibold ${textColor}`}>
              {t("welcome")}, {user?.firstName}!
            </h1>
            <p className={`text-sm ${secondaryText}`}>
              {t("admin.manageEgyptTours")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className={`relative ${secondaryText} hover:text-[#D5B36A] p-2 ${hoverBg} rounded-lg transition-all`}
            >
              <FaBell className="text-xl" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="relative">
              <button
                onClick={() => toggleTheme && toggleTheme()}
                title={isDarkMode ? t("theme.light") : t("theme.dark")}
                className={`p-2 rounded-lg ${hoverBg} ${secondaryText} transition-all`}
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                title={t("language")}
                className={`p-2 rounded-lg ${hoverBg} ${secondaryText} transition-all flex items-center gap-2`}
              >
                <FaGlobe />
                <span className="hidden sm:inline">
                  {language?.toUpperCase()}
                </span>
              </button>
              {showLangMenu && (
                <div
                  className={`absolute ${
                    isRtl ? "left-0" : "right-0"
                  } mt-2 w-36 ${headerBg} rounded-lg shadow-xl border ${borderColor} py-1 z-50`}
                >
                  <button
                    onClick={() => {
                      changeLanguage && changeLanguage("en");
                      i18n.changeLanguage("en");
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${textColor} ${hoverBg} transition-all`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
                      changeLanguage && changeLanguage("ar");
                      i18n.changeLanguage("ar");
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${textColor} ${hoverBg} transition-all`}
                  >
                    العربية
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 px-4 py-2 ${
                  isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-100"
                } rounded-lg ${hoverBg} transition-all`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-sm">
                  {user?.firstName?.charAt(0)}
                </div>
                <span
                  className={`${textColor} text-sm font-medium hidden md:block`}
                >
                  {user?.firstName}
                </span>
              </button>
              {showUserMenu && (
                <div
                  className={`absolute ${
                    isRtl ? "left-0" : "right-0"
                  } mt-2 w-48 ${headerBg} rounded-lg shadow-xl border ${borderColor} py-2 z-50`}
                >
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${textColor} ${hoverBg} transition-all`}
                  >
                    {t("admin.profileSettings")}
                  </button>
                  <button
                    onClick={() => {
                      navigate("/");
                      setShowUserMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${textColor} ${hoverBg} transition-all`}
                  >
                    {t("admin.viewWebsite")}
                  </button>
                  <hr className={`my-2 ${borderColor}`} />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    {t("admin.logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto ${mainBg} p-6`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
