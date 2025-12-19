// NotFoundText.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFoundText({ onHoverChange }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl px-4 sm:px-6 lg:px-0 order-2 lg:order-1">
      <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-12 relative z-10">
        <h1 className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black text-transparent bg-clip-text bg-linear-to-br from-(--primary) via-(--secondary) to-(--tertiary) leading-none tracking-tighter transition-transform duration-500 origin-center lg:origin-left cursor-pointer ${ isHovered ? "scale-110" : "scale-100"}`}  style={{ filter: "drop-shadow(0 0 40px rgba(207, 170, 101, 0.7))" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          404
        </h1>
        <div className="h-0.5 sm:h-1 w-16 sm:w-20 md:w-32 lg:w-48 bg-linear-to-r from-transparent via-(--primary) to-transparent mt-2 sm:mt-3 md:mt-4 mx-auto lg:mx-0" />
      </div>

      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-(--text) mb-2 sm:mb-3 md:mb-4 drop-shadow-lg z-10">
        {t("notFound.title", "Lost in the Desert?")}
      </h2>

      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-(--text-secondary) mb-4 sm:mb-6 md:mb-8 leading-relaxed drop-shadow-md max-w-xl z-10">
        {t("notFound.description", "The page you're searching for has vanished like ancient treasures beneath the shifting sands of time.")}
        <br className="hidden sm:block" />
        <span className="text-(--primary) font-semibold">
          {t("notFound.guide", "Let's guide you back to civilization.")}
        </span>
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto z-10">
        <button onClick={() => navigate(-1)} className="btn-notfound-primary w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base">
          {t("notFound.goBack", "Go Back")}
        </button>
        <button onClick={() => navigate("/")} className="btn-notfound-secondary w-full sm:w-auto px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base">
          {t("notFound.goHome", "Go Home")}
        </button>
      </div>
    </div>
  );
}