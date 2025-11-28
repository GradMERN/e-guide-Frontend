import { GiEgypt } from "react-icons/gi";
import TitlesHome from "../common/TitlesHome";

export default function PopularDestination() {
  return (
    <section id="home">
      <div className="min-h-screen py-12 sm:py-12 px-4 md:px-8 lg:px-12">
        <TitlesHome
          icon={GiEgypt}
          title="Popular Destination"
          paragraph="Discover essential insights to guide your adventure across the timeless land of PEACE, where history, culture, and breathtaking beauty meet."
        />
      </div>
    </section>
  );
};