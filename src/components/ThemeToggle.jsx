import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="
        w-12 h-6 flex items-center rounded-full px-1 transition-all duration-300 
        bg-[#C7A15C] dark:bg-[#E2C784] relative
      "
    >
      <div
        className="
          w-5 h-5 rounded-full bg-black dark:bg-white 
          flex items-center justify-center 
          transform transition-all duration-300
          absolute
          left-1
          dark:left-6
        "
      >
        {theme === "light" ? (
          <FaSun className="text-white text-[10px]" />
        ) : (
          <FaMoon className="text-black text-[10px]" />
        )}
      </div>
    </button>
  );
}
