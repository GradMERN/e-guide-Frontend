import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoChevronDown } from "react-icons/io5";
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
    <section className="relative w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)] xl:h-[calc(100vh-6rem)] flex flex-col items-center justify-center text-text overflow-hidden px-4 sm:px-6 lg:px-8">
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

      <div className="z-50 flex flex-col justify-start items-center h-full w-full px-4 py-8 sm:py-12">

        <motion.div initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mt-16 w-full max-w-5xl">
          <motion.h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 leading-normal bg-tertiary bg-clip-text text-transparent [text-shadow:0_0_60px_rgba(199,161,92,0.5)]">
            {t("about.hero.title")}
          </motion.h1>
          <motion.p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light tracking-wide mx-auto max-w-3xl mb-6 lg:text-2 px-2">
            {t("about.hero.subtitle")}
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-xl pt-4 sm:text-2xl md:text-3xl font-bold h-10 sm:h-12 mb-4 sm:mb-8">
          <TextType key={i18n.language} text={t("about.hero.typewriter", { returnObjects: true })} typingSpeed={65} pauseDuration={3000} showCursor={true} cursorCharacter="|"/>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex justify-center gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleExploreTours} className="btn-primary-hero">
            {t("about.hero.exploreTours")}
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleOurStory} className="btn-secondary-hero">
            {t("about.hero.ourStory")}
          </motion.button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut"}}className="relative flex justify-center items-center">
            <IoChevronDown size={32} className="text-white w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"/>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};