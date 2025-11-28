import { MdOutlineTour } from "react-icons/md";
import TitlesHome from "../common/TitlesHome";

export default function TourPackagesSection() {
  return (
    <section id="home">
      <div className="min-h-screen py-6 sm:py-6 px-4 md:px-8 lg:px-12">
        <TitlesHome
          icon={MdOutlineTour}
          title="Tour Packages"
          paragraph="Discover curated tour packages designed to help you explore Egypt’s iconic landmarks, hidden gems, and unforgettable cultural experiences with ease and comfort."
        />
      </div>
    </section>
  );
};