import { useEffect, useState } from "react";
import SwitchUI from "./ui/SwitchTheme";

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

    const handleToggle = () => {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const isChecked = theme === "dark";
  return (
    <SwitchUI isChecked={isChecked} handleToggle={handleToggle} theme={theme} />
  );
}
