import CircularGallerySection from "../../components/about/CircularGallerySection.jsx";
import DifferencesSection from "../../components/about/DifferencesSection.jsx";
import AboutHeroSection from "../../components/about/AboutHeroSection.jsx";
import StatsSection from "../../components/about/StatsSection.jsx";
import StorySection from "../../components/about/StorySection.jsx";
import ValuesSection from "../../components/about/ValuesSection.jsx";

import { LuUsers } from "react-icons/lu";
import { FaAward } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { IoStarOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { IoIosGlobe } from "react-icons/io";
import { FaRegClock } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";


export default function About() {

  const stats = [
    {
      icon: LuUsers,
      value: "50K+",
      label: "Happy Travelers",
      color: "text-amber-400",
    },
    {
      icon: FaAward,
      value: "15+",
      label: "Years Experience",
      color: "text-orange-400",
    },
    {
      icon: FiMapPin,
      value: "100+",
      label: "Destinations",
      color: "text-yellow-400",
    },
    {
      icon: IoStarOutline,
      value: "4.9",
      label: "Average Rating",
      color: "text-amber-300",
    },
  ];

  const values = [
    {
      icon: FaRegHeart,
      title: "Passion for Heritage",
      description:
        "Every journey is crafted with deep reverence for Egypt's 5,000-year legacy, bringing ancient wonders to life through expert storytelling.",
      linear: "from-rose-500/20 to-pink-500/20",
    },
    {
      icon: IoIosGlobe,
      title: "Authentic Connections",
      description:
        "Experience Egypt beyond the guidebooks—intimate encounters with local artisans, hidden archaeological gems, and centuries-old traditions.",
      linear: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: LuUsers,
      title: "Cultural Stewardship",
      description:
        "We partner with local communities to ensure tourism preserves heritage sites and empowers Egyptian families for generations.",
      linear: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: FaAward,
      title: "Excellence Guaranteed",
      description:
        "From luxury accommodations to expert Egyptologists, every detail meets our uncompromising standards of quality and safety.",
      linear: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: FaRegClock,
      title: "Your Journey, Your Way",
      description:
        "Flexible itineraries designed around your interests—whether ancient temples, desert adventures, or culinary discoveries.",
      linear: "from-violet-500/20 to-purple-500/20",
    },
    {
      icon: FaRegCheckCircle,
      title: "Trust & Transparency",
      description:
        "Clear pricing with no hidden fees, comprehensive travel insurance, and 24/7 support throughout your Egyptian odyssey.",
      linear: "from-cyan-500/20 to-blue-500/20",
    },
  ];

  return (
    <div>
      <AboutHeroSection />
      <StorySection />
      <ValuesSection values={values} />
      <CircularGallerySection />
      <StatsSection stats={stats} />
      <DifferencesSection />
    </div>
  );
}