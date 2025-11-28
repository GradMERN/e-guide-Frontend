import { useTranslation } from "react-i18next";
import Hero from "../../components/hero.jsx";
import ImageSliderDemo from "../../components/home/HomeHeroSection.jsx";
import TourGuidesSection from "../../components/home/TourGuidesSection.jsx";
import PopularDestination from "../../components/home/PopularDestination.jsx";
import ReviewsSection from "../../components/home/ReviewsSection.jsx";
import TourPackagesSection from "../../components/home/TourPackagesSection.jsx";
import WhyChooseUsSection from "../../components/home/WhyChooseUsSection.jsx";
import GallerySection from "../../components/home/GallerySection.jsx";
import StayUpdatedSection from "../../components/home/StayUpdatedSection.jsx";
import HomeFAQSection from "../../components/home/HomeFAQSection.jsx";


const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className=" text-white ">
        <ImageSliderDemo />
        <PopularDestination />
        <TourPackagesSection />
        <TourGuidesSection></TourGuidesSection>
        <WhyChooseUsSection />
        <ReviewsSection />
        <GallerySection />
        <HomeFAQSection />
        <StayUpdatedSection />
      </div>
    </>
  );
};

export default Home;