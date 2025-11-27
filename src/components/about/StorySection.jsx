"use client";
import { CheckCircle } from "lucide-react";
import { DirectionAwareHoverImage } from "./DirectionAwareHoverImage";
import { motion } from "motion/react";

export default function StorySection() {

  const features = [
    "Expert Local Guides",
    "Authentic Experiences",
    "Sustainable Tourism",
    "Small Group Tours",
  ];
  

  return (
    <section className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-stretch">
          <motion.div
            className="relative rounded-2xl overflow-hidden h-full"
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-50px" }}>
            <DirectionAwareHoverImage className="w-full h-full rounded-2xl" />
          </motion.div>

          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-50px" }}>
            <motion.span
              className="inline-block text-xs md:text-sm tracking-[0.2em] text-[#FFD97F] uppercase font-medium mb-4 "
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }} viewport={{ once: true }}>
              Our Story
            </motion.span>

            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-snug "
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}viewport={{ once: true }}>
              Preserving Egypt’s Past,
              <br />
              <span className="font-semibold bg-linear-to-r from-[#FFD97F] to-[#FFE6A0] bg-clip-text text-transparent">
                Crafting Unforgettable Journeys
              </span>
            </motion.h2>

            <motion.div
              className="text-gray-300 text-base md:text-lg leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
              <p className="mb-3">
                Since 2025, we’ve dedicated ourselves to showcasing Egypt’s
                timeless history through immersive and responsible travel
                experiences.
              </p>
              <p>
                Our certified Egyptologists, passionate local guides, and
                commitment to sustainability ensure every journey feels
                authentic and memorable.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              {features.map((text, i) => (
                <motion.div
                  key={i} className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }} viewport={{ once: true }}>
                  <div className="w-6 h-6 bg-linear-to-br from-[#FFD97F] to-[#FFE6A0] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-black" />
                  </div>
                  <span className="text-white font-medium text-sm ">
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
}
