import CircularGallery from "../ui/CircularGallery";
import Particles from "../ui/Particles.jsx";
import "../../styles/CircularGallery.css";

export default function CircularGallerySection() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <Particles
          particleColors={["#FFE6A0", "#FFD27F"]}
          particleCount={500}
          particleSpread={15}
          speed={0.09}
          particleBaseSize={250}
          cameraDistance={30}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-8 relative z-10 fade-up">
        <span className="inline-block text-sm tracking-[0.3em] text-[#FFD97F] uppercase font-medium mb-4 smooth-text">
          Traveler Highlights
        </span>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-4 smooth-text">
          Explore Egypt Through
          <span className="font-semibold bg-linear-to-r from-[#FFD97F] to-[#FFE6A0] bg-clip-text text-transparent">
            Our Travelers' Stories
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
