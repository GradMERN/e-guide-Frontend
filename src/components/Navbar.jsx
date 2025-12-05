import { NavLink, useNavigate } from "react-router-dom";
import {
  FaEye,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaBars,
  FaTimes,
  FaUser,
  FaHeart,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaChalkboardTeacher,
  FaBookmark,
} from "react-icons/fa";
import { useEffect, useState, useRef } from "react";
import ThemeToggle from "../components/ThemeToggle";
import Switch from "./common/SwitchLanguages";
import { useAuth } from "../store/hooks";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { FaB } from "react-icons/fa6";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const links = [
    { name: "Home", path: "/" },
    { name: "Tours", path: "/tours" },
    { name: "Destinations", path: "/destinations" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Base dropdown items
  const baseDropdownItems = [
    { name: "My Tours", path: "/my-tours", icon: FaMapMarkedAlt },
    { name: "Profile", path: "/profile", icon: FaUser },
    { name: "Saved", path: "/saved", icon: FaBookmark },
  ];

  // Guide-specific dropdown item
  const guideDashboardItem = {
    name: "Guide Dashboard",
    path: "/guide/dashboard",
    icon: FaChalkboardTeacher,
  };

  // Combine dropdown items based on user role
  const getDropdownItems = () => {
    const items = [...baseDropdownItems];

    // Check if user has guide role (case-insensitive)
    if (user?.role && user.role.toLowerCase() === "guide") {
      // Add guide dashboard at the beginning
      items.unshift(guideDashboardItem);
    }

    return items;
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll < lastScrollY - 10) {
        setShowNavbar(true);
      } else if (currentScroll > lastScrollY + 10) {
        setShowNavbar(false);
      }

      lastScrollY = currentScroll;
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

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

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const getUserInitials = () => {
    if (!user || !user.id) return "U";

    // Try firstName and lastName first
    if (user.firstName && user.lastName) {
      const first = user.firstName[0].toUpperCase();
      const last = user.lastName[0].toUpperCase();
      return first + last;
    }

    // Fallback to name field
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

  // Get display name for greeting
  const getDisplayName = () => {
    if (!user || !user.id) return "User";

    // Try firstName and lastName
    if (user.firstName) {
      return user.firstName;
    }

    // Fallback to name field
    if (user.name) {
      const cleanName = user.name.trim();
      const nameParts = cleanName.split(/\s+/);
      return nameParts[0];
    }

    return "User";
  };

  // Check if user is a guide
  const isGuide = user?.role && user.role.toLowerCase() === "guide";

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-100 transition-transform duration-500
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* Top Small Navbar */}
      <div className="w-full bg-surface dark:bg-surface border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2">
            <div className="hidden lg:flex items-center gap-4 text-sm text-text-secondary">
              <div className="flex items-center gap-1">
                <FaPhone className="text-primary text-xs" />
                <span>+20 123 456 7890</span>
              </div>
              <div className="flex items-center gap-1">
                <FaEnvelope className="text-primary text-xs" />
                <span>info@mysticegypttours.com</span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock className="text-primary text-xs" />
                <span>24/7 Support</span>
              </div>
            </div>

            <div className="lg:hidden flex items-center gap-2 text-xs text-text-secondary">
              <FaPhone className="text-primary" />
              <span>+20 123 456 7890</span>
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
              {user && user.id ? (
                <div className="hidden md:block relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 group"
                  >
                    {/* Avatar with initials */}
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-gradient-from via-gradient-via to-gradient-to flex items-center justify-center text-sm font-bold text-background hover:scale-105 transition-transform shadow-md relative">
                      <span className="text-background text-sm font-bold">
                        {getUserInitials()}
                      </span>

                      {/* Guide badge */}
                      {isGuide && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-secondary border-2 border-surface flex items-center justify-center">
                          <FaChalkboardTeacher className="text-background text-[8px]" />
                        </div>
                      )}
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                      <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                        Hello, {getDisplayName()}!{isGuide && " (Guide)"}
                      </div>
                      <div className="w-2 h-2 bg-gray-900 transform rotate-45 absolute -top-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-surface dark:bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
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
                                : user?.name || "User"}
                              {isGuide && (
                                <span className="ml-2 text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                                  Guide
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-text-muted truncate">
                              {user?.email || ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
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
                            {item.name === "Guide Dashboard" && (
                              <span className="ml-auto text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                                Guide
                              </span>
                            )}
                          </NavLink>
                        ))}

                        {/* Logout Button */}
                        <div className="border-t border-border mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500/10 transition-colors group"
                          >
                            <FaSignOutAlt className="text-base group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Login Button */
                <div className="hidden md:flex items-center">
                  <NavLink
                    to="/login"
                    className="px-5 py-2 rounded-lg bg-linear-to-r from-gradient-from via-gradient-via to-gradient-to 
                           text-background font-medium shadow-md hover:brightness-110 transition hover:scale-105 text-sm"
                  >
                    Login
                  </NavLink>
                </div>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-surface dark:bg-surface border-t border-border py-4">
              <div className="flex flex-col space-y-4">
                {links.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-2 px-4 text-lg transition font-medium rounded-lg
                       ${
                         isActive
                           ? "text-primary bg-primary/10"
                           : "text-text hover:text-primary hover:bg-primary/5"
                       }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}

                {user && user.id ? (
                  <>
                    {/* User Info in Mobile */}
                    <div className="px-4 mb-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-gradient-from/5 via-gradient-via/5 to-gradient-to/5 border border-border">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-linear-to-br from-gradient-from via-gradient-via to-gradient-to flex items-center justify-center text-base font-bold text-background">
                            {getUserInitials()}
                          </div>
                          {isGuide && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary border-2 border-surface flex items-center justify-center">
                              <FaChalkboardTeacher className="text-background text-[10px]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text truncate">
                            Hello, {getDisplayName()}!
                            {isGuide && (
                              <span className="ml-2 text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                                Guide
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Dropdown Items */}
                    {getDropdownItems().map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-4 text-base transition font-medium text-text hover:text-primary hover:bg-primary/5 rounded-lg"
                      >
                        <item.icon className="text-lg" />
                        <span>{item.name}</span>
                        {item.name === "Guide Dashboard" && (
                          <span className="ml-auto text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded-full">
                            Guide
                          </span>
                        )}
                      </NavLink>
                    ))}

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-3 px-4 text-base font-medium text-red-500 hover:bg-red-500/10 rounded-lg w-full text-left mt-2"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <NavLink
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-3 px-4 text-base bg-linear-to-r from-gradient-from via-gradient-via to-gradient-to 
                           text-background font-medium shadow-md hover:brightness-110 transition text-center rounded-lg"
                  >
                    Login
                  </NavLink>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
