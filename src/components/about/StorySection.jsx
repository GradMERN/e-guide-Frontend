"use client";
import { CheckCircle } from "lucide-react";
import { DirectionAwareHoverImage } from "./DirectionAwareHoverImage";

export default function StorySection() {
  const features = [
    "Expert Local Guides",
    "Authentic Experiences",
    "Sustainable Tourism",
    "Small Group Tours",
  ];

  return (
    <section className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-stretch">
          <div className="fade-left relative rounded-2xl overflow-hidden h-full">
            <DirectionAwareHoverImage className="w-full h-full rounded-2xl" />
          </div>

          <div className="fade-right flex flex-col justify-center">
            <span className="inline-block text-xs md:text-sm tracking-[0.2em] text-[#FFD97F] uppercase font-medium mb-4 smooth-text">
              Our Story
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 leading-snug smooth-text">
              Preserving Egypt’s Past,
              <br />
              <span className="font-semibold bg-linear-to-r from-[#FFD97F] to-[#FFE6A0] bg-clip-text text-transparent">
                Crafting Unforgettable Journeys
              </span>
            </h2>

            <div className="text-gray-300 text-base md:text-lg leading-relaxed smooth-text mb-8">
              <p className="mb-3">
                Since 2025, we’ve dedicated ourselves to showcasing Egypt’s
                timeless history through immersive and responsible travel
                experiences.
              </p>
              <p>
                Our certified Egyptologists, passionate local guides, and
                commitment to sustainability ensure every journey feels
                authentic and memorable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
              {features.map((text, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-linear-to-br from-[#FFD97F] to-[#FFE6A0] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-black" />
                  </div>
                  <span className="text-white font-medium text-sm smooth-text">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
