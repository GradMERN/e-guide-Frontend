import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { PixelatedCanvasDemo } from "../components/PixelatedCanvasDemo.jsx";

export default function NotFound() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-linear-to-br from-[#1a1a1a] via-[#2c1b0f] to-[#3e1e0c]"></div>
      
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="absolute inset-1 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[#f2b84c] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center min-h-screen px-4 sm:px-6 lg:px-12 gap-8 lg:gap-0">
        
        <div className="flex-1 flex flex-col items-start text-left max-w-lg">
          <div className="mb-6 sm:mb-8 md:mb-12" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <h1 className={`text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[16rem] font-black text-transparent bg-clip-text bg-linear-to-br from-[#FFD27F] via-[#E2C784] to-[#C7A15C] leading-none tracking-tighter transition-all duration-500 drop-shadow-[0_0_40px_rgba(255,210,127,0.7)] ${isHovered ? 'scale-110' : 'scale-100'}`}>
              404
            </h1>
            <div className="h-1 w-24 sm:w-32 md:w-48 lg:w-64 bg-linear-to-r from-transparent via-[#FFD27F] to-transparent mt-3 sm:mt-4 md:mt-6"></div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-2xl">
            Lost in the Desert?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200 mb-6 sm:mb-8 md:mb-10 leading-relaxed drop-shadow-lg">
            The page you're searching for has vanished like ancient treasures beneath the shifting sands of time.
            <br className="hidden sm:block" />
            <span className="text-[#FFD27F] font-semibold">Let's guide you back to civilization.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
            <button
              onClick={() => navigate(-1)}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 bg-linear-to-r from-[#B97A57] to-[#C7A15C] text-white font-bold rounded-full shadow-2xl hover:shadow-[#C7A15C]/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 bg-linear-to-r from-[#C7A15C] to-[#FFD27F] text-white font-bold rounded-full shadow-2xl hover:shadow-[#FFD27F]/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              Go Home
            </button>
          </div>
        </div>

        <div className="flex-1 w-full lg:w-auto lg:h-[80vh] relative">
          <div className="absolute inset-0">
            <PixelatedCanvasDemo />
          </div>
          <div className="absolute inset-0 bg-linear-to-tr from-[#FFD27F]/20 via-[#E2C784]/10 to-[#C7A15C]/5 rounded-xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}