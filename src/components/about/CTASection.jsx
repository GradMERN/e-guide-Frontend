import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function CTASection() {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8, delay: 0.2 }}
          className=" p-8 sm:p-12 lg:p-20 rounded-3xl gradient-border bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.1)]">
          <motion.span
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.4 }}
            className="inline-block text-xs sm:text-sm tracking-[0.25em] text-[#E2C784] uppercase font-medium mb-4 sm:mb-6">
            Your Adventure Awaits
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-light mb-6 sm:mb-8">
            Ready to Walk Among <br />
            <span className="font-semibold bg-linear-to-r from-[#C7A15C] via-[#E2C784] to-[#C7A15C] bg-clip-text text-transparent">
              The Pharaohs?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.8 }}
            className="text-gray-300 text-sm sm:text-base lg:text-lg mb-8 sm:mb-12 max-w-xl sm:max-w-2xl mx-auto">
            Join over 50,000 travelers who've discovered the wonders of ancient
            Egypt through our expertly curated journeys.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button className="group inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-linear-to-r from-[#C7A15C] to-[#E2C784] text-[#0f0b08] font-bold rounded-full text-sm sm:text-base transition-all duration-500 hover:scale-105">
              <span>Book Your Expedition</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-all duration-300" />
            </button>

            <button className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-5 border-2 border-[#C7A15C]/30 text-[#E2C784] font-semibold rounded-full hover:border-[#E2C784]">
              <span>View Tours</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
