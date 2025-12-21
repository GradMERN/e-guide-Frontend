import {
  ChevronLeft,
  ChevronRight,
  Quote,
  ExternalLink,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TourGuideSlider({ tourGuides, autoplay = false }) {
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
    // Navigate using guide ID if available, otherwise use name
    const identifier = guide.id || guide.name.toLowerCase();
    navigate(`/TourGuideProfile/${identifier}`);
  };

  // Get initials for fallback avatar
  const getInitials = (name) => {
    if (!name) return "G";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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

      <div className="absolute inset-y-0 left-0 right-0 sm:-left-2 sm:-right-2 pointer-events-none flex items-center justify-between px-0 sm:px-8 z-50 ">

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handlePrev}
          className="pointer-events-auto cursor-pointer z-50 group flex items-center justify-center w-6 h-6 sm:w-16 sm:h-16 rounded-full button-gradient shadow-sm shadow-black/10 hover:shadow-[#C7A15C]/50 transition-all duration-300">
          <ChevronLeft size={18} className="sm:w-8 sm:h-8 text-neutral-900 group-hover:text-black transition-colors" />
        </motion.button>

        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handleNext}
          className="pointer-events-auto cursor-pointer z-50 group flex items-center justify-center w-6 h-6 sm:w-16 sm:h-16 rounded-full button-gradient shadow-sm shadow-black/10 hover:shadow-[#C7A15C]/50 transition-all duration-300">
          <ChevronRight size={18} className="sm:w-8 sm:h-8 text-neutral-900 group-hover:text-black transition-colors" />
        </motion.button>
      </div>

      <div className="mx-auto w-full max-w-7xl px-9 sm:px-24 lg:px-32">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-20 items-center min-w-0">


          {/* LEFT CONTENT */}

          <div className="relative w-full aspect-3/4 sm:aspect-square lg:aspect-4/5 max-h-[550px] mx-auto perspective-1000" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
            <AnimatePresence mode="popLayout">
              {tourGuides.map((guide, index) => (
                <motion.div key={guide.id || guide.name || index}
                  initial={{ opacity: 0, scale: 0.9, z: -100, rotate: 1.3, }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.3, scale: isActive(index) ? 1 : 0.9, z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : 1.3, zIndex: isActive(index) ? 40 : tourGuides.length - index, y: isActive(index) ? [0, -8, 0] : 0,
                  }}
                  exit={{ opacity: 0, scale: 0.8, z: -100, rotate: randomRotateY(), }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={() => isActive(index) && handleNavigation(guide)}>
                  <div className={`relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl  transition-all duration-500 ease-out card-bg
                  ${isActive(index) ? "cursor-pointer group" : "pointer-events-none"}`}>
                    {guide.src ? (
                      <img
                        src={guide.src}
                        alt={guide.name}
                        className={`h-full w-full object-cover transition-all duration-700 ease-out guide-image-style  ${isActive(index)
                          ? "opacity-100" : "opacity-30 blur-[2px]"}`} />
                    ) : (
                      <div
                        className={`h-full w-full flex items-center justify-center transition-all duration-700 ease-out `}>
                        <span className="text-6xl sm:text-8xl font-bold text-black/80">
                          {getInitials(guide.name)}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    {isActive(index) && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px] pointer-events-none">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <span className="text-xs sm:text-sm font-medium text-white whitespace-nowrap">
                            View Profile
                          </span>
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

            <motion.div key={active} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative overflow-hidden rounded-2xl sm:rounded-3xl guide-content-card  backdrop-blur-xl border border-[#ffd97e]/30 shadow-lg p-12">

              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ffd97e]/10 rounded-full blur-3xl pointer-events-none" />

              {/*Category & Rating/Reviews */}
              <div className="flex flex-wrap  gap-4 items-center justify-around mb-9">

                <span className="text-[10px] font-bold tracking-[0.2em] guide-quote-word uppercase bg-primary/10 border border-primary/20 px-2.5 py-1 rounded">{tourGuides[active].designation} </span>

                {tourGuides[active].rating > 0 && (

                  <div className="flex items-center gap-3 bg-primary/10 px-3 py-1.5 rounded-full border border-white/5">

                    <div className="flex items-center gap-1">

                      <div className="flex items-center gap-0.5 mr-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={12} className={`${star <= Math.round(tourGuides[active].rating) ? "text-yellow-400 fill-yellow-400" : "guide-quote-word"}`} />
                        ))}
                      </div>

                      <span className="text-sm font-bold guide-title leading-none"> {tourGuides[active].rating.toFixed(1)} </span>

                    </div>

                    <div className="w-1px h-3 bg-white/20" />
                    {tourGuides[active].totalReviews > 0 && (
                      <span className="text-[10px] font-semibold guide-quote-word uppercase tracking-tighter">
                        ({tourGuides[active].totalReviews} reviews)
                      </span>
                    )}
                  </div>
                )}
              </div>


              <h3 className="text-2xl sm:text-4xl font-bold guide-title mb-15  cursor-pointer transition-opacity duration-300 hover:opacity-60" onClick={() => handleNavigation(tourGuides[active])}>
                {tourGuides[active].name}
              </h3>


              {/* Quote Section */}
              <div className="relative mb-10 min-h-[60px]">
                <Quote className="absolute -left-2 -top-1 opacity-20 guide-quote-word " size={18} />
                <p className="text-sm sm:text-lg lg:text-xl leading-relaxed guide-quote-word italic font-light line-clamp-3 pl-5">
                  {tourGuides[active].quote?.split(" ").map((word, i) => (
                    <motion.span key={i} initial={{ opacity: 0, y: 5, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.3, delay: i * 0.02 }} className="inline-block mr-1">
                      {word}
                    </motion.span>
                  ))} </p>
              </div>


              {/* Footer */}
              <div className="flex flex-wrap  gap-4 justify-around mb-6 items-center pt-6  border-t border-primary/20">


                {tourGuides[active].toursCount > 0 && (
                  <div className="flex flex-col">

                    <p className="text-sm font-extrabold guide-quote-word  opacity-50 uppercase">
                      <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        {tourGuides[active].toursCount}{" "}
                        {tourGuides[active].toursCount === 1 ? "Tour" : "Tours"}{" "}
                        Available
                      </motion.span>
                    </p>
                  </div>
                )}

                <button onClick={() => handleNavigation(tourGuides[active])}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-primary/20 text-[11px] font-bold uppercase tracking-[0.2em] guide-title group hover:bg-primary hover:text-black transition-all duration-500">
                  <span>View Profile</span>
                  <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
