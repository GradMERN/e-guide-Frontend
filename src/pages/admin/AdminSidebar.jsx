import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import {FaHome,FaMapMarkedAlt,FaUsers,FaUserTie,FaBars,FaTimes,FaEye,FaClipboardList,FaSignOutAlt,FaMapMarkerAlt} from "react-icons/fa";

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, isDarkMode, isRtl }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { name: t("admin.dashboard"), path: "/admin/dashboard", icon: FaHome },
    { name: t("admin.placesMenu"), path: "/admin/places", icon: FaMapMarkerAlt },
    { name: t("admin.toursMenu"), path: "/admin/tours", icon: FaMapMarkedAlt },
    { name: t("admin.usersMenu"), path: "/admin/users", icon: FaUsers },
    { name: t("admin.guidesMenu"), path: "/admin/guides", icon: FaUserTie },
    { name: t("guide.applications"), path: "/admin/guide-applications", icon: FaClipboardList },
  ];

  const bgColor = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const hoverBg = isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";

  return (
    <aside className={`fixed top-0 bottom-0 z-50 ${bgColor} ${ isRtl ? "right-0 border-l" : "left-0 border-r"} ${borderColor} transition-all duration-300 ease-in-out flex flex-col ${ sidebarOpen ? "w-64 translate-x-0" : "w-20 lg:translate-x-0 " + (isRtl ? "translate-x-full" : "-translate-x-full")}`}>
      <div className={`h-16 flex items-center justify-between px-4 border-b ${borderColor} shrink-0`}>
        {sidebarOpen && (
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center shrink-0 shadow-sm">
              <FaEye className="text-black text-sm" />
            </div>
            <span className="text-[#D5B36A] font-bold text-sm tracking-tight uppercase">
              {t("admin.sidebar.title")}
            </span>
          </div>
        )}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`text-[#D5B36A] p-2 rounded-lg transition-all ${hoverBg} ${!sidebarOpen && "mx-auto"}`}>
          {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)} className={({ isActive }) => ` flex items-center gap-3 px-3 py-3 mb-2 rounded-xl transition-all group ${ isActive ? "bg-linear-to-r from-[#C7A15C] to-[#E2C784] text-black shadow-md shadow-[#C7A15C]/20"  : `${secondaryText} ${hoverBg} hover:text-[#D5B36A]`}`}>
            <item.icon className="text-xl shrink-0" />
            {sidebarOpen && (
              <span className="font-semibold text-sm truncate">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={`p-4 border-t ${borderColor} shrink-0`}>
        <div className={`flex flex-col gap-4 ${!sidebarOpen ? "items-center" : ""}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-r from-[#C7A15C] to-[#E2C784] border border-[#D5B36A]/40 flex items-center justify-center text-black font-bold shrink-0 overflow-hidden shadow-lg">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt={user?.firstName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg">{user?.firstName?.charAt(0) || "U"}</span>
              )}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-bold ${textColor} truncate`}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] font-bold text-[#D5B36A] uppercase tracking-widest opacity-80">
                  {user?.role === "admin" ? t("user.roleAdmin") : t("user.roleGuide")}
                </p>
              </div>
            )}
          </div>

          <button 
            onClick={() => { logout(); navigate("/"); }} className={`flex items-center gap-3 transition-all rounded-lg font-bold uppercase tracking-wide text-red-500 hover:bg-red-500/10 ${ sidebarOpen ? "w-full px-3 py-2.5" : "p-2.5 justify-center"}`} >
            <FaSignOutAlt size={18} className="shrink-0" />
            {sidebarOpen && <span className="text-xs">{t("admin.logout")}</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;