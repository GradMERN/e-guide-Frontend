import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

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
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const stats = [
    { icon: Users, value: "150+", label: "Happy Users" },
    { icon: Award, value: "1", label: "Year Experience" },
    { icon: MapPin, value: "5", label: "Destinations" },
    { icon: Star, value: "4.8", label: "Average Rating" },
  ];

  const values = [
    { icon: Heart, title: "Passion", description: "We love what we do." },
    { icon: Globe, title: "Authenticity", description: "Real experiences." },
    { icon: Users, title: "Community", description: "Supporting locals." },
    { icon: Award, title: "Excellence", description: "High standards." },
    {icon: Clock, title: "Flexibility", description: "Trips designed around your pace.",},
    { icon: CheckCircle, title: "Trust", description: "Transparent pricing." },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <section data-aos="fade-down">
        <HeroSection />
      </section>

      <section>
        <StorySection />
      </section>

      <section data-aos="fade-left" data-aos-delay="150">
        <ValuesSection values={values} />
      </section>

      <section data-aos="fade-up" data-aos-delay="350">
        <CircularGallerySection />
      </section>

      <section data-aos="fade-right" data-aos-delay="250">
        <StatsSection stats={stats} />
      </section>

      <section data-aos="fade-up" data-aos-delay="500">
        <CTASection />
      </section>
    </div>
  );
}
