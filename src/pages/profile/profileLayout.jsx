import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { FaHome, FaMoon, FaSun, FaGlobe } from "react-icons/fa";

const ProfileLayout = () => {
  const { user, isDarkMode, toggleTheme } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Protect profile routes - redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const isRtl = i18n.language.startsWith("ar");

  // Don't render if not authorized
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  // Styles adapted from GuideDashboardLayout
  const headerBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const hoverBg = isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100";

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <SideBar />

      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <header
          className={`h-16 ${headerBg} border-b ${borderColor} flex items-center justify-between px-6 sticky top-0 z-30`}
        >
          {/* Title */}
          <div>
            <h1 className={`text-xl font-semibold ${textColor}`}>
              {t("profileSettings")}
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Home Button */}
            <button
              onClick={() => navigate("/")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${hoverBg} ${textColor} transition-all`}
              title={t("admin.viewWebsite")}
            >
              <FaHome />
              <span className="hidden sm:inline">{t("admin.viewWebsite")}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${hoverBg} ${secondaryText} transition-all`}
              title={isDarkMode ? t("theme.light") : t("theme.dark")}
            >
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`p-2 rounded-lg ${hoverBg} ${secondaryText} transition-all flex items-center gap-2`}
              >
                <FaGlobe />
                <span className="hidden sm:inline">
                  {i18n.language.toUpperCase()}
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
                      i18n.changeLanguage("en");
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 ${textColor} ${hoverBg} transition-all`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => {
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

            {/* User Info */}
            <div
              className={`flex items-center gap-2 px-4 py-2 ${
                isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-100"
              } rounded-lg`}
            >
              {user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt={user?.firstName || "User"}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-sm">
                  {user?.firstName?.charAt(0)}
                </div>
              )}
              <span
                className={`${textColor} text-sm font-medium hidden md:block`}
              >
                {user?.firstName}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
