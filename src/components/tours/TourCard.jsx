import React from "react";
import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaStar,
  FaUsers,
  FaArrowRight,
  FaTag,
  FaLanguage,
  FaClock,
  FaBookmark,
} from "react-icons/fa";
import { useSaved } from "../../store/hooks";

const TourCard = ({ tour, hideSaveButton = false }) => {
  const { savedTours, addToSaved, removeFromSaved } = useSaved();

  const tourId = tour._id || tour.id;

  const isSaved = savedTours.some((savedTour) => {
    const savedTourId = savedTour._id || savedTour.id;
    return savedTourId === tourId;
  });

  const handleSaveTour = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSaved) {
      removeFromSaved(tourId);
    } else {
      addToSaved(tour);
    }
  };

  const tourImage = tour.mainImage?.url || null;

  return (
    <div className="relative h-full group">
      <Link to={`/tours/${tourId}`} className="block">
        <div className="h-full bg-surface rounded-2xl overflow-hidden border border-border/20 hover:shadow-2xl transition-all duration-300 group-hover:transform group-hover:scale-[1.02] hover:border-primary">
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex justify-between">
              {/* Rating Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-sm border border-primary">
                <FaStar className="text-primary" size={10} />
                <span className="text-xs font-bold text-text">
                  {tour.rating?.toFixed(1) || "N/A"}
                </span>
                <span className="text-xs text-text-muted">
                  ({tour.ratingsCount || 0})
                </span>
              </div>
            </div>

            {/* Category Tags */}
            {tour.categories && tour.categories.length > 0 && (
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                {tour.categories.slice(0, 2).map((category, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-primary/30 text-xs text-white font-medium"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col h-[calc(100%-14rem)]">
            <h3 className="text-xl font-bold mb-3 line-clamp-2 text-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-secondary group-hover:to-tertiary group-hover:bg-clip-text transition-all duration-300">
              {tour.name}
            </h3>

            {/* Location & Guide Info */}
            <div className="space-y-2 mb-4 flex-1">
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

              {/* Duration if available */}
              {tour.duration && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <div className="p-1.5 rounded-lg bg-tertiary/10">
                    <FaClock className="text-tertiary" size={12} />
                  </div>
                  <span className="text-xs">{tour.duration} hours</span>
                </div>
              )}
            </div>

            {/* Tags & Languages Row */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {/* Languages */}
                {tour.languages && tour.languages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <FaLanguage className="text-text-muted" size={10} />
                    <div className="flex flex-wrap gap-1">
                      {tour.languages.slice(0, 2).map((lang, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 rounded-md bg-tertiary/10 text-xs text-text-secondary"
                        >
                          {lang}
                        </span>
                      ))}
                      {tour.languages.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-tertiary/10 text-xs text-text-secondary">
                          +{tour.languages.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tour.tags && tour.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    <FaTag className="text-text-muted" size={10} />
                    <div className="flex flex-wrap gap-1">
                      {tour.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 rounded-md bg-primary/10 text-xs text-text"
                        >
                          #{tag}
                        </span>
                      ))}
                      {tour.tags.length > 2 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-xs text-text">
                          +{tour.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with Price & CTA */}
            <div className="pt-4 border-t border-border/40 mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {tour.price}
                    </span>
                    <span className="text-sm ml-1 text-text-secondary">
                      {tour.currency}
                    </span>
                  </div>
                </div>

                {/* Always Visible View More Button */}
                <button className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 bg-primary/70 hover:bg-secondary/70 text-white flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105">
                  <span>View Details</span>
                  <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Save Button - Top right corner with your theme colors */}
      {!hideSaveButton && (
        <button
          onClick={handleSaveTour}
          className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-surface/90 backdrop-blur-sm border border-border hover:border-primary transition-all duration-200 hover:scale-110 cursor-pointer group/save"
          title={isSaved ? "Remove from saved" : "Save tour"}
        >
          <FaBookmark
            className={`transition-all duration-200 ${
              isSaved
                ? "text-primary fill-primary transform scale-105"
                : "text-text-secondary group-hover/save:text-primary"
            }`}
            size={14}
          />
        </button>
      )}
    </div>
  );
};

export default TourCard;
