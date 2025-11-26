import { useTranslation } from "react-i18next";
import Hero from "../../components/hero.jsx";
import ImageSliderDemo from "../../components/home/HomeHeroSection.jsx";
import FAQSection from "../../components/home/FAQSection.jsx";
import TourGuidesSection from "../../components/home/TourGuidesSection.jsx";


const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className=" text-white bg-[#020406]">
        <ImageSliderDemo />
        {/* <Hero/> */}
        <TourGuidesSection></TourGuidesSection>
        <FAQSection />
      </div>
    </>
  );
};

export default Home;