import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import { FaThLarge, FaUser, FaShieldAlt, FaSignOutAlt } from "react-icons/fa";

const SideBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Define the sidebar navigation links to profile sub-pages
  const links = [
    {
      name: t("overview"),
      path: "/profile/overview",
      icon: <FaThLarge className="w-5 h-5" />,
    },
    {
      name: t("personalInfo"),
      path: "/profile/info",
      icon: <FaUser className="w-5 h-5" />,
    },
    {
      name: t("security"),
      path: "/profile/security",
      icon: <FaShieldAlt className="w-5 h-5" />,
    },
  ];

  return (
    <div className="sticky top-0 h-full">
      <aside
        className="w-20 md:w-60 px-3 py-4 h-screen box-border flex flex-col justify-between transition-all duration-300"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <nav>
          <div className="flex items-center justify-center md:justify-start md:p-2 mb-6">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user?.firstName || "User"}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2"
                style={{ borderColor: "var(--primary)" }}
              />
            ) : (
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg flex-shrink-0 border-2"
                style={{
                  borderColor: "var(--primary)",
                  background: "linear-gradient(to right, #C7A15C, #E2C784)",
                }}
              >
                {user?.firstName?.charAt(0) || "U"}
              </div>
            )}
            <div className="mx-3 hidden md:block">
              <h3
                className="text-md font-bold"
                style={{ color: "var(--text)" }}
              >
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.name || "User"}
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {user?.city && user?.country
                  ? `${user.city}, ${user.country}`
                  : user?.address || user?.email || ""}
              </p>
            </div>
          </div>

          <div
            className="border-t my-4 hidden md:block"
            style={{ borderColor: "var(--border)" }}
          ></div>

          <div className="space-y-2">
            {links.map(({ name, path, icon }) => {
              const isOverviewActive =
                path === "/profile/overview" &&
                (location.pathname === "/profile" ||
                  location.pathname === "/profile/");
              return (
                <NavLink
                  key={name}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center justify-center md:justify-start p-3 rounded-md font-bold no-underline transition-colors duration-200 ${
                      isActive || isOverviewActive ? "" : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor:
                      isActive || isOverviewActive
                        ? "var(--primary)"
                        : "transparent",
                    color:
                      isActive || isOverviewActive
                        ? "var(--text-button)"
                        : "var(--text-muted)",
                  })}
                  end={path === "/profile/overview" || path === "/profile"}
                >
                  {icon}
                  <span className="mx-4 hidden md:inline">{name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>
        <div>
          <button
            onClick={handleLogout}
            className="w-full hover:bg-red-700 hover:text-white text-text-muted flex items-center justify-center md:justify-start p-3 rounded-md transition-colors duration-200"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="mx-4 hidden md:inline ">{t("logout")}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
