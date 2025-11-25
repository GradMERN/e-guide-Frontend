import { motion } from "motion/react";
import { ImagesSlider } from "../ui/images-slider.jsx";
import { MapPin, Calendar, Users } from "lucide-react";

import photo1 from "../../assets/images/photo-1.avif";
import photo2 from "../../assets/images/photo-2.avif";
import photo3 from "../../assets/images/photo-3.avif";
import photo4 from "../../assets/images/photo-4.avif";
import photo5 from "../../assets/images/photo-5.avif";

export default function ImagesSliderDemo() {

  const images = [
    { src: photo1, alt: "Photo 1" },
    { src: photo2, alt: "Photo 2" },
    { src: photo3, alt: "Photo 3" },
    { src: photo4, alt: "Photo 4" },
    { src: photo5, alt: "Photo 5" },
  ];

  return (
    <ImagesSlider images={images} className="h-screen">
      <div className="z-50 flex flex-col justify-center items-center px-4">

        <motion.div initial={{ opacity: 0, y: -80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-8">
          <motion.h1
            className="
              font-bold text-5xl md:text-7xl lg:text-8xl mb-4
              bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F]
              bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(199,161,92,0.5)]">
            Discover Egypt
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-xl md:text-3xl text-white/90 font-light tracking-wide">
            Where history comes alive and adventures begin
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="flex flex-wrap gap-4 justify-center mb-8 max-w-3xl">
          <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full">
            <MapPin className="w-5 h-5 text-[#FFD97F]" />
            <span className="text-white text-sm md:text-base">50+ Destinations</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full">
            <Calendar className="w-5 h-5 text-[#FFD97F]" />
            <span className="text-white text-sm md:text-base">Flexible Booking</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-full">
            <Users className="w-5 h-5 text-[#FFD97F]" />
            <span className="text-white text-sm md:text-base">Expert Guides</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5 }} className="flex flex-col sm:flex-row gap-4">
          <button
            className="
              group px-8 py-4 backdrop-blur-sm border-2 text-white 
              text-center rounded-full relative overflow-hidden
              transition-all duration-300 hover:scale-105
              bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#D4A574] border-[#FFD97F]">
            <span className="relative z-10 font-semibold text-black text-lg">
              Explore Tours
            </span>
            <div className=" absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>

          <button
            className="
              px-8 py-4 backdrop-blur-md bg-white/10 border-2 
              border-white/30 text-white text-center rounded-full 
              relative transition-all duration-300 hover:bg-white/20 hover:scale-105">
            <span className="font-semibold text-lg">Watch Video</span>
            <div className="absolute inset-x-0 h-px -bottom-px w-3/4 mx-auto bg-linear-to-r from-transparent via-[#FFD97F] to-transparent"/>
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-2" >
            <span className="text-white/70 text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full p-1">
              <div className="w-1.5 h-3 bg-white/70 rounded-full mx-auto"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </ImagesSlider>
  );
}
