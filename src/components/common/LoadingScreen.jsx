import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function LoadingScreen({ fullPage = false }) {
  const { t } = useTranslation();
  
  return (
    <div className={`
      flex flex-col items-center justify-center antialiased transition-colors duration-500
      ${fullPage 
        ? "fixed inset-0 w-screen h-screen z-[9999] bg-background" 
        : "relative min-h-[400px] w-full bg-transparent"}
    `}>
      {/* Added 'w-full' and 'items-center' here to ensure the 
         content block itself is centered on the X-axis 
      */}
      <div className="w-full flex flex-col items-center justify-center gap-8">
        
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Background Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.4, 0.1] 
            }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full blur-3xl bg-secondary"
          />

          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="relative z-10">
            <motion.path
              d="M12 4L2 20h20L12 4z"
              stroke="var(--primary)"
              strokeWidth="1.5" 
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "circOut" }}
            />
            <motion.path
              d="M12 4V20M2 20l10-8 10 8"
              stroke="var(--primary)"
              strokeWidth="0.5"
              strokeOpacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
            />
          </svg>
        </div>

        <div className="text-center w-full flex flex-col items-center gap-4">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            className="text-text text-[11px] font-bold tracking-[0.5em] uppercase leading-none"
          >
            {t("loading")}
          </motion.p>
          
          <div className="w-32 h-px bg-border relative overflow-hidden rounded-full">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-linear-to-r from-transparent via-primary to-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
