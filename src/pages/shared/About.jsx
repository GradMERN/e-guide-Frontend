import CircularGallerySection from "../../components/about/CircularGallerySection.jsx";
import CTASection from "../../components/about/CTASection.jsx";
import AboutHeroSection from "../../components/about/AboutHeroSection.jsx";
import StatsSection from "../../components/about/StatsSection.jsx";
import StorySection from "../../components/about/StorySection.jsx";
import ValuesSection from "../../components/about/ValuesSection.jsx";

import {Users,Award,MapPin,Star,Heart,Globe,Clock,CheckCircle,} from "lucide-react";

export default function About() {


  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Happy Travelers",
      color: "text-amber-400",
    },
    {
      icon: Award,
      value: "15+",
      label: "Years Experience",
      color: "text-orange-400",
    },
    {
      icon: MapPin,
      value: "100+",
      label: "Destinations",
      color: "text-yellow-400",
    },
    {
      icon: Star,
      value: "4.9",
      label: "Average Rating",
      color: "text-amber-300",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Heritage",
      description:
        "Every journey is crafted with deep reverence for Egypt's 5,000-year legacy, bringing ancient wonders to life through expert storytelling.",
      linear: "from-rose-500/20 to-pink-500/20",
    },
    {
      icon: Globe,
      title: "Authentic Connections",
      description:
        "Experience Egypt beyond the guidebooks—intimate encounters with local artisans, hidden archaeological gems, and centuries-old traditions.",
      linear: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: Users,
      title: "Cultural Stewardship",
      description:
        "We partner with local communities to ensure tourism preserves heritage sites and empowers Egyptian families for generations.",
      linear: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Award,
      title: "Excellence Guaranteed",
      description:
        "From luxury accommodations to expert Egyptologists, every detail meets our uncompromising standards of quality and safety.",
      linear: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: Clock,
      title: "Your Journey, Your Way",
      description:
        "Flexible itineraries designed around your interests—whether ancient temples, desert adventures, or culinary discoveries.",
      linear: "from-violet-500/20 to-purple-500/20",
    },
    {
      icon: CheckCircle,
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
      <CTASection />
    </div>
  );
}