import CircularGallery from "../ui/CircularGallery.jsx";
import Particles from "../ui/Particles.jsx";
import "../../styles/CircularGallery.css";

import { motion } from "motion/react";


export default function CircularGallerySection() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Particles
          particleColors={["#FFE6A0", "#FFD27F"]}
          particleCount={500}
          particleSpread={15}
          speed={0.09}
          particleBaseSize={250}
          cameraDistance={30}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-8 relative z-10"
        initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }} viewport={{ once: true, margin: "-80px" }}>
        <motion.span
          className="inline-block text-sm tracking-[0.3em] text-[#FFD97F] uppercase font-medium mb-4 smooth-text"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }}>
          Traveler Highlights
        </motion.span>

        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-light mb-4 smooth-text"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
          Explore Egypt Through{" "}
          <span className="font-semibold bg-linear-to-r from-[#FFD97F] to-[#FFE6A0] bg-clip-text text-transparent">
            Our Travelers' Stories
          </span>
        </motion.h2>

        <motion.p
          className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto smooth-text leading-relaxed"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }} viewport={{ once: true }}>
          A visual journey of the most memorable moments from our tours
        </motion.p>
      </motion.div>

      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] z-10">
        <CircularGallery
          bend={2}
          textColor="#FFE6A0"
          borderRadius={0.05}
          scrollEase={0.05}
          scrollSpeed={1.5}
        />
      </div>
    </section>
  );
}
