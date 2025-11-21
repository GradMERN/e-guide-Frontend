import CircularGallery from "../ui/CircularGallery";
import "../../styles/CircularGallery.css";

export default function CircularGallerySection() {
  return (
    <section
      className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-[#FFE6A0] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.3, // slightly brighter sparkle
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-8 relative z-10 fade-up">
        <span className="inline-block text-sm tracking-[0.3em] text-[#FFD97F] uppercase font-medium mb-4 smooth-text">
          Traveler Highlights
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-4 smooth-text">
          Explore Egypt Through{" "}
          <span className="font-semibold bg-linear-to-r from-[#FFD97F] to-[#FFE6A0] bg-clip-text text-transparent">
            Our Travelers’ Stories
          </span>
        </h2>
        <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto smooth-text leading-relaxed">
          A visual journey of the most memorable moments from our tours
        </p>
      </div>

      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] z-10">
        <CircularGallery
          bend={2}
          textColor="#FFE6A0" 
          borderRadius={0.05}
          scrollEase={0.05}
          scrollSpeed={1.5}
        />
      </div>
    </section>
  );
}
