import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function NotFoundText({ onHoverChange }) {
  const navigate = useNavigate();
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
    <div
      className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-2xl px-4 lg:px-0 order-2 lg:order-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-12 relative z-10">
        <h1
          className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[12rem] font-black text-transparent bg-clip-text bg-linear-to-br from-[#FFD27F] via-[#E2C784] to-[#C7A15C] leading-none tracking-tighter transition-transform duration-500 origin-center lg:origin-left ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          style={{ filter: "drop-shadow(0 0 40px rgba(255,210,127,0.7))" }}
        >
          404
        </h1>
        <div className="h-1 w-20 sm:w-24 md:w-32 lg:w-48 bg-linear-to-r from-transparent via-[#FFD27F] to-transparent mt-2 sm:mt-3 md:mt-4 mx-auto lg:mx-0"></div>
      </div>

      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 sm:mb-4 drop-shadow-2xl z-10">
        Lost in the Desert?
      </h2>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed drop-shadow-lg max-w-xl z-10">
        The page you're searching for has vanished like ancient treasures
        beneath the shifting sands of time.
        <br className="hidden sm:block" />
        <span className="text-[#FFD27F] font-semibold">
          Let's guide you back to civilization.
        </span>
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto z-10">
        <button
          onClick={() => navigate(-1)}
          className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 bg-linear-to-r from-[#C7A15C] to-[#C7A15C] hover:from-[#B8924F] hover:to-[#DCC07C] text-black font-bold rounded-full shadow-2xl hover:shadow-[#C7A15C]/50 transform hover:scale-105 transition-all duration-300"
        >
          Go Back
        </button>
        <button
          onClick={() => navigate("/")}
          className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 bg-linear-to-r from-[#C7A15C] to-[#C7A15C] hover:from-[#B8924F] hover:to-[#DCC07C] text-black font-bold rounded-full shadow-2xl hover:shadow-[#FFD27F]/50 transform hover:scale-105 transition-all duration-300"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
