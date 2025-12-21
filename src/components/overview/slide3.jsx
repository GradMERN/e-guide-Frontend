import React from 'react';
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const SlideThree = () => {
  const steps = [
    { title: "Professional Guides Create Tours", desc: "Interactive tours with audio and images." },
    { title: "Smart E-Tour Guide App", desc: "No physical guides required." },
    { title: "Tourists Explore Independently", desc: "Personalized exploration preferences." },
    { title: "AI + GPS Powered Guidance", desc: "Real-time, location-based instructions." },
    { title: "Scalable & Global", desc: "Built for Egypt, ready to go global." },
  ];

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center font-serif py-16">

      <div className="relative z-20 w-full max-w-7xl px-6 sm:px-12 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        
        <div className="flex flex-col gap-6 md:gap-8">
          <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
            How Guidero Works?
          </motion.h1>

          <div className="space-y-4 md:space-y-6">
            {steps.map((step, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-start gap-3 md:gap-4 group">
                <div className="mt-1 p-1 bg-primary rounded-sm text-black shrink-0">
                  <ArrowRight size={14} className="md:w-[18px]" strokeWidth={3} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-secondary group-hover:text-primary transition-colors leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-xs md:text-base font-light opacity-70 mt-1 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="hidden md:flex relative flex-col items-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full border-2 border-primary p-2 flex items-center justify-center bg-black/40">
              <img src="src/assets/icons/guide.png" alt="Guide" className="w-10 h-10 lg:w-16 lg:h-16 object-contain" />
            </div>
            <span className="text-primary font-bold uppercase tracking-widest text-[10px] lg:text-sm">Guide</span>
          </div>

          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-primary opacity-50">
            <ArrowRight size={24} className="rotate-90" />
          </motion.div>

          <div className="flex flex-col items-center gap-2 relative">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full border-2 border-primary p-2 flex items-center justify-center bg-black/40 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
              <img src="src/assets/icons/app-logo.png" alt="GUÍDORA" className="w-10 h-10 lg:w-16 lg:h-16 object-contain" />
            </div>
            <span className="text-primary font-bold uppercase tracking-widest text-[10px] lg:text-sm text-center">GUÍDORA</span>
            
            <motion.div  initial={{ x: 20, opacity: 0 }} animate={{ x: 50, opacity: 1 }} className="hidden lg:flex absolute right-[-50px] top-4 bg-black border border-white/20 p-2 rounded-full items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold">
                AI/GPS
              </div>
            </motion.div>
          </div>

          <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-primary opacity-50">
            <ArrowRight size={24} className="rotate-90" />
          </motion.div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full border-2 border-primary p-2 flex items-center justify-center bg-black/40">
              <img src="src/assets/icons/register.jpg" alt="Tourist" className="w-10 h-10 lg:w-16 lg:h-16 object-cover rounded-full" />
            </div>
            <span className="text-primary font-bold uppercase tracking-widest text-[10px] lg:text-sm">Tourist</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SlideThree;