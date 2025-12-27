import SideBar from "./SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth as useAuthStore } from "../../store/hooks";
import { useAuth as useAuthContext } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { FaHome } from "react-icons/fa";
import GoldenSpinner from "../../components/common/GoldenSpinner";
import { getImageUrl } from "../../utils/imageUtils";
import ThemeToggle from "../../components/common/ThemeToggle";
import Switch from "../../components/common/LanguageSwitch";

const ProfileLayout = () => {
  const { user } = useAuthStore();
  const { isDarkMode } = useAuthContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <GoldenSpinner size={48} label={t("common.loading") || "Loading..."} />
      </div>
    );
  }

  const headerBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const hoverBg = isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100";

  return (
    <div dir="ltr"
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
            <ThemeToggle />

            {/* Language Switch */}
            <Switch />

            {/* User Info */}
            <div
              className={`flex items-center gap-2 px-4 py-2 ${
                isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-100"
              } rounded-lg`}
            >
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-sm overflow-hidden">
                {getImageUrl(user?.avatar) ? (
                  <img
                    src={getImageUrl(user.avatar)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/150?text=Error";
                    }}
                  />
                ) : (
                  user?.firstName?.charAt(0)
                )}
              </div>
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