import { motion } from "motion/react";
import { Globe, Users, Landmark, Plane } from "lucide-react";

const SlideFour = () => {
  const users = [
    {
      title: "International Tourists",
      desc: "Flexible, guided-free cultural exploration.",
      icon: <Globe className="text-primary" size={24} />,
    },
    {
      title: "Professional Guides",
      desc: "Create and sell digital tours.",
      icon: <Users className="text-primary" size={24} />,
    },
    {
      title: "Cultural Enthusiasts",
      desc: "Deep, authentic heritage experiences.",
      icon: <Landmark className="text-primary" size={24} />,
    },
    {
      title: "Solo Travelers",
      desc: "Deep, authentic heritage experiences.",
      icon: <Plane className="text-primary" size={24} />,
    },
  ];

  return (
    <div className="relative min-h-screen md:h-screen w-full bg-background overflow-x-hidden flex items-center justify-center font-serif py-20 md:py-0">
      
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-20 w-full max-w-7xl px-6 sm:px-12 md:px-16 lg:px-24">
        <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-10 md:mb-16 text-center">
          Target Users
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 lg:gap-10">
          {users.map((user, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="group bg-surface/20 border border-white/10 backdrop-blur-md p-5 md:p-8 lg:p-10 rounded-sm flex flex-col items-center text-center hover:border-primary/50 transition-all duration-500">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ring-1 ring-primary/20">
                {user.icon}
              </div>

              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                {user.title}
              </h3>
              
              <p className="text-text-secondary text-xs md:text-sm lg:text-base font-light opacity-80 max-w-[260px] leading-relaxed">
                {user.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlideFour;