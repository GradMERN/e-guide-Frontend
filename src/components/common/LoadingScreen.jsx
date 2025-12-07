import React from 'react';
import { motion } from 'motion/react';

export default function LoadingScreen() {
  return (

    <div className="min-h-[500px] w-full  rounded-2xl flex flex-col items-center justify-center p-4 shadow-inner">
        <motion.div 
            animate={{ rotateY: 360 }} 
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }} 
            className="mb-6"
        >
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#C7A15C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 22h20L12 2z" fill="#C7A15C" fillOpacity="0.2" />
                <path d="M12 2L2 22h10" />
                <path d="M12 2l10 20H12" />
                <path d="M12 22V6" strokeOpacity="0.5" />
            </svg>
        </motion.div>
        <p className="text-[#C7A15C] text-xs font-bold tracking-widest uppercase animate-pulse">
            Loading...
        </p>
    </div>
  );
}