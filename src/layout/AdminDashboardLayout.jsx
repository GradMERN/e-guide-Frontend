import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/hooks";
import { useTranslation } from "react-i18next";
import AdminSidebar from "../pages/admin/AdminSidebar";
import LoadingScreen from "../components/common/LoadingScreen";
import { FaMoon, FaSun, FaGlobe, FaBars } from "react-icons/fa";

const AdminLayout = () => {
  const { user, isDarkMode, toggleTheme, language, changeLanguage } =
    useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user || user.role !== "admin") return null;

  const mainBg = isDarkMode ? "bg-[#0F0E0C]" : "bg-gray-50";
  const headerBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const hoverBg = isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100";

  return (
    <div className={`min-h-screen ${mainBg} flex overflow-hidden`} dir="ltr">
      <div className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${ sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setSidebarOpen(false)}/>

      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isDarkMode={isDarkMode} isRtl={false}/>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <header className={`h-16 ${headerBg} border-b ${borderColor} flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg ${hoverBg} ${secondaryText} transition-all lg:hidden`}>
              <FaBars size={20} />
            </button>
            <h1 className={`text-lg font-semibold ${textColor} hidden sm:block`}>
              {t("welcome")}, {user?.firstName}!
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={() => toggleTheme?.()} className={`p-2 rounded-lg ${hoverBg} ${secondaryText}`}>
              {isDarkMode ? <FaSun /> : <FaMoon />}
            </button>

            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className={`p-2 rounded-lg ${hoverBg} ${secondaryText} flex items-center gap-2`}>
                <FaGlobe />
                <span className="hidden md:inline text-xs font-bold uppercase">
                  {language}
                </span>
              </button>
              {showLangMenu && (
                <div className={`absolute right-0 mt-2 w-36 ${headerBg} rounded-xl shadow-xl border ${borderColor} py-1 z-50`}>
                  {["en", "ar"].map((l) => (
                    <button key={l} onClick={() => { changeLanguage?.(l); i18n.changeLanguage(l); setShowLangMenu(false);}}
                      className={`w-full text-left px-4 py-2 text-sm ${textColor} ${hoverBg}`}>
                      {l === "en" ? "English" : "العربية"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-2 p-1 rounded-full hover:bg-black/5 transition-all">
                <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center text-black font-bold text-sm shrink-0 overflow-hidden">
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user?.firstName} className="w-full h-full object-cover"/>
                  ) : (
                    user?.firstName?.charAt(0)
                  )}
                </div>
              </button>
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-48 ${headerBg} rounded-xl shadow-xl border ${borderColor} py-2 z-50`}>
                  <button onClick={() => { navigate("/profile"); setShowUserMenu(false);}} className={`w-full text-left px-4 py-2 text-sm ${textColor} ${hoverBg}`}>
                    {t("admin.profileSettings")}
                  </button>
                  <button onClick={() => { navigate("/"); setShowUserMenu(false);}} className={`w-full text-left px-4 py-2 text-sm ${textColor} ${hoverBg}`}>
                    {t("admin.viewWebsite")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto ${mainBg} p-4 sm:p-6`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
