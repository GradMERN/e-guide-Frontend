import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Star, MapPin, Languages, Award, BadgeCheck, BookOpen, Sparkles, CheckCircle2, Crown } from "lucide-react";
import guide1 from '../../assets/images/guide1.avif';
import guide2 from '../../assets/images/guide2.avif';
import guide3 from '../../assets/images/guide3.avif';
import TourCard from "../tours/TourCard";
import TourGuideNotFoundScreen from "./TourGuideNotFoundScreen";
import LoadingScreen from "../common/LoadingScreen";


const GUIDES_DATA = {
    "yassen samy": {
        name: "Yassen Samy",
        designation: "Egyptologist & Historian",
        image: guide1,
        cover: "https://images.unsplash.com/photo-1568603417739-95a3ee515c00?q=80&w=1600&auto=format&fit=crop",
        rating: 4.9,
        reviews: 124,
        languages: ["English", "Arabic", "French"],
        bio: "I don't just show you stones; I tell you the stories they witnessed. Specializing in Old Kingdom history and hidden tomb secrets. Join me for an unforgettable journey through time.",
        whyChooseMe: [
            { title: "Storyteller", desc: "History turned into engaging stories." },
            { title: "Photo Pro", desc: "I know the secret angles for photos." },
            { title: "Local Access", desc: "Access to places standard tours miss." }
        ],
        tours: [
            { _id: 1, name: "Pyramids VIP Private Tour", city: "Giza", price: 120, currency: "$", duration: 6, maxGroupSize: 4, ratingsAverage: 5.0, image: "https://images.unsplash.com/photo-1539650116455-8ef84f04245c?w=500" },
            { _id: 2, name: "Saqqara & Memphis Day Trip", city: "Cairo", price: 90, currency: "$", duration: 5, maxGroupSize: 8, ratingsAverage: 4.8, image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500" }
        ],
        reviewsList: []
    },
    "ahmed samy": {
        name: "Ahmed Samy",
        designation: "Heritage Expert",
        image: guide2,
        cover: "https://images.unsplash.com/photo-1572252009289-9d53c6d99a47?q=80&w=1600&auto=format&fit=crop",
        rating: 4.8,
        reviews: 56,
        languages: ["English", "Arabic", "Italian"],
        bio: "Passionate about Islamic Cairo and the hidden architectural gems of the city. I love connecting travelers with the authentic daily life of Egyptians.",
        whyChooseMe: [
            { title: "Foodie", desc: "Best hidden food spots in Downtown." },
            { title: "Architecture", desc: "I explain details others ignore." }
        ],
        tours: [
            { _id: 1, name: "Hidden Gems of Islamic Cairo", city: "Old Cairo", price: 50, currency: "$", duration: 4, maxGroupSize: 10, ratingsAverage: 4.9, image: "https://images.unsplash.com/photo-1553913861-c0fdd52614d6?w=500" },
            { _id: 2, name: "Downtown Cairo Food Crawl", city: "Downtown", price: 65, currency: "$", duration: 3, maxGroupSize: 12, ratingsAverage: 5.0, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500" }
        ],
        reviewsList: [
            { user: "David B.", comment: "Yacin knows the best food spots!", rating: 5 },
            { user: "Anna K.", comment: "A very friendly and knowledgeable guide.", rating: 4.5 }
        ]
    },
    "omar fayed": {
        name: "Omar Fayed",
        designation: "Heritage Expert",
        image: guide3,
        cover: "https://images.unsplash.com/photo-1572252009289-9d53c6d99a47?q=80&w=1600&auto=format&fit=crop",
        rating: 4.8,
        reviews: 56,
        languages: ["English", "Arabic", "Italian"],
        bio: "Passionate about Islamic Cairo and the hidden architectural gems of the city. I love connecting travelers with the authentic daily life of Egyptians.",
        whyChooseMe: [
            { title: "Foodie", desc: "Best hidden food spots in Downtown." },
            { title: "Architecture", desc: "I explain details others ignore." }
        ],
        tours: [
            { _id: 1, name: "Hidden Gems of Islamic Cairo", city: "Old Cairo", price: 50, currency: "$", duration: 4, maxGroupSize: 10, ratingsAverage: 4.9, image: "https://images.unsplash.com/photo-1553913861-c0fdd52614d6?w=500" },
            { _id: 2, name: "Downtown Cairo Food Crawl", city: "Downtown", price: 65, currency: "$", duration: 3, maxGroupSize: 12, ratingsAverage: 5.0, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500" }
        ],
        reviewsList: [
            { user: "David B.", comment: "Yacin knows the best food spots!", rating: 5 },
            { user: "Anna K.", comment: "A very friendly and knowledgeable guide.", rating: 4.5 }
        ]
    },
};


const StatBadge = ({ icon, text, sub }) => (
    <div className="flex items-center gap-1.5 guide-profile-icon bg-glass-bg px-2.5 py-1.5 rounded-full border border-glass-border shrink-0 max-w-full">
        <span className="shrink-0">{icon}</span>
        <span className="text-[10px] sm:text-xs font-medium truncate">{text}</span>
        {sub && <span className="text-[10px] text-gray-500 hidden sm:inline">{sub}</span>}
    </div>
);

const TabButton = ({ active, onClick, label }) => (
    <button onClick={onClick} className={`flex-1 min-w-[100px] pb-4 pt-2 text-sm font-bold transition-colors relative text-center whitespace-nowrap ${active ? "guide-profile-tab" : "text-gray-500 hover:text-gray-300"}`}>
        {label}
        {active && <motion.div layoutId="tabLine" className="absolute bottom-0 left-0 right-0  guide-profile-line" />}
    </button>
);

export default function TourGuideProfile() {
    const { name } = useParams();
    const navigate = useNavigate();
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setGuide(GUIDES_DATA[name?.toLowerCase()] || null);
            setLoading(false);
        }, 1000);
    }, [name]);

    if (loading) return <LoadingScreen />;
    if (!guide) return <TourGuideNotFoundScreen navigate={navigate} />;

    return (

        <div className="min-h-screen  guide-profile-bg  font-sans pb-24 selection:bg-[#C7A15C] selection:text-black overflow-x-hidden">


            <div className="relative h-[30vh] sm:h-[40vh] w-full guide-profile-bg">
                <img src={guide.cover} alt="Cover" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0" />
            </div>

            <div className="max-w-4xl mx-auto px-3 sm:px-6 relative -mt-30 z-10">


                <div className="flex flex-wrap md:flex-nowrap gap-4 items-end mb-8">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative shrink-0 mx-auto md:mx-0">
                        <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-4 sm:border-[6px] border-neutral-950 overflow-hidden shadow-2xl bg-neutral-800">
                            <img src={guide.image} alt={guide.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-[#C7A15C] text-black p-1.5 rounded-full border-[3px] border-neutral-950 shadow-lg">
                            <Award size={14} className="sm:w-5 sm:h-5" />
                        </div>
                    </motion.div>

                    <div className="pb-1 text-center md:text-left flex-1 min-w-0 w-full">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold guide-profile-title tracking-tight wrap-break-word leading-tight">{guide.name}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1 mb-3">
                            <span className="guide-profile-icon text-[10px] sm:text-xs font-bold uppercase tracking-widest">{guide.designation}</span>
                            <BadgeCheck size={14} className="guide-profile-icon" />
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 ">
                            <StatBadge icon={<Star size={10} className="guide-profile-icon" />} text={guide.rating} sub={`(${guide.reviews})`} />
                            <StatBadge icon={<MapPin size={10} className="guide-profile-icon" />} text="Cairo" />
                            <StatBadge icon={<Languages size={10} className="guide-profile-icon" />} text={`${guide.languages?.length || 0} Langs`} />
                        </div>
                    </div>
                </div>


                <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5  pt-2 mb-8">
                    <div className="flex w-full overflow-x-auto no-scrollbar gap-2 sm:gap-0 ">
                        <TabButton className="" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Overview" />
                        <TabButton active={activeTab === "reviews"} onClick={() => setActiveTab("reviews")} label={`Reviews (${guide.reviews})`} />
                    </div>
                </div>


                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-12 ">

                            <section>
                                <h3 className="text-lg md:text-2xl font-bold guide-profile-title mb-3 flex items-center gap-2 ">
                                    <BookOpen size={18} className="guide-profile-icon" /> Biography
                                </h3>
                                <p className="guide-profile-subtitle leading-relaxed font-light text-sm sm:text-lg wrap-break-word">{guide.bio}</p>
                            </section>


                            <section>
                                <h3 className="text-lg md:text-2xl font-bold guide-profile-title mb-4 flex items-center gap-2">
                                    <Sparkles size={18} className="guide-profile-icon" /> Why Choose Me?
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {guide.whyChooseMe?.map((item, i) => (
                                        <div key={i} className="bg-linear-to-br from-white/5 to-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-[#C7A15C]/30 transition-colors">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="bg-[#C7A15C]/10 p-2 rounded-lg guide-profile-icon mt-0.5">
                                                    <CheckCircle2 size={16} className="guide-profile-icon shrink-0" />
                                                </div>
                                                <h4 className="guide-profile-title font-bold text-sm truncate">{item.title}</h4>
                                            </div>
                                            <p className="guide-profile-subtitle text-xs leading-relaxed wrap-break-word">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>


                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <Crown size={24} className="guide-profile-icon" />
                                    <h3 className="text-lg md:text-2xl font-bold guide-profile-title">Top 3 Tours</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
                                    {guide.tours?.slice(0, 3).map(tour => <TourCard key={tour._id} tour={tour} />)}
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {activeTab === "reviews" && (
                        <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 max-w-3xl mx-auto">
                            <div className="flex flex-col items-center justify-center gap-2  bg-glass-bg p-6 rounded-3xl border border-glass-border mb-8 text-center">
                                <div className="text-5xl font-bold text-[#C7A15C]">{guide.rating}</div>
                                <div>
                                    <div className="flex justify-center text-[#C7A15C] mb-2">{[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}</div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wide">{guide.reviews} Verified Reviews</p>
                                </div>
                            </div>

                            {guide.reviewsList?.length > 0 ? guide.reviewsList.map((r, i) => (
                                <div key={i} className="guide-content-card p-5 rounded-2xl  border ">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold guide-profile-title  text-sm">{r.user}</span>
                                        <div className="flex text-[#C7A15C]"><Star size={12} fill="currentColor" /></div>
                                    </div>
                                    <p className="guide-profile-subtitle text-xs sm:text-sm italic wrap-break-word">"{r.comment}"</p>
                                </div>
                            )) : (
                                <div className="text-gray-500 italic py-10 text-center border border-dashed border-white/10 rounded-2xl text-sm">
                                    No detailed reviews yet.
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
