import React from "react";
import { FaStar, FaMapMarkerAlt, FaClock, FaUsers } from "react-icons/fa";

const TourDetailHero = ({ tour }) => {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[500px] rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFE6A0]/40 via-[#FFD670]/30 to-[#FFC940]/40">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl">🏛️</div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl">
            {/* Category Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm mb-4"
              style={{
                background:
                  "linear-gradient(to right, rgba(255, 230, 160, 0.9), rgba(255, 214, 112, 0.9))",
              }}
            >
              <span className="text-sm font-semibold text-gray-900">
                Featured Tour
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {tour.name}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <FaStar style={{ color: "#FFE6A0" }} />
                <span className="font-semibold">{tour.ratingsAverage}</span>
                <span className="text-gray-300">
                  ({tour.ratingsQuantity} reviews)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FaMapMarkerAlt style={{ color: "#FFE6A0" }} />
                <span>{tour.city}, Egypt</span>
              </div>

              <div className="flex items-center gap-2">
                <FaClock style={{ color: "#FFE6A0" }} />
                <span>{tour.duration} hours</span>
              </div>

              <div className="flex items-center gap-2">
                <FaUsers style={{ color: "#FFE6A0" }} />
                <span>Max {tour.maxGroupSize} people</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailHero;
