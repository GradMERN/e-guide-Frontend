"use client";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export default function TourGuideSlider({ tourGuides, autoplay = false }) {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % tourGuides.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + tourGuides.length) % tourGuides.length);
  };

  const isActive = (index) => index === active;

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;


  return (

    <div className="relative mx-auto max-w-6xl px-4 py-20 font-sans antialiased">

      <button onClick={handlePrev}
        className="flex absolute left-0 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-12 sm:w-12 items-center justify-center 
        rounded-full bg-[#e7bf61] hover:bg-[#f5d78b] shadow-lg transition-all cursor-pointer  "
      >
        <IconArrowLeft className="h-6 w-6 sm:h-7 sm:w-7 text-white " />
      </button>

      <button
        onClick={handleNext}
        className="flex absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9 sm:h-12 sm:w-12 items-center justify-center 
        rounded-full bg-[#e7bf61] hover:bg-[#f5d78b] shadow-lg transition-all cursor-pointer"
      >
        <IconArrowRight className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
      </button>


      <div className="grid grid-cols-1 gap-20 md:grid-cols-2 px-20">

        <div className="relative h-96 w-full">
          <AnimatePresence>
            {tourGuides.map((guide, index) => (
              <motion.div
                key={guide.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.6,
                  scale: isActive(index) ? 1 : 0.9,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index) ? 40 : tourGuides.length - index,
                  y: isActive(index) ? [0, -60, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                className="absolute inset-0 origin-bottom"
              >
                <div className="relative h-full w-full group">
                  <img
                    src={guide.src}
                    alt={guide.name}
                    className="h-full w-full rounded-3xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 cursor-pointer shadow-xl"
                  />
                </div>

                {isActive(index) && (
                  <div className="absolute bottom-4 left-4 ">
                    <p className="text-xs sm:text-sm text-[#d4af37] ">
                      {tourGuides[active].designation}
                    </p>
                    <h3 className="text-md  sm:text-3xl font-bold text-white drop-shadow-xl">
                      {tourGuides[active].name}
                    </h3>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>




        <div className="flex flex-col justify-center">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl p-8  shadow-[0_0_30px_rgba(255,217,126,0.35)]"
          >
            <h3 className="text-md sm:text-3xl font-bold text-[#ffd97e]">
              {tourGuides[active].name}
            </h3>

            <p className="text-xs sm:text-sm text-gray-300 tracking-wide mt-1">
              {tourGuides[active].designation}
            </p>

            {/* Animated Quote */}
            <motion.p className="mt-6 text-sm sm:text-lg text-gray-200 leading-relaxed">
              {tourGuides[active].quote.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.15,
                    delay: i * 0.02,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>


          </motion.div>
        </div>



      </div>


    </div>
  );
}
