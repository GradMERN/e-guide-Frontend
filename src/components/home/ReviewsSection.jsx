import { MdOutlineReviews } from "react-icons/md";
import TitlesHome from "../common/TitlesHome";

export default function ReviewsSection() {
  return (
    <section id="home">
      <div className="min-h-screen py-6 sm:py-6 px-4 md:px-8 lg:px-12">
        <TitlesHome
          icon={MdOutlineReviews}
          title="Traveler Reviews"
          paragraph="Real experiences shared by travelers who explored the wonders of Egypt — stories that bring each destination to life with authentic insights and memorable moments."
        />
      </div>
    </section>
  );
};
