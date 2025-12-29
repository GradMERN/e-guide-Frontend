import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import { getImageUrl } from "../../utils/imageUtils";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    {
      name: t("overview"),
      path: "/profile/overview",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          ></path>
        </svg>
      ),
    },
    {
      name: t("personalInfo"),
      path: "/profile/info",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
      ),
    },
    {
      name: t("security"),
      path: "/profile/security",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3.73169L19.5 5.39836V12.75C19.5 15.6371 17.5419 18.9972 12.2605 20.9533L12 21.0498L11.7395 20.9533C6.45811 18.9972 4.5 15.6371 4.5 12.75V5.39836L12 3.73169ZM6 6.60161V12.75C6 14.8245 7.3659 17.6481 12 19.4479C16.6341 17.6481 18 14.8245 18 12.75V6.60161L12 5.26828L6 6.60161Z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-16 md:w-64 px-2 md:px-4 py-4 h-full shrink-0 box-border flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-(--border) overflow-y-auto" style={{ backgroundColor: "var(--surface)" }}>
      <nav className="flex flex-col gap-1">
        <div className="flex items-center justify-center md:justify-start md:p-2 mb-6">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-black font-bold text-lg shrink-0 border-2 overflow-hidden transition-all" style={{ borderColor: "var(--primary)", background: getImageUrl(user?.avatar) ? "transparent" : "linear-gradient(to right, #C7A15C, #E2C784)",}}>
            {getImageUrl(user?.avatar) ? (
              <img src={getImageUrl(user.avatar)} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Error";}}/>
            ) : (
              user?.firstName?.charAt(0) || "U"
            )}
          </div>
          
          <div className="mx-3 hidden md:block overflow-hidden">
            <h3 className="text-md font-bold truncate" style={{ color: "var(--text)" }}>
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.name || "User"}
            </h3>
            <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
              {user?.city && user?.country
                ? `${user.city}, ${user.country}`
                : user?.address || user?.email || ""}
            </p>
          </div>
        </div>

        <div className="border-t my-2 md:my-4 hidden md:block" style={{ borderColor: "var(--border)" }}></div>

        <div className="space-y-2">
          {links.map(({ name, path, icon }) => {
            const isOverviewActive = path === "/profile/overview" && (location.pathname === "/profile" || location.pathname === "/profile/");
            return (
              <NavLink key={name} to={path} className={({ isActive }) => `flex items-center justify-center md:justify-start p-3 rounded-md font-bold no-underline transition-colors duration-200 ${ isActive || isOverviewActive ? "" : ""}`} style={({ isActive }) => ({ backgroundColor: isActive || isOverviewActive ? "var(--primary)" : "transparent", color: isActive || isOverviewActive ? "var(--text-button)" : "var(--text-muted)",})} end={path === "/profile/overview" || path === "/profile"} title={name}>
                {icon}
                <span className="mx-4 hidden md:inline whitespace-nowrap">{name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
      
      <div>
        <button onClick={handleLogout} className="w-full hover:bg-red-700 hover:text-white text-text-muted flex items-center justify-center md:justify-start p-3 rounded-md transition-colors duration-200" title={t("logout")}>
          <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          <span className="mx-4 hidden md:inline">{t("logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default SideBar;