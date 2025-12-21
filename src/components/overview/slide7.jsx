import { motion } from "motion/react";
import { XCircle, CheckCircle2, ArrowRight } from "lucide-react";

const SlideSeven = () => {
  const comparison = [
    {
      problem: "High Private Guide Costs",
      solution: "Accessible, Scalable Guidance",
    },
    {
      problem: "Rigid Group Tours & Crowds",
      solution: "Personalized Pace & Flexibility",
    },
    {
      problem: "Outdated Information",
      solution: "Dynamic, AI-Driven Content",
    },
    {
      problem: "Language Barriers",
      solution: "Comprehensive Multilingual Support",
    },
  ];

  return (
    <div className="relative min-h-screen md:h-screen w-full bg-background flex flex-col md:flex-row overflow-y-auto md:overflow-hidden font-serif scrollbar-hide">
      <div className="relative w-full md:w-5/12 h-[300px] md:h-full overflow-hidden shrink-0">
        <img  src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80" alt="Ancient Egypt Columns" className="absolute inset-0 w-full h-full object-cover brightness-[0.4] grayscale-[0.2]"/>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-black/20 md:bg-linear-to-r md:from-transparent md:to-background" />
        
        <div className="absolute bottom-8 left-8 md:bottom-20 md:left-12 z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.4em] mb-3 font-sans">
              Evolution of Travel
            </p>
            <h2 className="text-white text-4xl md:text-6xl font-bold leading-tight">
              The <br /> Solution.
            </h2>
          </motion.div>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 py-16 md:py-0 bg-background">
        
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 leading-tight">Problems Solved</h1>
          <div className="h-1 w-20 bg-primary/40 rounded-full" />
        </motion.div>

        <div className="flex flex-col gap-4 md:gap-5 max-w-3xl">
          {comparison.map((item, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-6">
              <div className="flex-1 p-4 rounded-xl border border-white/5 bg-white/2 flex items-center gap-4 transition-all duration-300 group-hover:bg-white/5">
                <XCircle className="text-rose-500/70 shrink-0" size={18} />
                <p className="text-white/40 text-sm md:text-base italic line-through decoration-rose-500/20">{item.problem}</p>
              </div>

              <div className="hidden lg:flex shrink-0 w-8 h-8 rounded-full items-center justify-center border border-primary/20 text-primary/50 group-hover:scale-110 group-hover:text-primary transition-all">
                <ArrowRight size={14} />
              </div>

              <div className="flex-1 p-4 rounded-xl border border-primary/20 bg-primary/3 flex items-center gap-4 shadow-xl shadow-black/20 group-hover:border-primary/40 transition-all duration-300">
                <CheckCircle2 className="text-primary shrink-0" size={18} />
                <p className="text-primary font-bold text-sm md:text-base tracking-wide">{item.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-12 md:mt-16 flex items-center gap-4">
          <div className="h-px w-12 bg-white/10" />
          <p className="text-text-secondary text-xs md:text-sm opacity-40 tracking-wider">
            REDEFINING THE TOURISM EXPERIENCE
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SlideSeven;