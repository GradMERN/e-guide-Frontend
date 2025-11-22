import { ChevronDown } from "lucide-react";
import Particles from "../ui/Particles.jsx";
import TextType from "../ui/TextType.jsx";

export default function AboutHeroSection() {
  const scrollToNextSection = () => {
    const next = document.querySelector("#next-section");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-white overflow-hidden px-6">
      <div className="absolute inset-0 w-full h-full">
        <Particles
          particleColors={["#C7A15C", "#FFE6A0", "#FFD27F"]}
          particleCount={500}
          particleSpread={14}
          speed={0.05}
          particleBaseSize={150}
          cameraDistance={30}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto mt-16">
        <h1 className=" text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 drop-shadow-lg bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F] bg-clip-text text-transparent transition-all duration-300 ">
          About Us
        </h1>

        <p className="text-lg md:text-xl text-gray-200 leading-relaxed drop-shadow mb-4">
          We share Egypt's heritage with travelers worldwide through authentic
          experiences and expert local guidance.
        </p>

        <div className="text-2xl md:text-3xl font-bold h-10 mb-6">
          <TextType
            text={[
              "Authentic Egyptian Experiences",
              "Expert Local Guides",
              "Sustainable & Responsible Tourism",
            ]}
            typingSpeed={85}
            pauseDuration={1500}
            showCursor={true}
            textColors={["#FFE6A0", "#FFD27F"]}
            cursorCharacter="|"
          />
        </div>

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

      <button onClick={scrollToNextSection} className="absolute left-1/2 -translate-x-1/2 bottom-5 md:bottom-9 lg:bottom-10 animate-bounce p-3 md:p-4 lg:p-5 rounded-full bg-[#C7A15C]/20 hover:bg-[#E2C784]/30 transition backdrop-blur-sm z-10">
        <ChevronDown size={28} className=" text-white drop-shadow-[0_0_8px_rgba(231,205,141,0.8)] md:w-8 md:h-8  lg:w-8 lg:h-8 "/>
      </button>

      <style>{`
        .animate-blink {
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%,50%,100% {opacity:1;}
          25%,75% {opacity:0;}
        }
      `}</style>
    </section>
  );
}
