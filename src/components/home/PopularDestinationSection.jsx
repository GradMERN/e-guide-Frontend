import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiEgypt } from "react-icons/gi";
import { motion, AnimatePresence } from "motion/react";
import { FaArrowRight } from "react-icons/fa";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";
import { useTranslation } from "react-i18next";

export default function PopularDestinationSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);
  const sliderRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const updateConstraints = () => {
      if (sliderRef.current) {
        const scrollWidth = sliderRef.current.scrollWidth;
        const offsetWidth = sliderRef.current.offsetWidth;
        setDragConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
      }
    };
    updateConstraints();
    window.addEventListener("resize", updateConstraints);
    return () => window.removeEventListener("resize", updateConstraints);
  }, []);

  const destinations = [
    {
      id: 1,
      name: "Cairo",
      tagline: "City of a Thousand Minarets",
      description:
        "Explore ancient pyramids, bustling bazaars, and the Egyptian Museum's treasures.",
      image: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800",
      highlights: ["Pyramids of Giza", "Egyptian Museum", "Khan El-Khalili"],
    },
    {
      id: 2,
      name: "Luxor",
      tagline: "World's Greatest Open-Air Museum",
      description:
        "Walk through the Valley of Kings and marvel at ancient temples along the Nile.",
      image: "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800",
      highlights: ["Karnak Temple", "Valley of Kings", "Hot Air Balloons"],
    },
    {
      id: 3,
      name: "Aswan",
      tagline: "Gateway to Nubian Culture",
      description:
        "Cruise the Nile, visit Abu Simbel temples, and experience authentic Nubian hospitality.",
      image: "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800",
      highlights: ["Abu Simbel", "Philae Temple", "Nubian Villages"],
    },
    {
      id: 4,
      name: "Alexandria",
      tagline: "Pearl of the Mediterranean",
      description:
        "Discover coastal charm, ancient libraries, and Mediterranean cuisine by the sea.",
      image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800",
      highlights: ["Bibliotheca", "Qaitbay Citadel", "Corniche"],
    },
    {
      id: 5,
      name: "Hurghada",
      tagline: "Red Sea Paradise",
      description:
        "Dive into crystal-clear waters, vibrant coral reefs, and endless beach resorts.",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      highlights: ["Coral Reefs", "Beach Resorts", "Water Sports"],
    },
    {
      id: 6,
      name: "Siwa Oasis",
      tagline: "Desert Paradise",
      description:
        "Experience tranquility in palm groves, natural springs, and ancient fortresses.",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800",
      highlights: ["Cleopatra Spring", "Shali Fortress", "Salt Lakes"],
    },
  ];

  const handleExploreDestination = (destinationId) => {
    navigate(`/destinations/${destinationId}`);
  };

  const handleViewAllDestinations = () => {
    navigate("/destinations");
  };

  return (
    <SectionWrapperFull>
      <div className="mt-12">
        <TitlesHome icon={GiEgypt} title={t("popularDestination.title")} paragraph={t("popularDestination.description")}/>

        <div className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-8 max-w-7xl mx-auto">
          {destinations.map((destination, index) => (
            <motion.div key={destination.id} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ duration: 0.3, delay: index * 0.08 }} onHoverStart={() => setActiveCard(destination.id)} onHoverEnd={() => setActiveCard(null)} className="group relative h-[450px] card-3d rounded-xl overflow-hidden cursor-pointer" >
              <motion.div animate={{ scale: activeCard === destination.id ? 1.1 : 1}} transition={{ duration: 0.6 }} className="absolute inset-0">
                <img src={destination.image} alt={destination.name} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
              </motion.div>

              <div className="relative h-full flex flex-col justify-end p-6">
                <motion.h3 className="text-3xl xl:text-4xl font-bold text-white mb-2" animate={{ y: activeCard === destination.id ? -10 : 0 }} transition={{ duration: 0.3 }}>
                  {destination.name}
                </motion.h3>
                <p className="text-white/80 text-sm mb-4">{destination.tagline}</p>

                <AnimatePresence>
                  {activeCard === destination.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                      <p className="text-white/90 text-sm mb-4 leading-relaxed">
                        {destination.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {destination.highlights.map((highlight, idx) => (
                          <span key={idx} className="px-3 py-1 bg-white/20 rounded-xl text-xs text-white">
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <motion.button onClick={() => handleExploreDestination(destination.id)} whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-2 text-tertiary font-semibold">
                        Explore Now <FaArrowRight className="w-4 h-4 " />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:hidden max-w-full mx-auto overflow-hidden">
          <motion.div ref={sliderRef} className="flex gap-4 py-4 px-2 cursor-grab active:cursor-grabbing" drag="x" dragConstraints={dragConstraints} dragElastic={0.18}>
            {destinations.map((destination) => (
              <motion.div key={destination.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }} className="relative w-[260px] xs:w-[260px] sm:w-[300px] h-[260px] xs:h-[300px] sm:h-[340px] rounded-xl overflow-hidden shrink-0" whileTap={{ scale: 0.96 }}>
                <img src={destination.image} alt={destination.name} className="absolute inset-0 w-full h-full object-cover"/>

                <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

                <div className="relative h-full flex flex-col justify-end p-4">
                  <h3 className="text-xl font-bold text-white mb-1"> {destination.name}</h3>
                  <div className="min-h-[55px] flex flex-col justify-between mb-3">
                    <p className="text-white/80 text-xs">{destination.tagline}</p>
                    <p className="text-white/90 text-[11px] line-clamp-2 leading-relaxed">{destination.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {destination.highlights.map((highlight, idx) => (
                      <span key={idx} className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[9px] text-white">
                        {highlight}
                      </span>
                    ))}
                  </div>

                  <motion.button onClick={() => handleExploreDestination(destination.id)} whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-1 text-xs font-semibold text-tertiary">
                    Explore <FaArrowRight className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.2 }} className="text-center mt-8 sm:mt-12 lg:mt-16 px-4">
          <motion.button className="btn-split w-full sm:w-auto">
            <span className="btn-split-main">{t("popularDestination.viewAll")}</span>
            <span className="btn-split-icon">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </SectionWrapperFull>
  );
}