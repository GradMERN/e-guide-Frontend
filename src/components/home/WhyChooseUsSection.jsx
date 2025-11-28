import { TbPyramid } from "react-icons/tb";
import TitlesHome from "../common/TitlesHome";

export default function WhyChooseUsSection() {
  return (
    <section id="home">
      <div className="min-h-screen py-6 sm:py-6 px-4 md:px-8 lg:px-12">
        <TitlesHome
          icon={TbPyramid}
          title="Why Choose Us"
          paragraph="We provide exceptional travel experiences through trusted service, professional guidance, and tailored journeys designed to make your exploration of Egypt smooth, memorable, and truly unique."
        />
      </div>
    </section>
  );
};