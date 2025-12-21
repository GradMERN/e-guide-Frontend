import { motion } from "motion/react";

const SlideTwo = () => {
  const points = [
    { title: "No Physical Guides", desc: "Explore freely at your own pace." },
    { title: "No Fixed Schedules", desc: "Tours fit your time." },
    { title: "GPS + AI Powered", desc: "Location-based smart guidance." },
  ];

  return (
    <div className="relative h-screen w-full bg-background overflow-hidden flex items-center justify-center font-serif py-12">
      
      <div className="absolute inset-0 z-10 bg-linear-to-b from-background/60 via-background/80 to-background" />

      <div className="relative z-20 w-full max-w-7xl px-6 sm:px-12 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-[0.8fr_1.7fr] gap-8 md:gap-12 lg:gap-20 items-center overflow-y-auto md:overflow-visible h-full md:h-auto mt-12 md:mt-0">
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }} className="flex justify-center md:block order-2 md:order-1">
          <img src="src/assets/images/register.jpg" alt="App Interface" className="w-40 sm:w-64 md:w-full max-w-sm h-auto drop-shadow-[0_0_30px_rgba(176,100,25,0.2)] rounded-2xl md:rounded-none"/>
        </motion.div>

        <div className="flex flex-col items-start order-1 md:order-2">
          <motion.h1 initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-3 md:mb-6">
            Project Overview
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-text-secondary text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-10 max-w-xl">
            GUÍDORA is a smart e-tour guide platform that lets users explore 
            destinations independently while professional guides create interactive, 
            paid tours. It combines GPS, AI, and expert knowledge.
          </motion.p>

          <div className="w-full space-y-3 md:space-y-4">
            {points.map((point, index) => (
              <motion.div key={index} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + index * 0.15, duration: 0.6 }} className="bg-surface/30 border border-border/20 backdrop-blur-md p-3 sm:p-4 md:p-6 rounded-lg group hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(176,100,25,0.5)] shrink-0" />
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-secondary group-hover:text-primary transition-colors leading-tight">
                    {point.title}
                  </h3>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm md:text-base mt-1.5 ml-4.5 md:ml-6 font-light italic opacity-80">
                  {point.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideTwo;