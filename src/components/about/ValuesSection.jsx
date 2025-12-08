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

  const values = [
    {
      icon: FaRegHeart,
      title: "Passion for Heritage",
      description:
        "Every journey is crafted with deep reverence for Egypt's 5,000-year legacy, bringing ancient wonders to life through expert storytelling.",
      linear: "from-rose-500/20 to-pink-500/20",
    },
    {
      icon: IoIosGlobe,
      title: "Authentic Connections",
      description:
        "Experience Egypt beyond the guidebooks—intimate encounters with local artisans, hidden archaeological gems, and centuries-old traditions.",
      linear: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: LuUsers,
      title: "Cultural Stewardship",
      description:
        "We partner with local communities to ensure tourism preserves heritage sites and empowers Egyptian families for generations.",
      linear: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: FaAward,
      title: "Excellence Guaranteed",
      description:
        "From luxury accommodations to expert Egyptologists, every detail meets our uncompromising standards of quality and safety.",
      linear: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: FaRegClock,
      title: "Your Journey, Your Way",
      description:
        "Flexible itineraries designed around your interests—whether ancient temples, desert adventures, or culinary discoveries.",
      linear: "from-violet-500/20 to-purple-500/20",
    },
    {
      icon: FaRegCheckCircle,
      title: "Trust & Transparency",
      description:
        "Clear pricing with no hidden fees, comprehensive travel insurance, and 24/7 support throughout your Egyptian odyssey.",
      linear: "from-cyan-500/20 to-blue-500/20",
    },
  ];

  return (
    <section className="py-6 lg:py-12 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-12">
          <motion.span className="inline-block text-sm tracking-[0.3em] text-primary uppercase font-medium mb-6 smooth-text" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            What Sets Us Apart
          </motion.span>

          <motion.h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-6 smooth-text" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}>
            Our Core<span className="font-semibold text-gradient-title"> Values</span>
          </motion.h2>

          <motion.p className="text-text text-xl lg:text-2xl max-w-3xl mx-auto smooth-text leading-relaxed" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
            Six principles that guide every expedition we create
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
