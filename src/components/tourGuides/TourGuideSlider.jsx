import { ChevronLeft, ChevronRight, Quote, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TourGuideSlider({ tourGuides, autoplay = false}) {

  const [active, setActive] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const isActive = (index) => index === active;

  const handleNext = () => {
    setActive((prev) => (prev + 1) % tourGuides.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + tourGuides.length) % tourGuides.length);
  };

  const handleNavigation = (guide) => {
    navigate(`/TourGuideProfile/${guide.name.toLowerCase()}`);
  };


  useEffect(() => {
    if (autoplay && !isHovering) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, isHovering]);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;

  return (
    <div className="relative isolate z-0 w-full overflow-hidden py-4  font-sans text-white antialiased">


      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between px-0 sm:px-8 z-50">
        <NavButton onClick={handlePrev} icon={<ChevronLeft size={18} className="sm:w-8 sm:h-8 " />} className="pointer-events-auto cursor-pointer" />
        <NavButton onClick={handleNext} icon={<ChevronRight size={18} className="sm:w-8 sm:h-8" />} className="pointer-events-auto cursor-pointer" />
      </div>



      <div className="mx-auto w-full max-w-7xl px-9 sm:px-24 lg:px-32">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-20 items-center min-w-0">


          <div className="relative w-full aspect-3/4 sm:aspect-square lg:aspect-4/5 max-h-[550px] mx-auto perspective-1000" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>

            <AnimatePresence mode="popLayout">

              {tourGuides.map((guide, index) => (
                <motion.div key={guide.src} initial={{ opacity: 0, scale: 0.9, z: -100, rotate: randomRotateY() }} animate={{
                  opacity: isActive(index) ? 1 : 0.3, scale: isActive(index) ? 1 : 0.9, z: isActive(index) ? 0 : -100, rotate: isActive(index) ? 0 : randomRotateY(), zIndex: isActive(index) ? 40 : tourGuides.length - index, y: isActive(index) ? [0, -8, 0] : 0,
                }}
                  exit={{ opacity: 0, scale: 0.8, z: -100, rotate: randomRotateY() }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center" onClick={() => isActive(index) && handleNavigation(guide)}>

                  <div className={`relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 bg-neutral-800 transition-all duration-500 ease-out ${isActive(index) ? "cursor-pointer group" : "pointer-events-none"}`}>
                    <img src={guide.src} alt={guide.name} className={`h-full w-full object-cover transition-all duration-700 ease-out ${isActive(index) ? "grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110" : "grayscale scale-110 blur-[2px]"}`} />

                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />


                    {isActive(index) && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">View Profile</span>
                          <ExternalLink size={14} className="text-[#ffd97e]" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>



          {/* RIGHT CONTENT */}

          <div className="flex flex-col justify-center relative z-10 w-full min-w-0">
            <motion.div key={active} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-neutral-800/60 backdrop-blur-xl border border-[#ffd97e]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-4 sm:p-10 lg:p-12">

              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ffd97e]/10 rounded-full blur-3xl pointer-events-none" />

              <Quote className="text-[#ffd97e] mb-2 sm:mb-4 opacity-80 relative z-10" size={24} />


              <h3 className="text-xl sm:text-4xl lg:text-5xl font-bold text-[#ffd97e] mb-1 sm:mb-2 drop-shadow-lg relative z-10 cursor-pointer hover:underline decoration-2 underline-offset-4 wrap-break-word"
                onClick={() => handleNavigation(tourGuides[active])}>
                {tourGuides[active].name}
              </h3>

              <p className="text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.25em] text-neutral-400 uppercase mb-4 sm:mb-6 relative z-10 wrap-break-word">
                {tourGuides[active].designation}
              </p>

              <div className="min-h-20 sm:min-h-[140px] relative z-10">
                <p className="text-xs sm:text-lg lg:text-xl leading-relaxed text-neutral-200 font-light italic">
                  {tourGuides[active].quote.split(" ").map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.3, delay: i * 0.02 }}
                      className="inline-block mr-1"
                    >
                      {word}
                    </motion.span>
                  ))}
                </p>
              </div>

            </motion.div>
          </div>



        </div>
      </div>
    </div>
  );

}


function NavButton({ onClick, icon, className = "" }) {
  return (
    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onClick} className={`group flex items-center justify-center w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-linear-to-br from-[#C7A15C] via-[#FFE6A0] to-[#FFD27F] border border-[#FFE6A0] shadow-lg shadow-black/60 hover:shadow-[#C7A15C]/50 transition-all duration-300 z-50 ${className}`} >
      <span className="text-neutral-900 group-hover:text-black transition-colors">
        {icon}
      </span>
    </motion.button>
  )
}