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
      <div className="absolute inset-y-0 left-0 right-0 pointer-events-none flex items-center justify-between px-0 sm:px-8 z-50 ">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrev}
          className="pointer-events-auto cursor-pointer z-50 group flex items-center justify-center w-8 h-8 sm:w-16 sm:h-16 rounded-full button-gradient shadow-lg shadow-black/60 hover:shadow-[#C7A15C]/50 transition-all duration-300"
        >
          <ChevronLeft
            size={18}
            className="sm:w-8 sm:h-8 text-neutral-900 group-hover:text-black transition-colors"
          />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="pointer-events-auto cursor-pointer z-50 group flex items-center justify-center w-8 h-8 sm:w-16 sm:h-16 rounded-full button-gradient shadow-lg shadow-black/60 hover:shadow-[#C7A15C]/50 transition-all duration-300"
        >
          <ChevronRight
            size={18}
            className="sm:w-8 sm:h-8 text-neutral-900 group-hover:text-black transition-colors"
          />
        </motion.button>
      </div>

      <div className="mx-auto w-full max-w-7xl px-9 sm:px-24 lg:px-32">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-20 items-center min-w-0">
          <div
            className="relative w-full aspect-3/4 sm:aspect-square lg:aspect-4/5 max-h-[550px] mx-auto perspective-1000"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <AnimatePresence mode="popLayout">
              {tourGuides.map((guide, index) => (
                <motion.div
                  key={guide.id || guide.name || index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.3,
                    scale: isActive(index) ? 1 : 0.9,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index) ? 40 : tourGuides.length - index,
                    y: isActive(index) ? [0, -8, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={() => isActive(index) && handleNavigation(guide)}
                >
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-neutral-800 transition-all duration-500 ease-out ${
                      isActive(index)
                        ? "cursor-pointer group"
                        : "pointer-events-none"
                    }`}
                  >
                    {guide.src ? (
                      <img
                        src={guide.src}
                        alt={guide.name}
                        className={`h-full w-full object-cover transition-all duration-700 ease-out ${
                          isActive(index)
                            ? "guide-img-active"
                            : "guide-img-inactive"
                        }`}
                      />
                    ) : (
                      <div
                        className={`h-full w-full flex items-center justify-center bg-gradient-to-br from-[#C7A15C] to-[#E2C784] transition-all duration-700 ease-out ${
                          isActive(index)
                            ? "guide-img-active"
                            : "guide-img-inactive"
                        }`}
                      >
                        <span className="text-6xl sm:text-8xl font-bold text-black/80">
                          {getInitials(guide.name)}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60" />

                    {isActive(index) && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
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
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl guide-content-card  backdrop-blur-xl border border-[#ffd97e]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-4 sm:p-10 lg:p-12"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ffd97e]/10 rounded-full blur-3xl pointer-events-none" />

              <Quote
                className="guide-title mb-2 sm:mb-4 opacity-80 relative z-10"
                size={24}
              />

              <h3
                className="text-xl sm:text-4xl lg:text-5xl font-bold guide-title mb-1 sm:mb-2 drop-shadow-lg relative z-10 cursor-pointer hover:underline decoration-2 underline-offset-4 wrap-break-word"
                onClick={() => handleNavigation(tourGuides[active])}
              >
                {tourGuides[active].name}
              </h3>

              <p className="text-[10px] sm:text-xs font-bold tracking-[0.15em] sm:tracking-[0.25em] guide-quote-word uppercase mb-2 ms-2 mt-3 relative z-10 wrap-break-word">
                {tourGuides[active].designation}
              </p>

              {/* Rating Display */}
              {tourGuides[active].rating > 0 && (
                <div className="flex items-center gap-2 mb-4 sm:mb-6 ms-2 relative z-10">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={`${
                          star <= Math.round(tourGuides[active].rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#ffd97e] font-semibold">
                    {tourGuides[active].rating.toFixed(1)}
                  </span>
                  {tourGuides[active].totalReviews > 0 && (
                    <span className="text-xs text-gray-400">
                      ({tourGuides[active].totalReviews} reviews)
                    </span>
                  )}
                </div>
              )}

              <div className="min-h-20 sm:min-h-[100px] relative z-10">
                {tourGuides[active].toursCount > 0 ? (
                  <p className="text-xs sm:text-lg lg:text-xl leading-relaxed guide-quote-word font-light">
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {tourGuides[active].toursCount}{" "}
                      {tourGuides[active].toursCount === 1 ? "Tour" : "Tours"}{" "}
                      Available
                    </motion.span>
                  </p>
                ) : (
                  <p className="text-xs sm:text-lg lg:text-xl leading-relaxed guide-quote-word font-light italic">
                    {tourGuides[active].quote?.split(" ").map((word, i) => (
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
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
