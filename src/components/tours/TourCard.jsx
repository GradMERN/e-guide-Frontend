import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaStar, FaUsers } from "react-icons/fa";

const TourCard = ({ tour }) => {
  return (
    <Link to={`/tours/${tour._id}`} className="group">
      <div className="relative h-full bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:scale-[1.02] hover:border-primary">
        {/* Image Container */}
        <div className="relative h-56 bg-gradient-to-br from-primary/30 via-secondary/20 to-tertiary/20 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-7xl transform transition-transform duration-700 group-hover:scale-110">
              🏛️
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-tertiary/40 dark:from-light-900/80 via-transparent to-transparent"></div>

          {/* Featured Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full backdrop-blur-sm bg-gradient-to-r from-primary to-secondary">
            <span className="text-xs">✨</span>
            <span className="text-xs font-semibold text-light-900">
              Featured
            </span>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-sm border border-primary">
            <FaStar className="text-primary" size={10} />
            <span className="text-xs font-bold text-primary dark:text-text">
              {tour.ratingsAverage?.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold mb-3 line-clamp-2 text-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-secondary group-hover:to-tertiary group-hover:bg-clip-text transition-all duration-300">
            {tour.name}
          </h3>

          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 rounded-lg bg-primary">
                <FaMapMarkerAlt className="text-light-900" size={12} />
              </div>
              <span className="text-xs">{tour.city}, Egypt</span>
            </div>

            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 rounded-lg bg-secondary">
                <FaClock className="text-light-900" size={12} />
              </div>
              <span className="text-xs">{tour.duration} hours</span>
            </div>

            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 rounded-lg bg-tertiary">
                <FaUsers className="text-light-900" size={12} />
              </div>
              <span className="text-xs">Max {tour.maxGroupSize}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div>
              <p className="text-xs text-text-muted mb-0.5">From</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {tour.price}
                <span className="text-sm ml-1">{tour.currency}</span>
              </p>
            </div>

            <button className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all transform group-hover:scale-105 shadow-lg bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary text-light-900 shadow-primary/30">
              View
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
