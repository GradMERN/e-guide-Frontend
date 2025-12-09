import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaPlay, FaTimes } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";
import video from "../../assets/video/Let'sGoEgypt.mp4"
import photo from "../../assets/images/hero/hero6.avif"

export default function VideoSection() {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  const videoEmbedUrl = video;
  const cover = photo;

  const handlePlay = () => setIsPlaying(true);
  const handleClose = () => setIsPlaying(false);

  return (
    <SectionWrapperFull>
      <div className="py-12" id="video-section">
        <TitlesHome title={t("video.title")}  paragraph={t("video.description")} />
        <div className="relative max-w-6xl mx-auto mt-16 px-4">

          <div className="absolute -top-6 -left-6 w-20 h-20 sm:w-28 sm:h-28 z-20 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M0,20 Q0,0 20,0 L50,0 M0,20 L0,50" stroke="url(#goldGradient)" strokeWidth="3" fill="none" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="4" fill="url(#goldGradient)" />
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="50%" stopColor="var(--secondary)" />
                    <stop offset="100%" stopColor="var(--tertiary)" />
                  </linearGradient>
                </defs>
            </svg>
          </div>

          <div className="absolute -top-6 -right-6 w-20 h-20 sm:w-28 sm:h-28 z-20 rotate-90 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M0,20 Q0,0 20,0 L50,0 M0,20 L0,50" stroke="url(#goldGradient2)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="4" fill="url(#goldGradient2)" />
              <defs>
                <linearGradient id="goldGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="50%" stopColor="var(--secondary)" />
                  <stop offset="100%" stopColor="var(--tertiary)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute -bottom-6 -left-6 w-20 h-20 sm:w-28 sm:h-28 z-20 -rotate-90 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M0,20 Q0,0 20,0 L50,0 M0,20 L0,50" stroke="url(#goldGradient3)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="4" fill="url(#goldGradient3)" />
              <defs>
                <linearGradient id="goldGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="50%" stopColor="var(--secondary)" />
                  <stop offset="100%" stopColor="var(--tertiary)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="absolute -bottom-6 -right-6 w-20 h-20 sm:w-28 sm:h-28 z-20 rotate-180 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M0,20 Q0,0 20,0 L50,0 M0,20 L0,50" stroke="url(#goldGradient4)" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="4" fill="url(#goldGradient4)" />
              <defs>
                <linearGradient id="goldGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="50%" stopColor="var(--secondary)" />
                  <stop offset="100%" stopColor="var(--tertiary)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <motion.div className="relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}viewport={{ once: true }}>

          <div className="absolute -inset-2 rounded-xl p-[3px] bg-[linear-gradient(to_right,var(--primary),var(--secondary),var(--tertiary))]">
            <div className="absolute inset-0 rounded-xl bg-[linear-gradient(to_bottom_right, color-mix(in_srgb,var(--primary)_20%,transparent), transparent, color-mix(in_srgb,var(--tertiary)_20%,transparent))]"/>
          </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl z-10">
              <AnimatePresence mode="wait">
                {isPlaying ? (<motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="w-full h-full">
                    <video className="w-full h-full object-cover" src={videoEmbedUrl} controls autoPlay/>
                    <motion.button onClick={handleClose} whileHover={{ scale: 1.2, rotate: 90 }} whileTap={{ scale: 0.9 }} className="absolute top-4 right-4 p-3 rounded-full shadow-xl z-20 text-black bg-[linear-gradient(to_right,var(--primary),var(--tertiary))]">
                      <FaTimes className="w-5 h-5 " />
                    </motion.button>
                  </motion.div>
                ) : (

                  <motion.div key="cover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handlePlay} className="relative w-full h-full bg-cover bg-center cursor-pointer group" style={{ backgroundImage: `url(${cover})` }}>
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-300" />
                    <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}  className="absolute inset-0 m-auto w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center rounded-full shadow-2xl z-20 bg-[linear-gradient(135deg,var(--primary),var(--secondary),var(--tertiary))] [box-shadow:0_0_40px_color-mix(in_srgb,var(--secondary)_60%,transparent),0_0_60px_color-mix(in_srgb,var(--primary)_40%,transparent)]">
                      <FaPlay className="w-8 h-8 ml-1 text-black/90" />
                    </motion.button>

                    <motion.div className="absolute inset-0 m-auto pointer-events-none" style={{ width: "160px", height: "160px", borderRadius: "9999px", border: "3px solid color-mix(in srgb, var(--primary) 60%, transparent)",}} animate={{ scale: [1, 1.6], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}/>

                    <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg text-(--text-loop) bg-[linear-gradient(to_right,color-mix(in_srgb,var(--primary)_90%,transparent),color-mix(in_srgb,var(--secondary)_90%,transparent))]">{t('video.duration')}
                    </div>

                    <motion.div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent" animate={{ x: ["-100%", "200%"] }} transition={{duration: 3, repeat: Infinity, repeatDelay: 2, ease: "easeInOut",}}/>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapperFull>
  );
}