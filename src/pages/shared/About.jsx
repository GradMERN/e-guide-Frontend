import CircularGallerySection from "../../components/about/CircularGallerySection.jsx";
import DifferencesSection from "../../components/about/DifferencesSection.jsx";
import AboutHeroSection from "../../components/about/AboutHeroSection.jsx";
import StatsSection from "../../components/about/StatsSection.jsx";
import StorySection from "../../components/about/StorySection.jsx";
import ValuesSection from "../../components/about/ValuesSection.jsx";


export default function About() {

  return (
    <div>
      <AboutHeroSection />
      <StorySection />
      <ValuesSection />
      <CircularGallerySection />
      <StatsSection />
      <DifferencesSection />
    </div>
  );
}