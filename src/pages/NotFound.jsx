import { useState } from "react";
import NotFoundText from "../components/notFound/NotFoundText";
import NotFoundBackground from "../components/notFound/NotFoundBackground";
import ThemeToggle from "../components/common/ThemeToggle";
import Switch from "../components/common/LanguageSwitch";

export default function NotFound() {
  const [hoverActive, setHoverActive] = useState(false);

  return (
    <div dir="ltr" className="relative min-h-screen w-full overflow-hidden bg-(--background)">
      <div className="absolute inset-0 w-full h-full bg-linear-to-br from-(--surface) via-(--background) to-(--surface) opacity-50" />
      
      <div className="absolute inset-0 bg-(--background)/30" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full animate-pulse" style={{ backgroundColor: hoverActive  ? "var(--secondary)" : "var(--primary)", opacity: 0.6, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, }}/>))}
      </div>

      <div className="fixed top-8 sm:top-8 right-8 sm:right-42 z-50 flex items-center gap-3 sm:gap-4">
        <div>
          <ThemeToggle />
        </div>
        <div>
          <Switch />
        </div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-center min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 gap-6 sm:gap-8 lg:gap-12 py-8 sm:py-10 lg:py-12 max-w-7xl mx-auto">
        <NotFoundText onHoverChange={setHoverActive} />
        <NotFoundBackground isHovered={hoverActive} />
      </div>
    </div>
  );
};