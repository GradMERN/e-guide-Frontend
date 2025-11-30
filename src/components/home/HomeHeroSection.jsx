import { motion } from "motion/react";
import { ImagesSlider } from "../ui/images-slider.js";
import { MapPin, Calendar, Users, ChevronDown } from "lucide-react";

import hero1 from "../../assets/images/hero/hero1.avif";
import hero2 from "../../assets/images/hero/hero2.avif";
import hero3 from "../../assets/images/hero/hero3.avif";
import hero4 from "../../assets/images/hero/hero4.avif";
import hero5 from "../../assets/images/hero/hero5.avif";


export default function ImagesSliderDemo() {

  const images = [
    { src: hero1, alt: "Photo 1" },
    { src: hero2, alt: "Photo 2" },
    { src: hero3, alt: "Photo 3" },
    { src: hero4, alt: "Photo 4" },
    { src: hero5, alt: "Photo 5" },
  ];

  const icons = [
    { icon: MapPin, label: "50+ Destinations" },
    { icon: Calendar, label: "Flexible Booking" },
    { icon: Users, label: "Expert Guides" },
  ];

return (
    <ImagesSlider images={images} className="h-screen md:h-[75vh] lg:h-[90vh] xl:h-screen w-full">
      <div className="z-50 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
        <motion.div initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-6 md:mb-10">
          <motion.h1
            className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-3 md:mb-4 leading-normal sm:leading-[1.15] md:leading-normal bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F] bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(199,161,92,0.5)]">
            Discover Egypt
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light tracking-wide">
            Where history comes alive and adventures begin
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-wrap gap-2 sm:gap-4 justify-center mb-6 md:mb-12 max-w-4xl">
          {icons.map((item, i) => (
            <div key={i}
              className="flex items-center gap-1.5 px-3 py-1 md:px-4 md:py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full">
              <item.icon className="w-4 h-4 md:w-5 md:h-5 text-[#FFD97F]" />
              <span className="text-white text-xs md:text-sm">{item.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="flex flex-col sm:flex-row gap-3 md:gap-6">
          <button className="group px-6 py-3 sm:px-8 sm:py-4 backdrop-blur-sm border-2 text-white text-center rounded-full relative overflow-hidden transition-all duration-300 hover:scale-105 bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#D4A574] border-[#FFD97F]">
            <span className="relative z-10 font-semibold text-base md:text-lg text-black">
              Explore Tours
            </span>
            <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>

          <button className="px-6 py-3 sm:px-8 sm:py-4 backdrop-blur-md bg-white/10 border-2 border-white/30 text-white text-center rounded-full relative transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <span className="font-semibold text-base md:text-lg">Watch Video</span>
            <div className="absolute inset-x-0 h-px -bottom-px w-3/4 mx-auto bg-linear-to-r from-transparent via-[#FFD97F] to-transparent" />
          </button>
        </motion.div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }} className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20">
        <motion.div animate={{ y: [0, 10, 0] }} transition={{duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut"}}className="relative flex justify-center items-center">
          <ChevronDown size={32} className="text-white md:w-10 md:h-10 lg:w-12 lg:h-12 "/>
        </motion.div>
    </motion.div>
      </div>
    </ImagesSlider>
  );
};