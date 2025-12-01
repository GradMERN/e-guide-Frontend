import { ChevronDown } from "lucide-react";
import Particles from "../ui/Particles.jsx";
import TextType from "../ui/TextType.jsx";
import { motion } from "motion/react";

export default function AboutHeroSection() {
  const scrollToNextSection = () => {
    const next = document.querySelector("#story-section");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-text overflow-hidden px-6">
      <div className="absolute inset-0 w-full h-full">
        <Particles
          particleColors={[
            "var(--gradient-from)",
            "var(--gradient-via)",
            "var(--gradient-to)",
          ]}
          particleCount={500}
          particleSpread={14}
          speed={0.05}
          particleBaseSize={150}
          cameraDistance={25}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto mt-16">
        <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 drop-shadow-lg bg-linear-to-r from-(--gradient-from) via-(--gradient-via) to-(--gradient-to) bg-clip-text text-transparent">
          About Us
        </motion.h1>

        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-lg md:text-xl text-text-secondary leading-relaxed drop-shadow mb-4">
          We share Egypt's heritage with travelers worldwide through authentic
          experiences and expert local guidance.
        </motion.p>

        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="text-shadow-text-secondary md:text-lg leading-relaxed ">
          Explore ancient temples, Nile adventures, desert expeditions, and
          culinary journeys with our expert guides.
        </motion.p>


        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-2xl md:text-3xl font-bold h-10 mb-12">
          <TextType
            text={[ "Authentic Egyptian Experiences", "Expert Local Guides", "Sustainable & Responsible Tourism",]}
            typingSpeed={65}
            pauseDuration={3000}
            showCursor={true}
            cursorCharacter="|"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex justify-center gap-4 ">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary-hero">
            Explore Tour
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary-hero">
            Learn more
          </motion.button>
        </motion.div>
      </div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut"}}className="relative flex justify-center items-center">
          <ChevronDown size={32} className="text-white md:w-10 md:h-10 lg:w-12 lg:h-12 "/>
        </motion.div>
    </motion.div>
    </section>
  );
}