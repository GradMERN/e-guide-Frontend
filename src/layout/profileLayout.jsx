import SideBar from "../pages/profile/SideBar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth as useAuthStore } from "../store/hooks";
import { useAuth as useAuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { FaHome, FaChalkboardTeacher } from "react-icons/fa";
import LoadingScreen from "../components/common/LoadingScreen";

import { getImageUrl } from "../utils/imageUtils";
import ThemeToggle from "../components/common/ThemeToggle";
import Switch from "../components/common/LanguageSwitch";

const ProfileLayout = () => {
  const { user } = useAuthStore();
  const { isDarkMode } = useAuthContext();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const canViewDashboard = user?.role === "admin" || user?.role === "guide";

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--background)">
        <LoadingScreen size={48} label={t("common.loading") || "Loading..."} />
      </div>
    );
  }

  const headerBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const hoverBg = isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100";

  const handleDashboardNavigation = () => {
    if (user?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (user?.role === "guide") {
      navigate("/guide/dashboard");
    }
  };

  return (
    <div dir="ltr" className="flex h-screen relative overflow-hidden" style={{ backgroundColor: "var(--background)", color: "var(--text)" }}>
      <SideBar />

      <div className="flex-1 flex flex-col min-w-0 w-full h-full transition-all duration-300">
        <header className={`h-14 sm:h-16 ${headerBg} border-b ${borderColor} flex items-center justify-end sm:justify-between px-2 sm:px-6 z-30 shrink-0 transition-all`}>
          <div className="truncate mr-2 hidden sm:block">
            <h1 className={`text-xl font-semibold ${textColor} truncate`}>
              {t("profileSettings")}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            {canViewDashboard && (
              <button onClick={handleDashboardNavigation} className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-lg bg-[#D5B36A] text-black hover:bg-[#C4A55A] transition-all text-sm font-medium shadow-md shrink-0" title={t("admin.dashboard")}>
                <FaChalkboardTeacher className="text-lg" />
                <span className="hidden lg:inline">{t("admin.dashboard") || "Dashboard"}</span>
              </button>
            )}

            <button onClick={() => navigate("/")} className={`flex items-center gap-2 p-2 sm:px-4 sm:py-2 rounded-lg border-2 border-[#D5B36A]/50 hover:border-[#D5B36A] ${hoverBg} ${textColor} transition-all shrink-0`} title={t("admin.viewWebsite")}>
              <FaHome className="text-lg text-[#D5B36A]" />
              <span className="hidden md:inline text-sm font-medium">
                {t("admin.viewWebsite")}
              </span>
            </button>

            <div className="flex items-center gap-1 sm:gap-2 sm:border-l sm:border-r px-1 sm:px-3 border-gray-500/20">
              <div className="scale-75 sm:scale-100 flex items-center">
                <ThemeToggle />
              </div>
              <div className="scale-75 sm:scale-100 flex items-center">
                <Switch />
              </div>
            </div>

            <div className={`flex items-center gap-2 sm:p-1.5 sm:px-3 rounded-lg shrink-0`}>
              <div className="w-8 h-8 sm:w-8 sm:h-8 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-xs sm:text-sm overflow-hidden shrink-0 shadow-sm">
                {getImageUrl(user?.avatar) ? (
                  <img src={getImageUrl(user.avatar)} alt="Profile" className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/150?text=U";
                    }}/>
                ) : (
                  user?.firstName?.charAt(0)
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-6 overflow-y-auto overflow-x-hidden w-full">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;