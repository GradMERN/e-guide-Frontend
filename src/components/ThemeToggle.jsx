import "@theme-toggles/react/css/Within.css";
import { Within } from "@theme-toggles/react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "dark";
    setTheme(storedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Within
      duration={750}
      toggled={theme === "dark"}
      toggle={toggleTheme}
      className="text-3xl text-text hover:text-primary hover:scale-110 transition-all duration-300"
    />
  );
}
