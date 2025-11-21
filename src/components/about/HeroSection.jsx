"use client";

import { useEffect, useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";



export default function HeroSection() {
  const [hoverSparkles, setHoverSparkles] = useState(false);

  const scrollToNextSection = () => {
    const next = document.querySelector("#next-section");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  // Typewriter effect
  const phrases = [
    "Authentic Egyptian Experiences",
    "Expert Local Guides",
    "Sustainable & Responsible Tourism",
  ];
  const [currentText, setCurrentText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = 100;
    const pauseBetweenPhrases = 2000;

    let timeout;
    if (charIndex < phrases[phraseIndex].length) {
      timeout = setTimeout(() => {
        setCurrentText((prev) => prev + phrases[phraseIndex][charIndex]);
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else {
      timeout = setTimeout(() => {
        setCurrentText("");
        setCharIndex(0);
        setPhraseIndex((phraseIndex + 1) % phrases.length);
      }, pauseBetweenPhrases);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, phraseIndex]);

  // FIXED PARTICLE POSITIONS
  const particles = useMemo(() => {
    return [...Array(50)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden px-6">
      {/* GOLD PARTICLES — NO ANIMATION, ONLY BLINK ON HOVER */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 bg-[#FFE6A0] rounded-full ${
              hoverSparkles ? "sparkle-blink" : ""
            }`}
            style={{
              left: p.left,
              top: p.top,
            }}
          />
        ))}
      </div>

      {/* HERO TEXT */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mt-40">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-lg 
          bg-gradient-to-r from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F] bg-clip-text text-transparent cursor-pointer 
          transition-all duration-300 hover:scale-105"
          onMouseEnter={() => setHoverSparkles(true)}
          onMouseLeave={() => setHoverSparkles(false)}
        >
          About Us
        </h1>

        <p className="text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow mb-4">
          We share Egypt's heritage with travelers worldwide through authentic
          experiences and expert local guidance.
        </p>

        {/* Typewriter */}
        <p className="text-amber-400 font-semibold text-lg md:text-xl h-8 mb-6">
          {currentText}
          <span className="animate-blink">|</span>
        </p>

        <p className="text-gray-300 md:text-lg leading-relaxed mb-6">
          Explore ancient temples, Nile adventures, desert expeditions, and
          culinary journeys with our expert guides.
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 rounded-full bg-[#C7A15C] hover:bg-[#FFE6A0] font-semibold transition-all duration-300 text-black hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50">
            Explore Tours
          </button>
          <button className="px-6 py-3 rounded-full border border-[#C7A15C] text-[#C7A15C] hover:bg-[#FFE6A0] hover:text-black transition-all duration-300 hover:scale-105">
            Learn More
          </button>
        </div>
      </div>

      {/* SCROLL DOWN */}
      <button
        onClick={scrollToNextSection}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce p-3 rounded-full bg-[#C7A15C]/20 hover:bg-[#E2C784]/30 transition backdrop-blur-sm"
      >
        <ChevronDown
          size={36}
          className="text-white drop-shadow-[0_0_8px_rgba(231,205,141,0.8)]"
        />
      </button>

      <style>{`
        /* Cursor blink */
        .animate-blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%,50%,100% {opacity:1;}
          25%,75% {opacity:0;}
        }  

        /* BLINK ON HOVER ONLY */
        .sparkle-blink {
          animation: sparkleBlink 0.6s ease-in-out infinite;
        }

        @keyframes sparkleBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </section>
  );
}
