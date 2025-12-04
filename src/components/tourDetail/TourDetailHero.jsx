import React from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaSignal,
} from "react-icons/fa";

const TourDetailHero = ({ tour }) => {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[500px] rounded-3xl overflow-hidden border border-border">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-tertiary/20">
          {tour.mainImage?.url ? (
            <img
              src={tour.mainImage.url}
              alt={tour.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-9xl">🏛️</div>
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent"></div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl">
            {/* Category & Difficulty Badges */}
            <div className="flex flex-wrap gap-3 mb-4">
              {/* Category Badges */}
              {tour.categories?.slice(0, 2).map((category, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 backdrop-blur-sm border border-primary/30 text-sm font-medium text-text"
                >
                  {category}
                </div>
              ))}
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-text mb-4">
              {tour.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-text-secondary">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <FaStar className="text-primary" size={14} />
                </div>
                <span className="font-semibold text-text">
                  {tour.rating?.toFixed(1)}
                </span>
                <span className="text-sm">({tour.ratingsCount} reviews)</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-secondary/10">
                  <FaMapMarkerAlt className="text-secondary" size={14} />
                </div>
                <span>
                  {tour.place?.city || "Unknown"},{" "}
                  {tour.place?.country || "Egypt"}
                </span>
              </div>

              {tour.duration && (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-tertiary/10">
                    <FaClock className="text-tertiary" size={14} />
                  </div>
                  <span>{tour.duration} hours</span>
                </div>
              )}

              {tour.maxGroupSize && (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <FaUsers className="text-primary" size={14} />
                  </div>
                  <span>Max {tour.maxGroupSize} people</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailHero;
