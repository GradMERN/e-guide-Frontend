import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import TitlesHome from "../common/TitlesHome";
import { GrGallery } from "react-icons/gr";
import { FaPlayCircle as Play } from "react-icons/fa";
import { TbSquareRoundedChevronRight as ChevronRight } from "react-icons/tb";
import { TbSquareRoundedChevronLeft as ChevronLeft } from "react-icons/tb";


import photo1 from "../../assets/images/views/photo-1.avif";
import photo2 from "../../assets/images/views/photo-2.avif";
import photo3 from "../../assets/images/views/photo-3.avif";
import photo4 from "../../assets/images/views/photo-4.avif";
import photo5 from "../../assets/images/views/photo-5.avif";
import photo6 from "../../assets/images/views/photo-6.avif";
import photo7 from "../../assets/images/views/photo-7.avif";
import photo8 from "../../assets/images/views/photo-8.avif";
import photo9 from "../../assets/images/views/photo-9.avif";
import photo10 from "../../assets/images/views/photo-10.avif";
import photo11 from "../../assets/images/views/photo-11.avif";
import photo12 from "../../assets/images/views/photo-12.avif";
import photo13 from "../../assets/images/views/photo-13.avif";
import photo14 from "../../assets/images/views/photo-14.avif";
import photo15 from "../../assets/images/views/photo-15.avif";
import photo16 from "../../assets/images/views/photo-16.avif";
import photo17 from "../../assets/images/views/photo-17.avif";
import photo18 from "../../assets/images/views/photo-18.avif";
import photo19 from "../../assets/images/views/photo-19.avif";
import photo20 from "../../assets/images/views/photo-20.avif";
import photo21 from "../../assets/images/views/photo-21.avif";
import photo22 from "../../assets/images/views/photo-22.avif";
import photo23 from "../../assets/images/views/photo-23.avif";
import photo24 from "../../assets/images/views/photo-24.avif";
import photo25 from "../../assets/images/views/photo-25.avif";
import photo26 from "../../assets/images/views/photo-26.avif";
import photo27 from "../../assets/images/views/photo-27.avif";
import photo28 from "../../assets/images/views/photo-28.avif";
import photo29 from "../../assets/images/views/photo-29.avif";

export default function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);

const galleryData = [
  { id: 1, type: "image", src: photo1, title: "Photo 1", description: "Description for photo 1" },
  { id: 2, type: "image", src: photo2, title: "Photo 2", description: "Description for photo 2" },
  { id: 3, type: "image", src: photo3, title: "Photo 3", description: "Description for photo 3" },
  { id: 4, type: "image", src: photo4, title: "Photo 4", description: "Description for photo 4" },
  { id: 5, type: "image", src: photo5, title: "Photo 5", description: "Description for photo 5" },
  { id: 6, type: "image", src: photo6, title: "Photo 6", description: "Description for photo 6" },
  { id: 7, type: "image", src: photo7, title: "Photo 7", description: "Description for photo 7" },
  { id: 8, type: "image", src: photo8, title: "Photo 8", description: "Description for photo 8" },
  { id: 9, type: "image", src: photo9, title: "Photo 9", description: "Description for photo 9" },
  { id: 10, type: "image", src: photo10, title: "Photo 10", description: "Description for photo 10" },
  { id: 11, type: "image", src: photo11, title: "Photo 11", description: "Description for photo 11" },
  { id: 12, type: "image", src: photo12, title: "Photo 12", description: "Description for photo 12" },
  { id: 13, type: "image", src: photo13, title: "Photo 13", description: "Description for photo 13" },
  { id: 14, type: "image", src: photo14, title: "Photo 14", description: "Description for photo 14" },
  { id: 15, type: "image", src: photo15, title: "Photo 15", description: "Description for photo 15" },
  { id: 16, type: "image", src: photo16, title: "Photo 16", description: "Description for photo 16" },
  { id: 17, type: "image", src: photo17, title: "Photo 17", description: "Description for photo 17" },
  { id: 18, type: "image", src: photo18, title: "Photo 18", description: "Description for photo 18" },
  { id: 19, type: "image", src: photo19, title: "Photo 19", description: "Description for photo 19" },
  { id: 20, type: "image", src: photo20, title: "Photo 20", description: "Description for photo 20" },
  { id: 21, type: "image", src: photo21, title: "Photo 21", description: "Description for photo 21" },
  { id: 22, type: "image", src: photo22, title: "Photo 22", description: "Description for photo 22" },
  { id: 23, type: "image", src: photo23, title: "Photo 23", description: "Description for photo 23" },
  { id: 24, type: "image", src: photo24, title: "Photo 24", description: "Description for photo 24" },
  { id: 25, type: "image", src: photo25, title: "Photo 25", description: "Description for photo 25" },
  { id: 26, type: "image", src: photo26, title: "Photo 26", description: "Description for photo 26" },
  { id: 27, type: "image", src: photo27, title: "Photo 27", description: "Description for photo 27" },
  { id: 28, type: "image", src: photo28, title: "Photo 28", description: "Description for photo 28" },
  { id: 29, type: "image", src: photo29, title: "Photo 29", description: "Description for photo 29" },
];


  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryData.length) % galleryData.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryData.length);
  };

  const getVisibleImages = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const idx = (currentIndex + i + galleryData.length) % galleryData.length;
      visible.push({ ...galleryData[idx], offset: i });
    }
    return visible;
  };


  return (
    <section className="min-h-screen py-6 sm:py-6 px-4 md:px-8 lg:px-12">
      <TitlesHome
        icon={GrGallery}
        title="Gallery"
        paragraph="Explore a curated collection of stunning moments captured across Egypt — showcasing its rich heritage, vibrant culture, and unforgettable landscapes."
      />

      <div className="relative max-w-7xl mx-auto overflow-hidden mt-12">
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center">

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handlePrev} 
            className="absolute left-0 sm:left-4 md:left-8 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[linear-gradient(to_right,#C7A15C,#FFE6A0,#FFD27F)] border-2 border-[#FFD97F] flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
            <ChevronLeft size={24} className="text-black" />
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}  onClick={handleNext}
            className="absolute right-0 sm:right-4 md:right-8 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[linear-gradient(to_right,#C7A15C,#FFE6A0,#FFD27F)] border-2 border-[#FFD97F] flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
            <ChevronRight size={24} className="text-black" />
          </motion.button>

          <AnimatePresence mode="sync">
            {getVisibleImages().map((item) => {
              const scale = item.offset === 0 ? 1 : 0.7;
              const zIndex = 5 - Math.abs(item.offset);
              const opacity = item.offset === 0 ? 1 : Math.abs(item.offset) === 1 ? 0.6 : 0.4;
              const xOffset = item.offset * 350;

              return (
                <motion.div key={`${item.id}-${item.offset}`} initial={{ opacity: 0, scale: 0.8, x: xOffset }}
                  animate={{x: xOffset,scale: scale,opacity: opacity,}}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{type: "spring",stiffness: 300,damping: 30,}}
                  onClick={() => {
                    if (item.offset !== 0) {
                      item.offset > 0 ? handleNext() : handlePrev();
                    }}}
                  className={`absolute w-[280px] sm:w-[350px] md:w-[450px] h-[350px] sm:h-[450px] md:h-[550px] rounded-3xl shadow-2xl overflow-hidden ${item.offset !== 0 ? "cursor-pointer" : ""}`}style={{ zIndex }}>
                  <div className="w-full h-full relative bg-gray-900">
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover" loading="lazy"/>

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>

                    {item.type === "video" && item.offset === 0 && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                        <Play size={24} className="text-gray-900 ml-1" fill="currentColor"/>
                      </motion.div>
                    )}

                    {item.offset === 0 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-linear-to-t from-black/80 to-transparent">
                        <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-white/90 text-sm sm:text-base">
                          {item.description}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}