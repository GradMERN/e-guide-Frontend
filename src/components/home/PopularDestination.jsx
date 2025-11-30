import { GiEgypt } from "react-icons/gi";
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";

export default function PopularDestination() {
  return (
    <SectionWrapperFull>
      <div className="mt-12">
        <TitlesHome
          icon={GiEgypt}
          title="Popular Destination"
          paragraph="Discover essential insights to guide your adventure across the timeless land of PEACE, where history, culture, and breathtaking beauty meet."
        />


        
      </div>
    </SectionWrapperFull>
  );
};