import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import Particles from "../ui/Particles.jsx";
import TextType from "../ui/TextType.jsx";
import { motion } from "motion/react";

export default function AboutHeroSection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleExploreTours = () => {
    navigate("/tours");
  };

  const handleOurStory = () => {
    const storySection = document.getElementById("our-story");
    if (storySection) {
      storySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-text overflow-hidden px-4 sm:px-6 lg:px-8">
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

      <div className="relative z-10 text-center max-w-4xl mx-auto mt-12 sm:mt-16 px-2">
        <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }} className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-3 md:mb-4 leading-normal sm:leading-[1.15] md:leading-normal bg-tertiary bg-clip-text text-transparent [text-shadow:0_0_60px_rgba(199,161,92,0.5)]">
          {t("about.hero.title")}
        </motion.h1>

        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light tracking-wide mx-auto max-w-3xl px-2">
          {t("about.hero.subtitle")}
        </motion.p>

        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }} className="text-secondary md:text-lg leading-relaxed ">
          {t("about.hero.description")}
        </motion.p>


        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-xl pt-4 sm:text-2xl md:text-3xl font-bold h-10 sm:h-12 mb-10 sm:mb-12">
          <TextType
            key={i18n.language}
            text={t("about.hero.typewriter", { returnObjects: true })}
            typingSpeed={65}
            pauseDuration={3000}
            showCursor={true}
            cursorCharacter="|"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex justify-center gap-4 ">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleExploreTours} className="btn-primary-hero">
            {t("about.hero.exploreTours")}
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOurStory} className="btn-secondary-hero">
            {t("about.hero.ourStory")}
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
};