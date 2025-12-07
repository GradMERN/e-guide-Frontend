import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaBars,
  FaTimes,
  FaUser,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaBookmark,
  FaHome,
  FaRoute,
  FaGlobeAfrica,
  FaInfoCircle,
  FaAddressCard,
} from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";
import Switch from "./common/SwitchLanguages";
import { useTranslation } from "react-i18next";
import { useAuth as useReduxAuth } from "../store/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setNavbarVisible, setNavbarHeight } from "../store/slices/uiSlice";

export default function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const user = auth?.user || null;
  const dispatch = useDispatch();
  const { logout } = useReduxAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navbarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const links = [
    { name: t("navbar.links.home"), path: "/", icon: FaHome },
    { name: t("navbar.links.tours"), path: "/tours", icon: FaRoute },
    {
      name: t("navbar.links.destinations"),
      path: "/destinations",
      icon: FaGlobeAfrica,
    },
    { name: t("navbar.links.about"), path: "/about", icon: FaInfoCircle },
    { name: t("navbar.links.contact"), path: "/contact", icon: FaAddressCard },
  ];

  const baseDropdownItems = [
    {
      name: t("navbar.dropdown.myTours"),
      path: "/my-tours",
      icon: FaMapMarkedAlt,
    },
    { name: t("navbar.dropdown.profile"), path: "/profile", icon: FaUser },
    { name: t("navbar.dropdown.saved"), path: "/saved", icon: FaBookmark },
  ];

  const guideDashboardItem = {
    name: t("navbar.dropdown.guideDashboard"),
    path: "/guide/dashboard",
    icon: FaChalkboardTeacher,
  };

  const getDropdownItems = () => {
    const items = [...baseDropdownItems];
    if (user?.role && user.role.toLowerCase() === "guide") {
      items.unshift(guideDashboardItem);
    }
    return items;
  };

  // Desktop scroll behavior only
  useEffect(() => {
    if (!isMobile) {
      let lastScrollY = window.scrollY;

      const updateScroll = () => {
        const currentScroll = window.scrollY;

        if (currentScroll < lastScrollY - 10) {
          setShowNavbar(true);
          dispatch(setNavbarVisible(true));
        } else if (currentScroll > lastScrollY + 10) {
          setShowNavbar(false);
          dispatch(setNavbarVisible(false));
        }

        lastScrollY = currentScroll;
      };

      window.addEventListener("scroll", updateScroll);
      return () => window.removeEventListener("scroll", updateScroll);
    }
  }, [isMobile, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update navbar height
  useEffect(() => {
    const updateHeight = () => {
      if (navbarRef.current) {
        const height = navbarRef.current.offsetHeight;
        dispatch(setNavbarHeight(height));
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [dispatch]);

  const handleLogout = (redirect = "/login") => {
    try {
      logout();
    } catch (e) {
      console.warn("Logout failed", e);
    }
    setIsDropdownOpen(false);
    toggleMobileMenu(false);
    navigate(redirect);
  };

  const toggleMobileMenu = (open) => {
    if (open !== undefined) {
      setIsMobileMenuOpen(open);
      setSidebarAnimating(true);
      setTimeout(() => setSidebarAnimating(false), 300);
    } else {
      setIsMobileMenuOpen(!isMobileMenuOpen);
      setSidebarAnimating(true);
      setTimeout(() => setSidebarAnimating(false), 300);
    }
  };

  const getUserInitials = () => {
    if (!user || !user.id) return "U";

    if (user.firstName && user.lastName) {
      const first = user.firstName[0].toUpperCase();
      const last = user.lastName[0].toUpperCase();
      return first + last;
    }

    if (user.name) {
      const cleanName = user.name.trim();
      const nameParts = cleanName.split(/\s+/);

      if (nameParts.length >= 2) {
        return (
          nameParts[0][0] + nameParts[nameParts.length - 1][0]
        ).toUpperCase();
      } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
        return nameParts[0].substring(0, 2).toUpperCase();
      } else if (nameParts[0]) {
        return nameParts[0][0].toUpperCase();
      }
    }

    return "U";
  };

  const getDisplayName = () => {
    if (!user || !user.id) return t("navbar.user");
    if (user.firstName) {
      return user.firstName;
    }
    if (user.name) {
      const cleanName = user.name.trim();
      const nameParts = cleanName.split(/\s+/);
      return nameParts[0];
    }
    return t("navbar.user");
  };

  const isGuide = user?.role && user.role.toLowerCase() === "guide";

  return (
    <>
      {/* Mobile Sidebar Overlay - MOVED OUTSIDE navbar container */}
      <div
        className={`fixed inset-0 z-[200] md:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } ${sidebarAnimating ? "transition-all duration-300" : ""}`}
      >
        {/* Backdrop with smooth fade */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => toggleMobileMenu(false)}
        />

        {/* Sidebar with smooth slide animation */}
        <div
          className={`absolute top-0 left-0 h-full w-64 max-w-[75vw] bg-surface shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Compact Sidebar Header */}
          <div className="p-4 border-b border-border bg-linear-to-r from-gradient-from/10 via-gradient-via/10 to-gradient-to/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gradient-from via-gradient-via to-gradient-to flex items-center justify-center">
                <FaEye className="text-background text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">Mystic Egypt</h2>
              </div>
            </div>
          </div>

          {/* Compact User Info */}
          {auth?.isAuthenticated ? (
            <div className="p-3 border-b border-border bg-linear-to-r from-gradient-from/5 via-gradient-via/5 to-gradient-to/5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-gradient-from via-gradient-via to-gradient-to flex items-center justify-center text-sm font-bold text-background">
                    {getUserInitials()}
                  </div>
                  {isGuide && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary border-2 border-surface flex items-center justify-center">
                      <FaChalkboardTeacher className="text-background text-[8px]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text truncate">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 border-b border-border bg-linear-to-r from-gradient-from/5 via-gradient-via/5 to-gradient-to/5">
              <div className="text-center">
                <p className="text-sm text-text mb-2">Welcome</p>
                <NavLink
                  to="/login"
                  onClick={() => toggleMobileMenu(false)}
                  className="inline-block px-4 py-1.5 text-xs rounded-lg bg-linear-to-r from-gradient-from via-gradient-via to-gradient-to 
                           text-background font-medium hover:brightness-110 transition"
                >
                  {t("navbar.login")}
                </NavLink>
              </div>
            </div>
          )}

          {/* Compact Navigation Links */}
          <div className="p-2">
            <div className="space-y-1 mb-4">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => toggleMobileMenu(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 px-3 rounded-lg transition-all text-sm
                     ${
                       isActive
                         ? "bg-primary/10 text-primary"
                         : "text-text hover:bg-primary/5 hover:text-primary"
                     }`
                  }
                >
                  <link.icon className="text-base" />
                  <span className="font-medium">{link.name}</span>
                </NavLink>
              ))}
            </div>

            {/* User Menu Links (if logged in) */}
            {auth?.isAuthenticated && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-3">
                  Account
                </div>
                <div className="space-y-1">
                  {getDropdownItems().map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => toggleMobileMenu(false)}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm text-text hover:bg-primary/5 hover:text-primary transition-all"
                    >
                      <item.icon className="text-sm" />
                      <span>{item.name}</span>
                      {item.name === t("navbar.dropdown.guideDashboard") && (
                        <span className="ml-auto text-xs bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full">
                          {t("navbar.guide")}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}

            {/* Compact Footer Section */}
            <div className=" border-t border-border">
              {/* Theme & Language Toggles with top/bottom borders only */}
              <div className="">
                <div className="flex items-center justify-between py-3 px-2">
                  <div className="flex items-center gap-2">
                    <span className="sr-only">Theme toggle</span>
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="sr-only">Language switch</span>
                    <Switch />
                  </div>
                </div>
              </div>

              {/* Compact Contact Info */}
              <div className="space-y-1.5 text-xs text-text-secondary mb-4">
                <div className="flex items-center gap-2 px-1">
                  <FaPhone className="text-primary" size={10} />
                  <span>{t("navbar.contact.phone")}</span>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <FaEnvelope className="text-primary" size={10} />
                  <span>{t("navbar.contact.email")}</span>
                </div>
              </div>

              {/* Compact Logout Button (if logged in) */}
              {auth?.isAuthenticated && (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMobileMenu(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 mb-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium"
                >
                  <FaSignOutAlt size={12} />
                  <span>{t("navbar.logout")}</span>
                </button>
              )}

              {/* Compact Close Button */}
              <button
                onClick={() => toggleMobileMenu(false)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-surface border border-border text-text hover:bg-surface/80 transition-colors text-sm font-medium"
              >
                <FaTimes size={12} />
                <span>Close Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar Container - SEPARATED FROM sidebar overlay */}
      <div
        dir="ltr"
        ref={navbarRef}
        className={`
          fixed top-0 left-0 right-0 z-[100] text-left!
          ${
            isMobile
              ? "translate-y-0"
              : showNavbar
              ? "translate-y-0"
              : "-translate-y-full"
          }
          transition-transform duration-500 ease-out
        `}
      >
        {/* Top Small Navbar */}
        <div className="w-full bg-surface dark:bg-surface border-b border-primary/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-2">
              <div className="hidden lg:flex items-center gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-1">
                  <FaPhone className="text-primary text-xs" />
                  <span>{t("navbar.contact.phone")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaEnvelope className="text-primary text-xs" />
                  <span>{t("navbar.contact.email")}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaClock className="text-primary text-xs" />
                  <span>{t("navbar.contact.support")}</span>
                </div>
              </div>

              <div className="lg:hidden flex items-center gap-2 text-xs text-text-secondary">
                <FaPhone className="text-primary" />
                <span>{t("navbar.contact.phone")}</span>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Switch />
              </div>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="w-full bg-surface dark:bg-surface shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-gradient-from via-gradient-via to-gradient-to flex items-center justify-center shadow-md">
                  <FaEye className="text-background text-xl" />
                </div>
                <h1 className="text-xl font-bold text-primary dark:text-primary tracking-wide">
                  Mystic Egypt Tours
                </h1>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {links.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `relative text-[14px] transition font-medium
                       ${
                         isActive
                           ? "text-primary"
                           : "text-text hover:text-primary"
                       }
                       after:content-[''] after:absolute after:left-0 after:-bottom-1
                       after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300
                       hover:after:w-full`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {auth?.isAuthenticated ? (
                  <div className="hidden md:block relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-gradient-from via-gradient-via to-gradient-to flex items-center justify-center text-sm font-bold text-background hover:scale-105 transition-transform shadow-md relative">
                        <span className="text-background text-sm font-bold">
                          {getUserInitials()}
                        </span>
                        {isGuide && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary border-2 border-surface flex items-center justify-center">
                            <FaChalkboardTeacher className="text-background text-[8px]" />
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                          {t("navbar.greeting", { name: getDisplayName() })}
                          {isGuide && ` (${t("navbar.guide")})`}
                        </div>
                        <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -top-1 left-1/2 -translate-x-1/2"></div>
                      </div>
                    </button>

                    {/* Desktop Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-surface dark:bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 ease-out">
                        <div className="p-4 border-b border-border bg-linear-to-r from-gradient-from/5 via-gradient-via/5 to-gradient-to/5">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-linear-to-br from-gradient-from via-gradient-via to-gradient-to flex items-center justify-center text-sm font-bold text-background">
                                {getUserInitials()}
                              </div>
                              {isGuide && (
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary border-2 border-surface flex items-center justify-center">
                                  <FaChalkboardTeacher className="text-background text-[8px]" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-text truncate">
                                {user?.firstName && user?.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user?.name || t("navbar.user")}
                                {isGuide && (
                                  <span className="ml-2 text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                                    {t("navbar.guide")}
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-text-muted truncate">
                                {user?.email || ""}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          {getDropdownItems().map((item) => (
                            <NavLink
                              key={item.name}
                              to={item.path}
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-text hover:bg-primary/10 hover:text-primary transition-colors group"
                            >
                              <item.icon className="text-base group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-medium">
                                {item.name}
                              </span>
                              {item.name ===
                                t("navbar.dropdown.guideDashboard") && (
                                <span className="ml-auto text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                                  {t("navbar.guide")}
                                </span>
                              )}
                            </NavLink>
                          ))}
                          <div className="border-t border-border mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 transition-colors group"
                            >
                              <FaSignOutAlt className="text-base group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-medium">
                                {t("navbar.logout")}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden md:flex items-center">
                    <NavLink
                      to="/login"
                      className="px-5 py-2 rounded-lg bg-linear-to-r from-gradient-from via-gradient-via to-gradient-to 
                             text-background font-medium shadow-md hover:brightness-110 transition hover:scale-105 text-sm"
                    >
                      {t("navbar.login")}
                    </NavLink>
                  </div>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => toggleMobileMenu()}
                  className="md:hidden p-2 rounded-lg text-text hover:text-primary transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <FaTimes size={20} />
                  ) : (
                    <FaBars size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
