import { useTranslation } from "react-i18next";
import ValueCard from "./ValueCard";
import { motion } from "motion/react";
import { LuUsers } from "react-icons/lu";
import { FaAward } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { FaRegClock } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";

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
    <section className="py-6 lg:py-12 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <motion.span className="inline-block text-sm tracking-[0.3em] text-primary uppercase font-medium mb-6 smooth-text" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            {t("about.values.label")}
          </motion.span>

          <motion.h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6 smooth-text" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
            {t("about.values.title")}<span className="font-semibold text-gradient-title"> {t("about.values.titleHighlight")}</span>
          </motion.h2>

          <motion.p className="text-text text-xl lg:text-2xl max-w-3xl mx-auto smooth-text leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
            {t("about.values.subtitle")}
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, i) => (
            <ValueCard key={i} value={value} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
