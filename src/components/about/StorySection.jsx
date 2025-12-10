import { useTranslation } from "react-i18next";
import { FaRegCheckCircle } from "react-icons/fa";
import { DirectionAwareHoverImage } from "./DirectionAwareHoverImage";
import { motion } from "motion/react";

export default function StorySection() {
  const { t } = useTranslation();

  return (
    <section id="our-story" className="py-6 lg:py-12 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-stretch">
          <motion.div className="relative rounded-xl overflow-hidden h-full" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-50px" }}>
            <DirectionAwareHoverImage className="w-full h-full rounded-xl" />
          </motion.div>

          <motion.div className="flex flex-col justify-center" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-50px" }}>
            <motion.span
              className="inline-block text-xl md:text-sm tracking-[0.2em] text-gradient-title uppercase font-medium mb-4 " initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
              {t("about.story.label")}
            </motion.span>

            <motion.h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-snug " initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}viewport={{ once: true }}>
              {t("about.story.title")}<br /><span className="font-semibold text-gradient-title "> {t("about.story.titleHighlight")}</span>
            </motion.h2>

            <motion.div className="text-text md:text-lg leading-relaxed mb-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
              <p className="mb-3">{t("about.story.paragraph1")}</p>
              <p>{t("about.story.paragraph2")}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              {t("about.story.features", { returnObjects: true }).map((text, i) => (
                <motion.div key={i} className="flex items-center gap-2" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }} viewport={{ once: true }}>
                  <div className="w-6 h-6 bg-linear-to-br  from-secondary to-tertiary rounded-xl flex items-center justify-center">
                    <FaRegCheckCircle className="w-3.5 h-3.5 icon-card" />
                  </div>
                  <span className="text-text font-medium text-sm ">
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};