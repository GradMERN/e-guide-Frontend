import { useTranslation } from "react-i18next";
import ValueCard from "./ValueCard";
import { motion } from "motion/react";
import { LuUsers } from "react-icons/lu";
import { FaAward } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { FaRegClock } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import SectionWrapperFull from "../common/SectionWrapper";

export default function ValuesSection() {
  const { t } = useTranslation();
  const icons = [FaRegHeart, IoIosGlobe, LuUsers, FaAward, FaRegClock, FaRegCheckCircle];
  const valuesData = t("about.values.items", { returnObjects: true });
  const values = valuesData.map((item, index) => ({
    icon: icons[index],
    title: item.title,
    description: item.description,
  }));


  return (
    <SectionWrapperFull className="relative" py="py-0" px="px-4 sm:px-6 md:px-12 lg:px-12 ">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <motion.span className="inline-block text-sm xs:text-base sm:text-lg tracking-[0.25em] sm:tracking-[0.3em] text-text uppercase font-medium mb-3 sm:mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            {t("about.values.label")}
          </motion.span>

          <motion.h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl font-light mb-3 sm:mb-4 text-text leading-tight" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
            {t("about.values.title")}<span className="font-semibold bg-linear-to-r text-gradient-title bg-clip-text text-transparent"> {t("about.values.titleHighlight")}</span>
          </motion.h2>

          <motion.p className="text-text text-sm xs:text-base sm:text-lg max-w-xl sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
            {t("about.values.subtitle")}
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, i) => (
            <ValueCard key={i} value={value} index={i} />
          ))}
        </div>
      </div>
    </SectionWrapperFull>
  );
}
