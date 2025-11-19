import CircularGallery from "../ui/CircularGallery";
import "../../styles/CircularGallery.css";

export default function CircularGallerySection() {
  return (
    <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
      <CircularGallery
        bend={2}
        textColor="#000"
        borderRadius={0.05}
        scrollEase={0.05}
        scrollSpeed={1.5}
      />
    </div>
  );
}