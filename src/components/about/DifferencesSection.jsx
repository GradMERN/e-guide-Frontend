import { motion } from "motion/react";
import {FaTimesCircle,FaCheckCircle,FaRegFrown,FaRegSmile,FaCamera,FaSun,FaUsers,FaUserFriends,FaDollarSign,FaGem,} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import SectionWrapperFull from "../common/SectionWrapper";

export default function BeforeAfterSection() {

  const { t } = useTranslation();
  const iconMap = [
    { before: FaRegFrown, after: FaRegSmile }, 
    { before: FaCamera, after: FaSun }, 
    { before: FaUsers, after: FaUserFriends },
    { before: FaDollarSign, after: FaGem }, 
  ];

  const comparisons = t("about.beforeAfter.comparisons", { returnObjects: true });

  return (
    <SectionWrapperFull py="py-6 lg:py-12" px="px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-10 sm:mb-14 lg:mb-16 relative z-10 px-4 sm:px-0" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-80px" }}>
          <motion.span className="inline-block text-sm xs:text-base sm:text-lg tracking-[0.25em] sm:tracking-[0.3em] text-text uppercase font-medium mb-3 sm:mb-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} viewport={{ once: true }}>
            {t("about.beforeAfter.subtitle")}
          </motion.span>

          <motion.h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl font-light mb-3 sm:mb-4 text-text leading-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
            {t("about.beforeAfter.title.normal")} <span className="font-semibold bg-linear-to-r text-gradient-title bg-clip-text text-transparent">{t("about.beforeAfter.title.highlight")}</span>
          </motion.h2>

          <motion.p className="text-text text-sm xs:text-base sm:text-lg max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} viewport={{ once: true }}>
            {t("about.beforeAfter.description")}
          </motion.p>
        </motion.div>

        <div className="grid gap-6 lg:gap-12">
          {comparisons.map((comparison, index) => {
            const BeforeIcon = iconMap[index].before;
            const AfterIcon = iconMap[index].after;

            return (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="grid md:grid-cols-2 gap-6">

                <div className="relative p-6 sm:p-8 rounded-2xl bg-surface border-2 border-red-500/30">
                  <div className="absolute -top-3 sm:-top-4 left-4 sm:left-8 bg-red-500 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2">
                    <FaTimesCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4"/> {t("about.beforeAfter.without")}
                  </div>

                  <BeforeIcon className="text-6xl mb-4 text-red-500" />

                  <h3 className="relative text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 text-text group-hover:text-tertiary leading-snug">{comparison.before.title}</h3>
                  <p className="relative text-sm sm:text-base md:text-lg lg:text-lg text-text-secondary leading-relaxed">{comparison.before.text}</p>
                </div>

                <div className="relative p-8 rounded-2xl bg-linear-to-br from-primary/10 to-secondary/10 border-2 border-primary">
                  <div className="absolute -top-4 left-8 bg-linear-to-r from-primary to-secondary icon-card px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <FaCheckCircle /> {t("about.beforeAfter.with")}
                  </div>

                  <AfterIcon className="text-6xl mb-4 text-primary" />

                  <h3 className="relative text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 text-text group-hover:text-tertiary leading-snug">{comparison.after.title}</h3>
                  <p className="relative text-sm sm:text-base md:text-lg lg:text-lg text-text-secondary leading-relaxed">{comparison.after.text}</p>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapperFull>
  );
};