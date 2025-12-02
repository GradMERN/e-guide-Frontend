import { MdOutlineTour } from "react-icons/md";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";

export default function TourPackagesSection() {
  return (
    <SectionWrapperFull>
      <TitlesHome
        icon={MdOutlineTour}
        title="Featured Tour Packages"
        paragraph="Discover curated tour packages designed to help you explore Egypt’s iconic landmarks, hidden gems, and unforgettable cultural experiences with ease and comfort."
      />


      
    </SectionWrapperFull>
  );
};