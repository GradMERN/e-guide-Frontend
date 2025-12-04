import { motion } from "motion/react";

export default function ValueCard({ value, index }) {
  const Icon = value.icon;

  return (
    <motion.div className="group relative p-8 lg:p-10 rounded-2xl linear-border   backdrop-blur-[20px] border bg-(--glass-bg) border-(--glass-border) hover:bg-(--glass-bg-hover)" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}  transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }} viewport={{ once: true }}>
    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-tertiary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="mb-6">
        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-secondary to-tertiary flex items-center justify-center shadow-lg shadow-tertiary/30">
          <Icon className="w-7 h-7 icon-card" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-2xl lg:text-3xl font-semibold mb-4 smooth-text text-primary group-hover:text-tertiary transition-colors duration-500">
        {value.title}
      </h3>

      <p className="text-text text-base lg:text-lg leading-relaxed smooth-text">
        {value.description}
      </p>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-tertiary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </motion.div>
  );
}