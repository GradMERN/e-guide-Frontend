import { useTranslation } from "react-i18next";
import { FaRegCheckCircle } from "react-icons/fa";
import { DirectionAwareHoverImage } from "./DirectionAwareHoverImage";
import { motion } from "motion/react";
import SectionWrapperFull from "../common/SectionWrapper";

export default function StorySection() {
  const { t } = useTranslation();

  return (
    <SectionWrapperFull id="our-story" className="relative" py="py-16 sm:py-20 md:py-28 lg:py-28" px="px-4 sm:px-6 md:px-12 lg:px-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-stretch">

          <motion.div className="relative rounded-xl overflow-hidden w-full h-[220px] xs:h-[260px] sm:h-80 md:h-[380px] lg:h-[500px] max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-none mx-auto lg:mx-0" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-50px" }}>
            <DirectionAwareHoverImage className="w-full h-full rounded-xl object-cover" />
          </motion.div>

          <motion.div className="flex flex-col justify-center mt-6 lg:mt-0" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-50px" }}>

          <motion.span className="inline-block text-xs xs:text-sm sm:text-base tracking-[0.2em] sm:tracking-[0.25em] text-text uppercase font-medium mb-2 sm:mb-3" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            {t("about.story.label")}
          </motion.span>

          <motion.h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-light mb-3 sm:mb-4 text-text leading-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
            {t("about.story.title")}<br/><span className="font-semibold text-gradient-title">{t("about.story.titleHighlight")}</span>
          </motion.h2>

          <motion.p className="text-text text-xs xs:text-sm sm:text-base md:text-lg lg:text-lg xl:text-lg max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
            {t("about.story.paragraph1")}<br/> {t("about.story.paragraph2")}
          </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-auto">
              {t("about.story.features", { returnObjects: true }).map((text, i) => (
                <motion.div key={i} className="flex items-start gap-2 xs:gap-3 sm:gap-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }} viewport={{ once: true }}>
                  <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 bg-linear-to-br from-secondary to-tertiary rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                    <FaRegCheckCircle className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 icon-card"/>
                  </div>
                  <span className="text-xs xs:text-sm sm:text-base lg:text-sm text-text font-medium leading-snug">{text}</span>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </SectionWrapperFull>
  );
};
