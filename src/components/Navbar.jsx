import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";

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

  const baseStyles =
    "fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between";

  const topStyles = "top-0 bg-transparent px-6 py-4 w-full scale-95";

  const scrolledStyles =
    "top-4 bg-[#1B1A17]/85 backdrop-blur-md shadow-xl px-10 py-2.5 rounded-full max-w-5xl w-[90%] transition-all duration-500";

  return (
    <nav className={`${baseStyles} ${scrolled ? scrolledStyles : topStyles}`}>
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-linear-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center shadow-md">
          <FaEye className="text-black text-2xl" />
        </div>
        <h1 className="text-xl font-semibold text-[#D5B36A] tracking-wide whitespace-nowrap">
          Mystic Egypt Tours
        </h1>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `relative text-[15px] tracking-wide transition
               ${
                 isActive ? "text-[#D5B36A]" : "text-white hover:text-[#D5B36A]"
               }
               after:content-[''] after:block after:w-0 after:h-0.5 
               after:bg-[#D5B36A] after:transition-all after:duration-300 
               hover:after:w-full`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      <NavLink
        to="/login"
        className="px-6 py-2 rounded-full shadow-md text-black font-medium 
                   bg-linear-to-r from-[#C7A15C] to-[#E2C784] 
                   hover:from-[#B8924F] hover:to-[#DCC07C] transition-all"
      >
        Login
      </NavLink>
    </nav>
  );
}
