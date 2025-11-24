import { useTranslation } from "react-i18next";
import Hero from "../../components/hero.jsx";
import FAQSection from "../../components/home/FAQSection.jsx";
import TourGuidesSection from "../../components/home/TourGuidesSection.jsx";


const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <Hero />
      <div
        className="text-white overflow-hidden"
        style={{ background: `linear-gradient(to bottom,#0B192C 0%, #0C1B2F 7%, #0D1C32 14%, #0E1D35 21%, #0F1E38 28%, #101F3B 35%,#111F3D 42%,#121F40 49%,#131F43 56%,#141F46 63%,#151F49 70%,#161F4C 77%,#171F4F 84%,#181F52 91%,#000000 100%)` }}>
        <TourGuidesSection></TourGuidesSection>
        <FAQSection />
      </div>
    </>
  );
};

export default Home;
