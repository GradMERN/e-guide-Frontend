import { motion } from "motion/react";
import { Briefcase, TrendingUp, Smartphone, CheckSquare } from "lucide-react";

const SlideFive = () => {
  const stats = [
    {
      title: "14.7M Tourists",
      desc: "Annual visitors to Egypt in 2024",
      icon: <Briefcase size={24} className="text-primary" />,
    },
    {
      title: "6% Growth",
      desc: "Projected annual growth rate",
      icon: <TrendingUp size={24} className="text-primary" />,
    },
    {
      title: "Digital-First",
      desc: "Demand for flexible, tech-enabled travel",
      icon: <Smartphone size={24} className="text-primary" />,
    },
  ];

  const insights = [
    { title: "Tech-Savvy Travelers", age: "(Ages 20-45)", desc: "Comfortable with mobile and digital tools" },
    { title: "Preference for Independence", desc: "Prefer self-paced exploration." },
    { title: "AI-Driven Guidance", desc: "Value smart, personalized, real-time help." },
    { title: "Cultural Immersion", desc: "Want authentic, in-depth experiences." },
  ];

  return (
    <div className="relative min-h-screen md:h-screen w-full bg-background overflow-y-auto md:overflow-hidden flex flex-col items-center font-serif scrollbar-hide">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-primary/5 blur-[100px] rounded-full" />
      </div>


      <div className="relative z-20 w-full max-w-7xl px-6 sm:px-12 md:px-16 lg:px-24 py-16 md:py-0 md:h-screen md:flex md:flex-col md:justify-center">
        <motion.h1 initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-10 md:mb-12 text-center">
          Market Research
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-16">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.1 }}className="bg-surface/20 border border-white/10 backdrop-blur-md p-6 rounded-sm flex flex-col items-start hover:border-primary/40 transition-all group">
              <div className="mb-4 p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                {stat.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-1">{stat.title}</h3>
              <p className="text-text-secondary text-sm opacity-80">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent mb-12 md:mb-16" />

        <div className="text-center mb-10 md:mb-10">
          <h2 className="text-2xl md:text-4xl font-bold text-primary">Target Audience Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 md:gap-y-10">
          {insights.map((insight, index) => (
            <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} className="flex gap-4 items-start group">
              <div className="mt-1 shrink-0">
                <CheckSquare className="text-white/30 group-hover:text-primary transition-colors" size={20} />
              </div>
              <div>
                <h4 className="text-lg md:text-xl font-bold text-secondary group-hover:text-primary transition-colors">
                  {insight.title} <span className="text-white/40 font-light text-sm block sm:inline">{insight.age}</span>
                </h4>
                <p className="text-text-secondary text-sm md:text-base opacity-70 mt-1 leading-relaxed">{insight.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlideFive;