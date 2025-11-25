import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaStar, FaUsers } from "react-icons/fa";

const TourCard = ({ tour }) => {
  return (
    <Link to={`/tours/${tour._id}`} className="group">
      <div className="relative h-full bg-white dark:bg-white/5 rounded-2xl overflow-hidden border border-[#B2A496] dark:border-white/10 hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:scale-[1.02] hover:border-[#5E3719] dark:hover:border-[#FFE6A0]/50">
        {/* Image Container */}
        <div className="relative h-56 bg-gradient-to-br from-[#5E3719]/20 via-[#735238]/20 to-[#886E58]/20 dark:from-[#FFE6A0]/40 dark:via-[#FFD670]/30 dark:to-[#FFC940]/40 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-7xl transform transition-transform duration-700 group-hover:scale-110">
              🏛️
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#5E3719]/40 dark:from-black/80 via-transparent to-transparent"></div>

          {/* Featured Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full backdrop-blur-sm bg-gradient-to-r from-[#5E3719] to-[#735238] dark:from-[#FFE6A0] dark:to-[#FFD670]">
            <span className="text-xs">✨</span>
            <span className="text-xs font-semibold text-white dark:text-gray-900">
              Featured
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-sm border border-[#5E3719] dark:border-[#FFE6A0]/30">
            <FaStar className="text-[#5E3719] dark:text-[#FFE6A0]" size={10} />
            <span className="text-xs font-bold text-[#5E3719] dark:text-white">
              {tour.ratingsAverage?.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold mb-3 line-clamp-2 text-[#5E3719] dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#5E3719] group-hover:via-[#735238] group-hover:to-[#886E58] dark:group-hover:from-[#FFE6A0] dark:group-hover:via-[#FFD670] dark:group-hover:to-[#FFC940] group-hover:bg-clip-text transition-all duration-300">
            {tour.name}
          </h3>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-[#735238] dark:text-gray-400">
              <div className="p-1.5 rounded-lg bg-[#5E3719] dark:bg-[#FFE6A0]/10">
                <FaMapMarkerAlt
                  className="text-white dark:text-[#FFE6A0]"
                  size={12}
                />
              </div>
              <span className="text-xs">{tour.city}, Egypt</span>
            </div>

            <div className="flex items-center gap-2 text-[#735238] dark:text-gray-400">
              <div className="p-1.5 rounded-lg bg-[#735238] dark:bg-[#FFD670]/10">
                <FaClock className="text-white dark:text-[#FFD670]" size={12} />
              </div>
              <span className="text-xs">{tour.duration} hours</span>
            </div>

            <div className="flex items-center gap-2 text-[#735238] dark:text-gray-400">
              <div className="p-1.5 rounded-lg bg-[#886E58] dark:bg-[#FFC940]/10">
                <FaUsers className="text-white dark:text-[#FFC940]" size={12} />
              </div>
              <span className="text-xs">Max {tour.maxGroupSize}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-[#B2A496] dark:border-white/10">
            <div>
              <p className="text-xs text-[#886E58] dark:text-gray-500 mb-0.5">
                From
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#5E3719] to-[#735238] dark:from-[#FFE6A0] dark:to-[#FFD670] bg-clip-text text-transparent">
                {tour.price}
                <span className="text-sm ml-1">{tour.currency}</span>
              </p>
            </div>

            <button className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all transform group-hover:scale-105 shadow-lg bg-gradient-to-r from-[#5E3719] to-[#735238] dark:from-[#FFE6A0] dark:to-[#FFD670] hover:from-[#735238] hover:to-[#886E58] dark:hover:from-[#FFD670] dark:hover:to-[#FFC940] text-white dark:text-black shadow-[0_10px_25px_-5px_rgba(94,55,25,0.3)] dark:shadow-[0_10px_25px_-5px_rgba(255,230,160,0.3)]">
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
