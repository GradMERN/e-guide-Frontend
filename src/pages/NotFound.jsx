import { useState } from "react";
import NotFoundText from "../components/notFound/NotFoundText";
import NotFoundBackground from "../components/notFound/NotFoundBackground";

export default function NotFound() {
  const [hoverActive, setHoverActive] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-linear-to-br from-[#1a1a1a] via-[#2c1b0f] to-[#3e1e0c]"></div>
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 sm:w-2 sm:h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: hoverActive ? "#FFD27F" : "#f2b84c",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-center min-h-screen  px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20  gap-8 lg:gap-12 xl:gap-12 py-10 lg:py-8 max-w-full mx-auto">
        <NotFoundText onHoverChange={setHoverActive} />
        <NotFoundBackground />
      </div>
    </div>
  );
}
