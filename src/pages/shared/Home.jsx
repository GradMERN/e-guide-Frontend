import { useTranslation } from "react-i18next";
import Hero from "../../components/hero.jsx";
import FAQSection from "../../components/home/FAQSection.jsx";
import TourGuidesSection from "../../components/home/TourGuidesSection.jsx";


const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Hero />
      <div className=" text-white bg-[#020406]">
        <TourGuidesSection></TourGuidesSection>
        <FAQSection />
      </div>
    </>
  );
};

export default Home;
