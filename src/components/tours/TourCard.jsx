import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaStar, FaUsers } from "react-icons/fa";

const TourCard = ({ tour }) => {
  return (
    <Link to={`/tours/${tour._id}`} className="group">
      <div
        className="relative h-full backdrop-blur-xl bg-white/5 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:scale-[1.02]"
        style={{
          boxShadow: "0 0 0 0 rgba(255, 230, 160, 0)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255, 230, 160, 0.5)";
          e.currentTarget.style.boxShadow =
            "0 25px 50px -12px rgba(255, 230, 160, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(107, 114, 128, 0.5)";
          e.currentTarget.style.boxShadow = "0 0 0 0 rgba(255, 230, 160, 0)";
        }}
      >
        {/* Image Container */}
        <div className="relative h-56 bg-linear-to-br from-[#FFE6A0]/40 via-[#FFD670]/30 to-[#FFC940]/40 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-7xl transform transition-transform duration-700 group-hover:scale-110">
              🏛️
            </div>
          </div>

          {/* linear Overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 dark:from-black/80 via-transparent to-transparent"></div>

          {/* Featured Badge */}
          <div
            className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full backdrop-blur-sm"
            style={{
              background:
                "linear-gradient(to right, rgba(255, 230, 160, 0.9), rgba(255, 214, 112, 0.9))",
            }}
          >
            <span className="text-xs">✨</span>
            <span className="text-xs font-semibold text-gray-900">
              Featured
            </span>
          </div>

          {/* Rating Badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 dark:bg-black/60 backdrop-blur-sm"
            style={{
              borderColor: "rgba(255, 230, 160, 0.3)",
              borderWidth: "1px",
            }}
          >
            <FaStar style={{ color: "#FFE6A0" }} size={10} />
            <span className="text-xs font-bold text-white">
              {tour.ratingsAverage?.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3
            className="text-xl font-bold mb-3 transition-all duration-300 line-clamp-2"
            style={{
              color: "black",
              backgroundImage: "linear-gradient(to right, #FFE6A0, #FFD670)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "transparent";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "black";
            }}
          >
            {tour.name}
          </h3>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div
                className="p-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(255, 230, 160, 0.1)" }}
              >
                <FaMapMarkerAlt style={{ color: "#FFE6A0" }} size={12} />
              </div>
              <span className="text-xs">{tour.city}, Egypt</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div
                className="p-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(255, 214, 112, 0.1)" }}
              >
                <FaClock style={{ color: "#FFD670" }} size={12} />
              </div>
              <span className="text-xs">{tour.duration} hours</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <div
                className="p-1.5 rounded-lg"
                style={{ backgroundColor: "rgba(255, 201, 64, 0.1)" }}
              >
                <FaUsers style={{ color: "#FFC940" }} size={12} />
              </div>
              <span className="text-xs">Max {tour.maxGroupSize}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-white/10">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">From</p>
              <p className="text-2xl font-bold bg-linear-to-r from-[#FFE6A0] to-[#FFD670] bg-clip-text text-transparent">
                {tour.price}
                <span className="text-sm ml-1">{tour.currency}</span>
              </p>
            </div>

            <button
              className="px-5 py-2.5 text-gray-900 text-sm font-semibold rounded-xl transition-all transform group-hover:scale-105 shadow-lg"
              style={{
                background: "linear-gradient(to right, #FFE6A0, #FFD670)",
                boxShadow: "0 10px 25px -5px rgba(255, 230, 160, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(to right, #FFD670, #FFC940)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(to right, #FFE6A0, #FFD670)";
              }}
            >
              View
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Link>
  );
};

export default TourCard;
