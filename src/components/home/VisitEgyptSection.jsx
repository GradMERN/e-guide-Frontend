import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { FaSwimmer, FaHeart, FaSun, FaWallet, FaUtensils } from "react-icons/fa";
import { GiGreatPyramid } from "react-icons/gi";
import { RiLandscapeAiLine } from "react-icons/ri";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";

export default function VisitEgyptSection() {
  const { t } = useTranslation();

  const reasons = [ GiGreatPyramid, FaSwimmer, FaHeart, FaSun, FaWallet, FaUtensils];

  return (
    <SectionWrapperFull>
      <TitlesHome icon={RiLandscapeAiLine} title={t("reasonsToVisit.title")} paragraph={t("reasonsToVisit.subtitle")}/>
      <motion.div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 lg:gap-8 max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
        {reasons.map((Icon, index) => {
          return (
            <motion.div key={index} className="group relative p-4 xs:p-4 sm:p-5 lg:p-8 rounded-xl bg-surface border-2 border-border hover:border-primary transition-all duration-300 min-h-[150px] xs:min-h-[160px] sm:min-h-[180px]" variants={{hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },}}>

            <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.6 }} className="relative w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-2 xs:mb-2 sm:mb-3 rounded-xl bg-linear-to-br from-secondary to-tertiary flex items-center justify-center shadow-lg">
              <Icon className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 icon-card" strokeWidth={1}/>
            </motion.div>

            <h3 className="text-2xl font-bold text-text mb-4 relative z-10">{t(`reasonsToVisit.reasons.${index}.title`)}</h3>
            <p className="text-text-secondary leading-relaxed relative z-10">{t(`reasonsToVisit.reasons.${index}.description`)}</p>

            <div className={`left-0 h-1 w-0 rounded-5xl bg-linear-to-r from-(--gradient-from) via-(--gradient-via) to-(--gradient-to) transition-all duration-500 group-hover:w-full`}/>
            </motion.div>
          );
        })}
      </motion.div>

    </SectionWrapperFull>
  );
}