import { motion } from "motion/react";
import { User, Brain, Target, Banknote, PenTool, Sparkles } from "lucide-react";

const SlideSix = () => {
  const points = [
    {
      title: "Untapped Digital Demand",
      desc: "Tech-savvy travelers seeking mobile-first solutions.",
      icon: <User size={18} />,
    },
    {
      title: "Personalization Gap",
      desc: "Traditional offerings fail to provide tailored experiences.",
      icon: <PenTool size={18} />,
    },
    {
      title: "AI Integration",
      desc: "Leveraging AI for superior real-time guidance and support.",
      icon: <Brain size={18} />,
      highlight: "Exponential Global Growth"
    },
    {
      title: "Unmet Market Demand",
      desc: "High demand for immersive expert-level guidance at scale.",
      icon: <Target size={18} />,
    },
    {
      title: "Expert Monetization",
      desc: "Transforming physical expertise into scalable digital assets.",
      icon: <Banknote size={18} />,
    }
  ];

  return (
    <div className="relative min-h-screen md:h-screen w-full bg-[#0a0a0a] flex items-start md:items-center justify-center font-serif overflow-y-auto md:overflow-hidden py-20 md:py-0 scrollbar-hide">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-primary/5 blur-[80px] md:blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-secondary/5 blur-[80px] md:blur-[100px] rounded-full" />
      </div>

      <div className="relative z-20 w-full max-w-3xl px-8">
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 border-l-2 border-primary pl-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Market <span className="text-primary italic font-light">Opportunities</span>
          </h1>
        </motion.div>

        <div className="space-y-6 md:space-y-5">
          {points.map((point, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="group flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-300 shadow-xl">
                {point.icon}
              </div>

              <div className="flex-1 pt-1 border-b border-white/5 pb-4 md:pb-3">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {point.title}
                  </h3>
                  {point.highlight && (
                    <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-widest bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                      <Sparkles size={8} /> {point.highlight}
                    </span>
                  )}
                </div>
                <p className="text-white/60 text-sm md:text-base leading-snug">
                  {point.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlideSix;