import { GrGallery } from "react-icons/gr";
import TitlesHome from "../common/TitlesHome";

export default function GallerySection() {
  return (
    <section className="min-h-screen py-6 sm:py-6 px-4 md:px-8 lg:px-12">
        <TitlesHome
          icon={GrGallery}
          title="Gallery"
          paragraph="Explore a curated collection of stunning moments captured across Egypt — showcasing its rich heritage, vibrant culture, and unforgettable landscapes."
        />
    </section>
  );
};