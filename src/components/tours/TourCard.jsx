import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaUsers,
  FaArrowRight,
  FaTag,
  FaLanguage,
} from "react-icons/fa";

const TourCard = ({ tour }) => {
  // Fallback image if mainImage is not available
  const tourImage = tour.mainImage?.url || null;

  return (
    <Link to={`/tours/${tour._id}`} className="group block">
      <div className="relative h-full bg-surface rounded-2xl overflow-hidden border border-border/20 hover:shadow-2xl transition-all duration-300 group-hover:transform group-hover:scale-[1.02] hover:border-primary">
        {/* Image Container */}
        <div className="relative h-56 overflow-hidden">
          {tourImage ? (
            <img
              src={tourImage}
              alt={tour.name}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 via-secondary/20 to-tertiary/20 flex items-center justify-center">
              <div className="text-7xl transform transition-transform duration-500 group-hover:scale-110">
                🏛️
              </div>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Rating Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-sm border border-primary">
            <FaStar className="text-primary" size={10} />
            <span className="text-xs font-bold text-text">
              {tour.rating?.toFixed(1) || "N/A"}
            </span>
            <span className="text-xs text-text-muted">
              ({tour.ratingsCount || 0})
            </span>
          </div>

          {/* Category Tags */}
          {tour.categories && tour.categories.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
              {tour.categories.slice(0, 2).map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm border border-primary/30 text-xs text-white font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold mb-3 line-clamp-2 text-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-secondary group-hover:to-tertiary group-hover:bg-clip-text transition-all duration-300">
            {tour.name}
          </h3>

          {/* Location & Guide Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <FaMapMarkerAlt className="text-primary" size={12} />
              </div>
              <span className="text-xs">
                {tour.place?.city || "Unknown"},{" "}
                {tour.place?.country || "Egypt"}
              </span>
            </div>

            {tour.guide && (
              <div className="flex items-center gap-2 text-text-secondary">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                  {tour.guide.firstName?.charAt(0) || "G"}
                </div>
                <span className="text-xs">
                  by {tour.guide.firstName} {tour.guide.lastName}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 text-text-secondary">
              <div className="p-1.5 rounded-lg bg-secondary/10">
                <FaUsers className="text-secondary" size={12} />
              </div>
              <span className="text-xs">
                {tour.enrollmentsCount || 0} travelers
              </span>
            </div>
          </div>

          {/* Languages */}
          {tour.languages && tour.languages.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-text-muted mb-2">
                <FaLanguage size={10} />
                <p className="text-xs">Available in:</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {tour.languages.slice(0, 3).map((lang, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded-md bg-tertiary/10 text-xs text-text-secondary"
                  >
                    {lang}
                  </span>
                ))}
                {tour.languages.length > 3 && (
                  <span className="px-2 py-0.5 rounded-md bg-tertiary/10 text-xs text-text-secondary">
                    +{tour.languages.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {tour.tags && tour.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 text-text-muted mb-2">
                <FaTag size={10} />
                <p className="text-xs">Tags:</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {tour.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 rounded-md bg-primary/10 text-xs text-text"
                  >
                    #{tag}
                  </span>
                ))}
                {tour.tags.length > 3 && (
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-xs text-text">
                    +{tour.tags.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Price & View More on Hover */}
          <div className="flex items-center justify-between pt-4 border-t border-border/40">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {tour.price}
                <span className="text-sm ml-1">{tour.currency}</span>
              </p>
            </div>

            {/* View More Button - Appears on Hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <button className="px-4 py-2 text-sm font-semibold rounded-xl transition-all bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary text-white flex items-center gap-2">
                <span>View More</span>
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TourCard;
