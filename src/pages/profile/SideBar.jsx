import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";

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
      name: t("preferences"),
      path: "/profile/preferences",
      icon: (
        <svg
          viewBox="0 0 64 64"
          data-name="Layer 1"
          stroke="currentColor"
          // fill="none"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          fill="#dddddf"
          className="w-6 h-6"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <title></title>
            <path
              className="cls-1"
              d="M15.61,39.84a2,2,0,0,1-2-2V8.92a2,2,0,0,1,4,0V37.84A2,2,0,0,1,15.61,39.84Z"
            ></path>
            <path
              className="cls-1"
              d="M15.61,57.08a2,2,0,0,1-2-2v-6a2,2,0,0,1,4,0v6A2,2,0,0,1,15.61,57.08Z"
            ></path>
            <path
              className="cls-1"
              d="M32,37.82a2,2,0,0,1-2-2V26.16a2,2,0,1,1,4,0v9.66A2,2,0,0,1,32,37.82Z"
            ></path>
            <path
              className="cls-1"
              d="M32,57.08a2,2,0,0,1-2-2v-8a2,2,0,1,1,4,0v8A2,2,0,0,1,32,57.08Z"
            ></path>
            <path
              className="cls-1"
              d="M32,16.92a2,2,0,0,1-2-2v-6a2,2,0,0,1,4,0v6A2,2,0,0,1,32,16.92Z"
            ></path>
            <path
              className="cls-1"
              d="M48.39,33.84a2,2,0,0,1-2-2V8.92a2,2,0,0,1,4,0V31.84A2,2,0,0,1,48.39,33.84Z"
            ></path>
            <path
              className="cls-1"
              d="M48.39,57.08a2,2,0,0,1-2-2v-12a2,2,0,0,1,4,0v12A2,2,0,0,1,48.39,57.08Z"
            ></path>
            <path
              className="cls-2"
              d="M15.61,51.08a7.62,7.62,0,1,1,7.61-7.62A7.62,7.62,0,0,1,15.61,51.08Zm0-11.24a3.62,3.62,0,1,0,3.61,3.62A3.62,3.62,0,0,0,15.61,39.84Z"
            ></path>
            <path
              className="cls-2"
              d="M32,28.16a7.62,7.62,0,1,1,7.62-7.62A7.62,7.62,0,0,1,32,28.16Zm0-11.24a3.62,3.62,0,1,0,3.62,3.62A3.62,3.62,0,0,0,32,16.92Z"
            ></path>
            <path
              className="cls-2"
              d="M48.39,45.08A7.63,7.63,0,1,1,56,37.46,7.62,7.62,0,0,1,48.39,45.08Zm0-11.24a3.6,3.6,0,1,0,2.9,1.44A3.62,3.62,0,0,0,48.39,33.84Z"
            ></path>
          </g>
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
            // d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            d="M12 3.73169L19.5 5.39836V12.75C19.5 15.6371 17.5419 18.9972 12.2605 20.9533L12 21.0498L11.7395 20.9533C6.45811 18.9972 4.5 15.6371 4.5 12.75V5.39836L12 3.73169ZM6 6.60161V12.75C6 14.8245 7.3659 17.6481 12 19.4479C16.6341 17.6481 18 14.8245 18 12.75V6.60161L12 5.26828L6 6.60161Z"
          ></path>
        </svg>
      ),
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
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-black font-bold text-lg flex-shrink-0 border-2"
              style={{
                borderColor: "var(--primary)",
                background: "linear-gradient(to right, #C7A15C, #E2C784)",
              }}
            >
              {user?.firstName?.charAt(0) || "U"}
            </div>
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
            // style={{ color: "var(--text-muted)" }}
          >
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            <span className="mx-4 hidden md:inline ">{t("logout")}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SideBar;
