import { NavLink } from "react-router-dom";
import {
  FaEye,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import Switch from "./ui/SwitchLanguages";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);

  const links = [
    { name: "Home", path: "/" },
    { name: "Tours", path: "/tours" },
    { name: "Destinations", path: "/destinations" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll < lastScrollY - 10) {
        // scrolling UP (show navbar)
        setShowNavbar(true);
      } else if (currentScroll > lastScrollY + 10) {
        // scrolling DOWN (hide navbar)
        setShowNavbar(false);
      }

      lastScrollY = currentScroll;
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50 transition-transform duration-500
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      {/* Top Small Navbar */}
      <div className="w-full bg-[#fffdf0] dark:bg-background border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2">
            <div className="hidden lg:flex items-center gap-4 text-sm text-[#705830]">
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

            <div className="lg:hidden flex items-center gap-2 text-xs text-[#705830]">
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
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <FaEye className="text-black text-xl" />
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
              <div className="hidden md:flex items-center">
                <NavLink
                  to="/login"
                  className="px-5 py-1.5 rounded-lg bg-linear-to-r from-primary to-secondary 
                           text-black font-medium shadow-md hover:brightness-110 transition hover:scale-105 text-sm"
                >
                  Login
                </NavLink>
              </div>

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

                <NavLink
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 px-4 text-lg bg-linear-to-r from-primary to-secondary 
                           text-black font-medium shadow-md hover:brightness-110 transition text-center rounded-lg"
                >
                  Login
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
