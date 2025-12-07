import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import GuideSidebar from "../components/guide/GuideSidebar";
import { FaBell, FaMoon, FaSun, FaGlobe } from "react-icons/fa";

const GuideDashboardLayout = () => {
  const { user, logout, isDarkMode, toggleTheme, language, changeLanguage } =
    useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    if (window.confirm(t("admin.confirmLogout"))) {
      logout();
      navigate("/");
    }
  };

  useEffect(() => {
    if (language && i18n?.changeLanguage) i18n.changeLanguage(language);
  }, [language, i18n]);

  const mainBg = isDarkMode ? "bg-[#0F0E0C]" : "bg-gray-50";
  const headerBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const hoverBg = isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100";

  const isRtl =
    i18n?.language === "ar" || document.documentElement.dir === "rtl";

  return (
    <div className={`min-h-ful${mainBg} flex justify-between`}>
      <GuideSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isDarkMode={isDarkMode}
        isRtl={isRtl}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ms-20 w-full transition-all duration-300`}
      >
        {/* Header */}
        <header
          className={`relativel fixed top-0 start-20 end-0  h-16 ${headerBg} border-b ${borderColor} flex items-center justify-between px-6 z-30`}
        >
          <div className="hidden md:block">
            <h1 className={`text-xl font-semibold ${textColor}`}>
              {t("welcome")}, {user?.firstName}!
            </h1>
            <p className={`text-sm ${secondaryText}`}>
              {t("guide.manageTours")}
            </p>
          </div>
          <div className="flex items-center lg:justify-around justify-between gap-4 w-full md:w-auto">
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
                  className={`absolute top-full ${
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
            </div>
          </div>
          {showUserMenu && (
            <div
              className={`absolute top-full ${
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
              <hr
                className={
                  isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200"
                }
              />
              <button
                onClick={handleLogout}
                className={`w-full text-left px-4 py-2 ${textColor} ${hoverBg} transition-all text-red-400 hover:text-red-300`}
              >
                {t("admin.logout")}
              </button>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 overflow-auto mt-16`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default GuideDashboardLayout;
