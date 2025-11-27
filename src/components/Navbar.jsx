import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
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
    <nav
      className="
  fixed left-1/2 -translate-x-1/2 z-50 
  flex items-center justify-between
  top-2 w-[92%] max-w-6xl
  px-8 py-3 rounded-2xl
  bg-surface/60 dark:bg-surface/40 
  backdrop-blur-xl border border-white/10 shadow-lg
  transition-all duration-500
"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
          <FaEye className="text-black text-2xl" />
        </div>
        <h1 className="text-xl font-semibold text-primary dark:text-primary tracking-wide">
          Mystic Egypt Tours
        </h1>
      </div>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `relative text-[15px] transition font-medium
           ${isActive ? "text-primary" : "text-text hover:text-primary"}
           after:content-[''] after:absolute after:left-0 after:-bottom-1
           after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300
           hover:after:w-full`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <Switch />
        <ThemeToggle />
        <NavLink
          to="/login"
          className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary 
                 text-black font-medium shadow-md hover:brightness-110 transition"
        >
          Login
        </NavLink>
      </div>
    </nav>
  );
}
