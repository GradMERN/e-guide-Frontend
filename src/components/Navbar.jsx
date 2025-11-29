import { NavLink } from "react-router-dom";
import { FaEye, FaPhone, FaEnvelope, FaClock } from "react-icons/fa";
import { useEffect, useState } from "react";
import ThemeToggle from "../components/ThemeToggle";
import Switch from "./ui/SwitchLanguages";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Tours", path: "/tours" },
    { name: "Destinations", path: "/destinations" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 z-50">
      <div className="w-full bg-background dark:bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-2">
            {/* Contact Info */}
            <div className="flex items-center gap-4 text-sm text-text-muted">
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

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Switch />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar*/}
      <nav className="w-full bg-surface dark:bg-surface shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <FaEye className="text-black text-xl" />
              </div>
              <h1 className="text-xl font-bold text-primary dark:text-primary tracking-wide">
                Mystic Egypt Tours
              </h1>
            </div>

            {/* Navigation Links */}
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

            {/* Login Button */}
            <div className="flex items-center">
              <NavLink
                to="/login"
                className="px-5 py-1.5 rounded-lg bg-linear-to-r from-primary to-secondary 
                         text-black font-medium shadow-md hover:brightness-110 transition hover:scale-105 text-sm"
              >
                Login
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
