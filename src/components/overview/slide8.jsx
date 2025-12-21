import { motion } from "motion/react";
import { MapPin, Hourglass, Camera, Star, Compass } from "lucide-react";

const SlideEight = () => {
  const features = [
    {
      title: "Live GPS Mode",
      desc: "Delivers real-time, location-aware information with pinpoint accuracy.",
      icon: <MapPin size={24} />,
    },
    {
      title: "Flexible Tour Access",
      desc: "Enables self-paced exploration with adaptable schedules and no rigid timelines.",
      icon: <Hourglass size={24} />,
    },
    {
      title: "AI Camera Detection",
      desc: "Instantly identifies artifacts by pointing your camera for detailed information.",
      icon: <Camera size={24} />,
    },
    {
      title: "Curated Tour Discovery",
      desc: "Matches users with tours perfectly aligned to their preferences, interests, and budget.",
      icon: <Star size={24} />,
    },
  ];

  return (
    <div className="relative min-h-screen md:h-screen w-full bg-background flex items-center justify-center font-serif overflow-y-auto md:overflow-hidden py-12 md:py-0">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 md:w-96 md:h-96 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-secondary/5 blur-[120px] rounded-full opacity-30" />
      </div>

      <div className="relative z-20 w-full max-w-7xl px-6 sm:px-12 md:px-16 lg:px-24 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        <motion.div initial={{ opacity: 0, scale: 0.9, x: -30 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: 0.8 }} className="relative w-full md:w-1/2 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-[3rem] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
            
            <div className="relative overflow-hidden rounded-[2.5rem] border-[6px] md:border-8 border-white/10 shadow-2xl z-10">
              <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80" alt="Project Interface" className="w-[260px] md:w-[320px] lg:w-[360px] object-cover brightness-[0.7] contrast-[1.1]"/>
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -top-4 -right-4 bg-primary p-3 rounded-2xl shadow-lg z-20 hidden md:flex items-center justify-center border border-white/20">
              <MapPin className="text-black" size={22} />
            </motion.div>
          </div>
        </motion.div>

        <div className="w-full md:w-1/2 flex flex-col items-start">
          <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-6xl font-bold text-primary mb-4 leading-tight">
              Project <span className="text-white italic font-light">Features</span>
            </h1>
            <div className="h-1.5 w-24 bg-primary/40 rounded-full" />
          </motion.div>

          <div className="grid gap-6 md:gap-8 w-full">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index, duration: 0.5 }} className="group flex items-start gap-5 md:gap-6">
                <div className="shrink-0 w-10 h-10 md:w-14 md:h-14 rounded-xl bg-white/3 border border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500 shadow-lg">
                  {feature.icon}
                </div>
                
                <div className="flex-1 border-b border-white/5 pb-4 group-last:border-none">
                  <h3 className="text-sm md:text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary text-sm md:text-base opacity-60 leading-relaxed max-w-md">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideEight;