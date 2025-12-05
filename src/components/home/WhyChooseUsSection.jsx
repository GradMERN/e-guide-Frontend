import { useTranslation } from "react-i18next";
import { TbPyramid } from "react-icons/tb";
import { FaShieldAlt, FaUserTie, FaRoute, FaClock, FaAward, FaHeart } from "react-icons/fa";
import { motion} from "motion/react";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";

export default function WhyChooseUsSection() {

  const { t } = useTranslation();

  const features = [ FaShieldAlt, FaUserTie, FaRoute, FaClock, FaAward, FaHeart];

  return (
    <SectionWrapperFull>
      <TitlesHome icon={TbPyramid} title={t("whyChooseUs.title")} paragraph={t("whyChooseUs.description")}/>

    <motion.div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 lg:gap-8 max-w-7xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}>
      {features.map((Icon, index) => {
        return (
          <motion.div key={index} className="group relative p-4 xs:p-4 sm:p-5 lg:p-8 rounded-xl bg-surface border-2 border-border hover:border-primary transition-all duration-300 min-h-[150px] xs:min-h-[160px] sm:min-h-[180px]" variants={{hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },}}>
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-secondary/8 to-tertiary/8 opacity-0 group-hover:opacity-150 duration-300" />

            <motion.div whileHover={{ rotate: 360, scale: 1.2 }} transition={{ duration: 0.6 }} className="relative w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mb-2 xs:mb-2 sm:mb-3 rounded-xl bg-linear-to-br from-secondary to-tertiary flex items-center justify-center shadow-lg">
              <Icon className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 icon-card" strokeWidth={1}/>
            </motion.div>

            <h3 className="relative text-sm xs:text-base sm:text-lg lg:text-xl font-bold mb-1 xs:mb-1 sm:mb-2 text-text group-hover:text-tertiary duration-300">
              {t(`whyChooseUs.features.${index}.title`)}
            </h3>
            <p className="relative text-xs xs:text-sm sm:text-base lg:text-base text-text-secondary leading-relaxed">
              { t(`whyChooseUs.features.${index}.description`)}
            </p>

            <div className="absolute top-0 right-0 w-12 xs:w-16 sm:w-20 h-12 xs:h-16 sm:h-20 bg-linear-to-br from-primary/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-50 duration-300" />
          </motion.div>
        );
      })}
    </motion.div>
    </SectionWrapperFull>
  );
};