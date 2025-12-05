import { motion } from "motion/react";
import {FaTimesCircle,FaCheckCircle,FaRegFrown,FaRegSmile,FaCamera,FaSun,FaUsers,FaUserFriends,FaDollarSign,FaGem,} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const BeforeAndAfterIcons = {
  planning: FaRegFrown,
  readyPlan: FaRegSmile,
  missingInfo: FaCamera,
  audioCommentary: FaSun,
  gettingLost: FaUsers,
  gps: FaUserFriends,
  expensiveGuides: FaDollarSign,
  affordable: FaGem
};

export default function BeforeAfterSection() {

  const { t } = useTranslation();
  const comparisons = [
    {
      before: { icon: BeforeAndAfterIcons.planning, title: t("beforeAfter.comparisons.0.before.title"), text: t("beforeAfter.comparisons.0.before.text") },
      after: { icon: BeforeAndAfterIcons.readyPlan, title: t("beforeAfter.comparisons.0.after.title"), text: t("beforeAfter.comparisons.0.after.text") },
    },
    {
      before: { icon: BeforeAndAfterIcons.missingInfo, title: t("beforeAfter.comparisons.1.before.title"), text: t("beforeAfter.comparisons.1.before.text") },
      after: { icon: BeforeAndAfterIcons.audioCommentary, title: t("beforeAfter.comparisons.1.after.title"), text: t("beforeAfter.comparisons.1.after.text") },
    },
    {
      before: { icon: BeforeAndAfterIcons.gettingLost, title: t("beforeAfter.comparisons.2.before.title"), text: t("beforeAfter.comparisons.2.before.text") },
      after: { icon: BeforeAndAfterIcons.gps, title: t("beforeAfter.comparisons.2.after.title"), text: t("beforeAfter.comparisons.2.after.text") },
    },
    {
      before: { icon: BeforeAndAfterIcons.expensiveGuides, title: t("beforeAfter.comparisons.3.before.title"), text: t("beforeAfter.comparisons.3.before.text") },
      after: { icon: BeforeAndAfterIcons.affordable, title: t("beforeAfter.comparisons.3.after.title"), text: t("beforeAfter.comparisons.3.after.text") },
    }
  ];

  return (
    <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-16 relative z-10" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-80px" }}>
          <motion.span className="inline-block text-xl tracking-[0.3em] text-text uppercase font-medium mb-4" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} viewport={{ once: true }}>
            {t("beforeAfter.subtitle")}
          </motion.span>

          <motion.h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-4 text-text" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
            {t("beforeAfter.title.normal")} <span className="font-semibold bg-linear-to-r text-gradient-title bg-clip-text text-transparent">{t("beforeAfter.title.highlight")}</span>
          </motion.h2>

          <motion.p className="text-text text-base sm:text-lg max-w-3xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} viewport={{ once: true }}>
            {t("beforeAfter.description")}
          </motion.p>
        </motion.div>

        <div className="grid gap-8">
          {comparisons.map((comparison, index) => {
            const BeforeIcon = comparison.before.icon;
            const AfterIcon = comparison.after.icon;

            return (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="grid md:grid-cols-2 gap-6">

                <div className="relative p-8 rounded-2xl bg-surface border-2 border-red-500/30">
                  <div className="absolute -top-4 left-8 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <FaTimesCircle /> Without Us
                  </div>

                  <BeforeIcon className="text-6xl mb-4 text-red-500" />

                  <h3 className="text-xl font-bold text-text mb-2">{comparison.before.title}</h3>
                  <p className="text-text-secondary">{comparison.before.text}</p>
                </div>

                <div className="relative p-8 rounded-2xl bg-linear-to-br from-primary/10 to-secondary/10 border-2 border-primary">
                  <div className="absolute -top-4 left-8 bg-linear-to-r from-primary to-secondary icon-card px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <FaCheckCircle /> With E-Tour Guide
                  </div>

                  <AfterIcon className="text-6xl mb-4 text-primary" />

                  <h3 className="text-xl font-bold text-text mb-2">{comparison.after.title}</h3>
                  <p className="text-text-secondary">{comparison.after.text}</p>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};