import { useTranslation } from "react-i18next";
import ImageSliderDemo from "../../components/home/HomeHeroSection.jsx";
import TourGuidesSection from "../../components/home/TourGuidesSection.jsx";
import PopularDestinationSection from "../../components/home/PopularDestinationSection.jsx";
import ReviewsSection from "../../components/home/ReviewsSection.jsx";
import TourPackagesSection from "../../components/home/TourPackagesSection.jsx";
import WhyChooseUsSection from "../../components/home/WhyChooseUsSection.jsx";
import GallerySection from "../../components/home/GallerySection.jsx";
import HomeFAQSection from "../../components/home/HomeFAQSection.jsx";
import CityLoopSection from "../../components/home/CitiyLoopSection.jsx";
import VisitEgyptSection from "../../components/home/VisitEgyptSection.jsx";


const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <div>
        <ImageSliderDemo />
        <CityLoopSection />
        <PopularDestinationSection />
        <TourPackagesSection />
        <TourGuidesSection></TourGuidesSection>
        <VisitEgyptSection />
        <ReviewsSection />
        <WhyChooseUsSection />
        <GallerySection />
        <HomeFAQSection />
      </div>
    </>
  );
};

export default Home;