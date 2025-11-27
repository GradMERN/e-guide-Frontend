"use client";
import { motion } from "motion/react";

export default function ValueCard({ value, index }) {
  const Icon = value.icon;

  return (
    <motion.div
      className="group relative p-8 lg:p-10 rounded-2xl linear-border bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)]"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }} viewport={{ once: true }}>
      <div className="mb-6">
        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-[#FFD97F] to-[#FFE6A0] flex items-center justify-center shadow-lg shadow-[#FFD97F]/30">
          <Icon className="w-7 h-7 text-black" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-2xl lg:text-3xl font-semibold mb-4 smooth-text text-white group-hover:text-[#FFD97F] transition-colors duration-500">
        {value.title}
      </h3>

      <p className="text-gray-300 text-base lg:text-lg leading-relaxed smooth-text">
        {value.description}
      </p>

      <div className="absolute bottom-0 left-8 right-8 h-1 bg-linear-to-r from-transparent via-[#FFD97F] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
    </motion.div>
  );
}
