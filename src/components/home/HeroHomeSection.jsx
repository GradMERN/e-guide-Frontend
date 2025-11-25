import { motion } from "motion/react";
import { ImagesSlider } from "../ui/images-slider.jsx";

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
    <ImagesSlider images={images}>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-50 flex flex-col justify-center items-center">
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-linear-to-r from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F] py-4">
          The hero section slideshow <br /> <span className="text-white">nobody asked for</span>
        </motion.p>
        <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
          <span>Join now →</span>
          <div className="absolute inset-x-0  h-px -bottom-px bg-linear-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
        </button>
      </motion.div>
    </ImagesSlider>
  );
}
