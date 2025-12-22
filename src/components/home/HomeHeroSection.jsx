import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ImagesSlider } from "../ui/images-slider.js";
import Particles from "../ui/Particles.jsx";
import { CiCalendarDate } from "react-icons/ci";
import { LuMapPin } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { IoChevronDown } from "react-icons/io5";

import hero1 from "../../assets/images/hero/hero1.avif";
import hero2 from "../../assets/images/hero/hero2.avif";
import hero3 from "../../assets/images/hero/hero3.avif";
import hero4 from "../../assets/images/hero/hero4.avif";
import hero5 from "../../assets/images/hero/hero5.avif";

export default function ImagesSliderDemo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const icons = [LuMapPin, CiCalendarDate, LuUsers];

  const images = [
    { src: hero1, alt: "Photo 1" },
    { src: hero2, alt: "Photo 2" },
    { src: hero3, alt: "Photo 3" },
    { src: hero4, alt: "Photo 4" },
    { src: hero5, alt: "Photo 5" },
  ];

  const handleExplore = () => {
    navigate("/tours");
  };

  const handleWatch = () => {
    const videoSection = document.getElementById("video-section");
    if (videoSection) {
      videoSection.scrollIntoView({  behavior: "smooth" });
    }
  };

  const HeroContent = ({ isMobile = false }) => (
    <div className="z-50 flex flex-col justify-start items-center h-full w-full px-4 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mt-16 w-full max-w-5xl">
        <motion.h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-8 leading-normal bg-tertiary bg-clip-text text-transparent [text-shadow:0_0_60px_rgba(199,161,92,0.5)]">
          {t("homepage.title")}
        </motion.h1>
        <motion.p className={`text-base sm:text-lg md:text-xl lg:text-2xl tracking-wide mx-auto max-w-3xl mb-6 text-primary font-bold`}>
          {t("homepage.subtitle")}
        </motion.p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 justify-center max-w-4xl mb-8">
        {icons.map((Icon, index) => {
            if (isMobile) {
              return (
                <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full border bg-primary border-white/10 shadow-xl">
                  <Icon className="w-4 h-4 text-black" />
                  <span className="text-sm font-bold text-black tracking-wide">
                    {t(`homepage.labels.${index}`)}
                  </span>
                </div>
              );
            }
            return (
              <div key={index} className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                <Icon className="text-[#FFD97F] w-5 h-5" />
                <span className="text-white text-sm font-medium">{t(`homepage.labels.${index}`)}</span>
              </div>
            );
          })}
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="flex justify-center gap-4 mt-12">
        <button onClick={handleExplore} className="btn-primary-hero">{t("homepage.exploreBtn")}</button>
        <button onClick={handleWatch} className={isMobile ? 'btn-secondary-hero' : 'btn-watch-hero'}>{t("homepage.watchBtn")}</button>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut"}} className="relative flex justify-center items-center">
          <IoChevronDown size={32} className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${isMobile ? 'text-primary dark:text-white' : 'text-white'}`}/>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <>
      <section className="block md:hidden relative w-full h-[calc(100vh-4rem)]  flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
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
        <HeroContent className="relative z-50 w-full h-full pointer-events-auto" isMobile={true} />
      </section>

      <div className="hidden md:block">
        <ImagesSlider images={images} className="h-[calc(100vh-5rem)] lg:h-[calc(100vh-5rem)] xl:h-[calc(100vh-6rem)] w-full">
          <HeroContent isMobile={false} />
        </ImagesSlider>
      </div>
    </>
  );
}