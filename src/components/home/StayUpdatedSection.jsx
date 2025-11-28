import { GrUpdate } from "react-icons/gr";
import TitlesHome from "../common/TitlesHome";

export default function StayUpdatedSection() {
  return (
    <section id="home">
      <div className="min-h-screen py-6 sm:py-6 px-4 md:px-8 lg:px-12">
        <TitlesHome
          icon={GrUpdate}
          title="Stay Updated"
          paragraph="Subscribe to the latest news, travel insights, and special offers to make the most of your journey through Egypt. Never miss an update that could inspire your next adventure."
        />
      </div>
    </section>
  );
};