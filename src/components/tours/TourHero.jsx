import React from "react";

import nileCruiseImage from "../../assets/images/tours/Nile.jpg";
import islamicCairoImage from "../../assets/images/tours/islamic.jpg";

const TourHero = () => {
  const images = {
    pyramids:
      "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    nileCruise: nileCruiseImage,
    islamicCairo: islamicCairoImage,
  };

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-6">
            <span className="text-xl">✨</span>
            <span className="text-sm font-medium text-text">
              Premium Tour Experiences
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-text">
            Discover Egypt's
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              Timeless Wonders
            </span>
          </h1>

          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Journey through 5,000 years of history with expert guides. From
            ancient pyramids to Nile cruises, experience the magic of Egypt like
            never before.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
              <span className="text-2xl">🏛️</span>
              <div>
                <p className="text-xs text-text-muted">Explore</p>
                <p className="font-bold text-text">50+ Sites</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-xs text-text-muted">Rated</p>
                <p className="font-bold text-text">4.8/5.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-xs text-text-muted">Travelers</p>
                <p className="font-bold text-text">50K+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Large Card - Pyramids */}
          <div className="col-span-2 bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary transition-all group">
            <div className="relative h-64">
              <img
                src={images.pyramids}
                alt="Ancient Pyramids of Giza"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white mb-1">
                  Ancient Pyramids
                </h3>
                <p className="text-sm text-gray-200">Giza & Saqqara</p>
              </div>
            </div>
          </div>

          {/* Small Card 1 - Nile Cruise */}
          <div className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary transition-all group">
            <div className="relative h-48">
              <img
                src={images.nileCruise}
                alt="Nile Cruise"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => handleImageError(e, "nileCruise")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold text-white">Nile Cruise</h3>
                <p className="text-xs text-gray-200">River Tours</p>
              </div>
            </div>
          </div>

          {/* Small Card 2 - Islamic Cairo */}
          <div className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary transition-all group">
            <div className="relative h-48">
              <img
                src={images.islamicCairo}
                alt="Islamic Cairo Heritage"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => handleImageError(e, "islamicCairo")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold text-white">Heritage</h3>
                <p className="text-xs text-gray-200">Islamic Cairo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourHero;
