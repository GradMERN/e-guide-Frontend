import { MdOutlineReviews } from "react-icons/md";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";

export default function ReviewsSection() {
  return (
    <SectionWrapperFull>
      <TitlesHome
        icon={MdOutlineReviews}
        title="Traveler Reviews"
        paragraph="Real experiences shared by travelers who explored the wonders of Egypt — stories that bring each destination to life with authentic insights and memorable moments."
      />


      
    </SectionWrapperFull>
  );
};
