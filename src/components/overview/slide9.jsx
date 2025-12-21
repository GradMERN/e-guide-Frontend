import { motion } from "motion/react";

const SlideNine = () => {
  const roadmapItems = [
    {
      id: 1,
      title: "Augmented Reality",
      desc: "Interactive 3D reconstructions of historical sites for immersive exploration.",
    },
    {
      id: 2,
      title: "Offline Access",
      desc: "Uninterrupted tour content and maps without internet connectivity.",
    },
    {
      id: 3,
      title: "AI Voice Guide",
      desc: "Conversational guides providing personalized insights and real-time responses.",
    },
    {
      id: 4,
      title: "Multi-Language Support",
      desc: "Extensive linguistic support across all audio and text content.",
    },
    {
      id: 5,
      title: "Native Mobile App",
      desc: "High-performance native applications for iOS and Android platforms.",
    },
    {
      id: 6,
      title: "Social Community",
      desc: "Share tours and connect with other travelers globally.",
    },
  ];

  return (
    <div className="relative min-h-screen md:h-screen w-full bg-[#0a0a0a] flex items-center justify-center font-serif overflow-y-auto md:overflow-hidden px-6 py-12 md:py-0 scrollbar-hide">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full opacity-40" />
      </div>

      <div className="relative z-20 w-full max-w-7xl">
        
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight">
            Built for the <span className="text-white italic font-light">Future</span>
          </h1>
          <div className="h-1 w-16 md:w-24 bg-primary/40 mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {roadmapItems.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05, duration: 0.4 }} className="group relative p-5 md:p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-primary/40 transition-all duration-300">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary group-hover:text-black transition-all">
                  {item.id}
                </div>
                <div className="h-px flex-1 bg-white/5 group-hover:bg-primary/20 transition-all" />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              
              <p className="text-text-secondary text-xs md:text-sm opacity-50 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-10 md:mt-16 text-center hidden sm:block">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/20">Scalable Architecture • Next-Gen Tourism</p>
        </motion.div>
      </div>
    </div>
  );
};

export default SlideNine;