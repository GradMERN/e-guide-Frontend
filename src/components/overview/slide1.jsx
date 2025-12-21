import { motion } from "motion/react";

const SlideOne = () => {
  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center font-serif">
      <motion.img initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 0.25 }} transition={{ duration: 2, ease: "easeOut" }} src="src/assets/images/loginBg.webp" alt="Background" className="absolute inset-0 z-0 h-full w-full object-cover"/>

      <div className="absolute inset-0 z-10 bg-linear-to-b from-black/80 via-black/40 to-transparent md:bg-linear-to-r md:from-black/95 md:via-black/40 md:to-transparent" />

      <div className="relative z-20 w-full max-w-7xl px-6 sm:px-12 md:px-24 flex flex-col items-start">
        
        <motion.h1 initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 1, ease: "easeOut" }} className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-primary drop-shadow-2xl" style={{ textShadow: '0px 0px 20px rgba(176, 100, 25, 0.3)' }}>
          GUÍDORA
        </motion.h1>

        <motion.h2 initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 1 }} className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-secondary mt-2 md:mt-4 mb-6 md:mb-8">
          Smart E-Tour Guide Platform
        </motion.h2>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }} className="space-y-1 md:space-y-2 border-l-2 border-primary/50 pl-4 md:pl-6">
          <p className="text-base sm:text-xl md:text-2xl text-text-secondary font-light tracking-wide">
            A smart digital guide for exploring cultural sites
          </p>
          <p className="text-base sm:text-xl md:text-2xl text-text-secondary font-light tracking-wide italic opacity-80">
            Built for Egypt, scalable worldwide.
          </p>
        </motion.div>
      </div>

      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.5, duration: 1.5 }} className="absolute bottom-6 md:bottom-10 left-0 h-px bg-linear-to-r from-transparent via-primary to-transparent opacity-30"/>
    </div>
  );
};

export default SlideOne;