import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function DestinationsGrid({ destinations, searchQuery }) {
    const [activeCard, setActiveCard] = useState(null);
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/destinations/${id}`);
    };

    if (destinations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-white/50">
                <FaSearch className="text-4xl mb-4 opacity-50" />
                <p>No destinations found matching "{searchQuery}"</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinations.map((destination, index) => (
                <motion.div key={destination.id} layout initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }} onHoverStart={() => setActiveCard(destination.id)} onHoverEnd={() => setActiveCard(null)}
                    onClick={() => handleCardClick(destination.id)}
                    className="group relative h-[450px] rounded-xl overflow-hidden cursor-pointer border border-white/5">
                    <motion.div animate={{ scale: activeCard === destination.id ? 1.1 : 1 }} transition={{ duration: 0.6 }} className="absolute inset-0">
                        <img src={destination.image} alt={destination.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent" />
                        <div className={`absolute inset-0 bg-linear-to-br ${destination.color} mix-blend-overlay`} />
                    </motion.div>

                    <div className="relative h-full flex flex-col justify-end p-6">
                        <div className="flex justify-between items-end">
                            <motion.h3 className="text-3xl font-bold text-white mb-2" animate={{ y: activeCard === destination.id ? -10 : 0 }} transition={{ duration: 0.3 }}>
                                {destination.name}
                            </motion.h3>
                            <div className="mb-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-tertiary text-sm font-bold border border-tertiary/20">
                                ★ {destination.rating}
                            </div>
                        </div>

                        <p className="text-white/80 text-sm mb-4">{destination.tagline}</p>

                        <AnimatePresence>
                            {activeCard === destination.id && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                    <p className="text-white/90 text-sm mb-4 leading-relaxed">{destination.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {destination.highlights.map((highlight, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-xl text-xs text-white">
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-white font-bold">Start from {destination.price} EGP</span>
                                        <motion.button whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCardClick(destination.id);
                                            }}
                                            className="flex items-center gap-2 text-tertiary font-semibold">
                                            Explore Now
                                            <FaArrowRight className="w-4 h-4 " />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.div className="absolute inset-0 border-2 border-white/0 rounded-xl pointer-events-none"
                        animate={{borderColor: activeCard === destination.id ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0)",}} transition={{ duration: 0.3 }}/>
                </motion.div>
            ))}
        </div>
    );
}