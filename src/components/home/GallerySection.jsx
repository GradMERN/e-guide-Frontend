import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import TitlesHome from "../common/TitlesHome";
import { GrGallery } from "react-icons/gr";
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
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

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
  setDirection(-1);
  setCurrentIndex((prev) => (prev - 1 + galleryData.length) % galleryData.length);
};

const handleNext = () => {
  setDirection(1);
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
    <div className="pb-10 sm:pb-10 md:pb-28 ">
      <TitlesHome icon={GrGallery} title={t("gallery.title")} paragraph= {t("gallery.paragraph")}/>

      <div className="overflow-hidden">
        <div className="relative h-[250px] sm:h-[500px] md:h-[600px] flex items-center justify-center [--space:180px] sm:[--space:260px] md:[--space:320px] ">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handlePrev} className="absolute left-0 sm:left-4 md:left-8 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl button-gradient dark:button-gradient border-2 border-tertiary flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
            <ChevronLeft size={32} className="text-black" />
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={handleNext} className="absolute right-0 sm:right-4 md:right-8 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl button-gradient dark:button-gradient border-2 border-tertiary flex items-center justify-center shadow-lg hover:shadow-xl transition-all">
            <ChevronRight size={32} className="text-black" />
          </motion.button>

          <AnimatePresence mode="sync">
            {getVisibleImages().map((item) => {
              const isCenter = item.offset === 0;
              const scale = item.offset === 0 ? 1 : 1 - Math.abs(item.offset) * 0.1;
              const opacity = 2
              const zIndex = 11 - Math.abs(item.offset) * 15;
              const xOffset = `calc(var(--space) * ${item.offset})`;

              return (
                      <motion.div key={item.id} initial={{ x: direction > 0 ? "100%" : "-100%", scale: 0.7, opacity: 0 }} animate={{ x: xOffset, scale, opacity }} exit={{ x: direction > 0 ? "-100%" : "100%", scale: 0.7, opacity: 0 }} transition={{ type: "spring", stiffness: 200, damping: 30 }} style={{ zIndex }} className="absolute w-[180px] h-[260px] sm:w-[260px] sm:h-[360px] md:w-[350px] md:h-[500px] lg:w-[400px] lg:h-[600px] rounded-xl overflow-hidden cursor-pointer ">
                      <img src={item.src} alt={item.title} className="w-full h-full object-cover"loading="lazy"/>
                      <div className={`absolute inset-0 ${isCenter ? "bg-linear-to-t from-black/0 to-transparent" : "bg-black/50"}`}/>
                      {isCenter && (
                            <>
                              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                <AnimatePresence mode="sync">
                                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-linear-to-t from-black/80 to-transparent">
                                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                                      {item.title}
                                    </h3>
                                    <p className="text-white/90 text-sm sm:text-base">
                                      {item.description}
                                    </p>
                                  </motion.div>
                                </AnimatePresence>
                            </>
                      )}
                </motion.div>
              );
            })}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}