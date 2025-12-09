import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ImagesSlider } from "../ui/images-slider.js";
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

return (
    <ImagesSlider images={images} className="h-screen md:h-[75vh] lg:h-[90vh] xl:h-screen w-full">
      <div className="z-50 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-6 md:mb-10">
          <motion.h1 className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-3 md:mb-4 leading-normal sm:leading-[1.15] md:leading-normal bg-tertiary bg-clip-text text-transparent [text-shadow:0_0_60px_rgba(199,161,92,0.5)]">
            {t("homepage.title")}
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light tracking-wide">
            {t("homepage.subtitle")}
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 justify-center max-w-4xl mb-8">
          {icons.map((Icon, index) => {
            return (
              <div key={index} className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                <Icon className="text-[#FFD97F] w-5 h-5" />
                <span className="text-white text-sm">{t(`homepage.labels.${index}`)}</span>
              </div>
            );
        })}
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="flex flex-row sm:flex-row gap-3 md:gap-4">
          <button onClick={handleExplore} className="btn-primary-hero">{t("homepage.exploreBtn")}</button>
          <button className="btn-watch-hero">{t("homepage.watchBtn")}</button>
        </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut"}}className="relative flex justify-center items-center">
          <IoChevronDown size={32} className="text-white md:w-10 md:h-10 lg:w-12 lg:h-12 "/>
        </motion.div>
    </motion.div>
      </div>
    </ImagesSlider>
  );
};