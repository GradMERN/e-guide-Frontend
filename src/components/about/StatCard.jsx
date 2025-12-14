import { motion } from "motion/react";

export default function StatCard({ stat, index }) {
  const Icon = stat.icon;

  return (
    <motion.div className="text-center group" initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{duration: 0.6, delay: index * 0.25, ease: "easeOut",}}>
      <div className="mb-4 sm:mb-6 inline-block">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-linear-to-br from-secondary to-tertiary flex items-center justify-center shadow-lg shadow-tertiary/30">
          <Icon className="w-5 h-5 sm:w-7 sm:h-7 md:w-8 md:h-8 icon-card" strokeWidth={1.5} />
        </div>
      </div>

      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 sm:mb-4 text-gradient-title transition-all duration-500">
        {stat.value}
      </div>

      <div className="text-sm sm:text-base lg:text-lg text-text font-medium">
        {stat.label}
      </div>
    </motion.div>
  );
};