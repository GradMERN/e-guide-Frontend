import { useEffect, useState } from "react";

import CircularGallerySection from "../../components/about/CircularGallerySection.jsx";
import CTASection from "../../components/about/CTASection.jsx";
import HeroSection from "../../components/about/HeroSection.jsx";
import StatsSection from "../../components/about/StatsSection.jsx";
import StorySection from "../../components/about/StorySection.jsx";
import ValuesSection from "../../components/about/ValuesSection.jsx";

import {
  Users,
  Award,
  MapPin,
  Star,
  Heart,
  Globe,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function About() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3],
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
          entry.target.classList.add("in-view");
        } else if (!entry.isIntersecting) {
          entry.target.classList.remove("in-view");
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(".fade-up, .fade-left, .fade-right")
      .forEach((el) => {
        observer.observe(el);
      });

    return () => observer.disconnect();
  }, []);

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
    <div
      className="relative text-white overflow-hidden"
      style={{
        background: `
    linear-gradient(
      to bottom,
      #0B192C 0%,    /* top dark navy */
      #0E1A33 15%,   /* slightly lighter navy */
      #091626 30%,   /* deep blue */
      #121217 45%,   /* dark purple/blue */
      #0F0B08 60%,   /* brownish black */
      #050404 75%,   /* near black */
      #000000 90%,   /* solid black */
      #000000 100%   /* bottom */
    )
  `,
      }}
    >
      <style>{`
        .fade-up, .fade-left, .fade-right {
          opacity: 0;
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                      transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .fade-up { transform: translateY(50px); }
        .fade-left { transform: translateX(-50px); }
        .fade-right { transform: translateX(50px); }
        .fade-up.in-view, .fade-left.in-view, .fade-right.in-view {
          opacity: 1;
          transform: translate(0, 0);
        }
        .smooth-text {
          font-feature-settings: 'liga' 1, 'calt' 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        .glass-effect {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hover-lift {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease;
        }
        .hover-lift:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 60px rgba(199, 161, 92, 0.3);
        }
        .linear-border { position: relative; }
        .linear-border::before {
          content: '';
          position: absolute;
          inset: 0;
          padding: 1px;
          background: linear-linear(135deg, #E2C784, #C7A15C, #FFD27F);
          -webkit-mask: linear-linear(#fff 0 0) content-box, linear-linear(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        .linear-border:hover::before { opacity: 1; }
      `}</style>

      <HeroSection  />
      <StorySection />
      <ValuesSection values={values} />
      <CircularGallerySection />
      <StatsSection stats={stats} />
      <CTASection />
    </div>
  );
}
