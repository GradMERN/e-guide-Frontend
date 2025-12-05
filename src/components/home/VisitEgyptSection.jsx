import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { FaSwimmer, FaHeart, FaSun, FaWallet, FaUtensils } from "react-icons/fa";
import { GiGreatPyramid } from "react-icons/gi";
import { RiLandscapeAiLine } from "react-icons/ri";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";

export default function VisitEgyptSection() {
  const { t } = useTranslation();

  const reasons = [
    {
      id: 1,
      icon: GiGreatPyramid,
      gradient: "from-primary to-secondary",
      bgGradient: "from-primary/10 to-secondary/10",
    },
    {
      id: 2,
      icon: FaSwimmer,
      gradient: "from-blue-500 to-cyan-600",
      bgGradient: "from-blue-500/10 to-cyan-600/10",
    },
    {
      id: 3,
      icon: FaHeart,
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-500/10 to-pink-600/10",
    },
    {
      id: 4,
      icon: FaSun,
      gradient: "from-yellow-500 to-amber-600",
      bgGradient: "from-yellow-500/10 to-amber-600/10",
    },
    {
      id: 5,
      icon: FaWallet,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-500/10 to-green-600/10",
    },
    {
      id: 6,
      icon: FaUtensils,
      gradient: "from-purple-500 to-indigo-600",
      bgGradient: "from-purple-500/10 to-indigo-600/10",
    },
  ];

  return (
    <SectionWrapperFull>
      <TitlesHome
        icon={RiLandscapeAiLine}
        title={t("reasonsToVisit.title")}
        paragraph={t("reasonsToVisit.subtitle")}
      />
      <motion.div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 lg:gap-8 max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
        {reasons.map((reason, index) => {
          const Icon = reason.icon;
          return (
            <motion.div key={index} className="group relative p-4 xs:p-4 sm:p-5 lg:p-8 rounded-xl bg-surface border-2 border-border hover:border-primary transition-all duration-300 min-h-[150px] xs:min-h-[160px] sm:min-h-[180px]" variants={{hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },}}>
            <div className={`absolute -top-10 -right-10 w-60 h-60 bg-linear-to-br from-(--gradient-from) via-(--gradient-via) to-(--gradient-to) rounded-2xl blur-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-600`}/>

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