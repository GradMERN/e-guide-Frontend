import React from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaBookmark,
  FaArrowLeft,
} from "react-icons/fa";
import { useSaved } from "../../store/hooks";

const TourDetailHero = ({ tour, onEnrollClick, onBack }) => {
  const tourImage = tour.mainImage?.url || null;

  const { savedTours, addToSaved, removeFromSaved } = useSaved();
  const tourId = tour._id || tour.id;

  const isSaved = savedTours.some((savedTour) => {
    const savedTourId = savedTour._id || savedTour.id;
    return savedTourId === tourId;
  });

  const handleSaveTour = (e) => {
    e.stopPropagation();

    if (isSaved) {
      removeFromSaved(tourId);
    } else {
      addToSaved(tour);
    }
  };

  const handleBack = (e) => {
    e.stopPropagation();
    if (onBack) onBack();
    else window.history.back();
  };

  return (
    <div className="relative">
      <div className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {tourImage ? (
            <img
              src={tourImage}
              alt={tour.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-primary/30 via-secondary/20 to-tertiary/20" />
          )}

          <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-background/70 via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/10 to-background" />
        </div>

        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-16 w-full">
            {/* BACK BUTTON */}
            <div className="absolute top-0 -translate-y-16 z-10">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/90 hover:bg-white backdrop-blur-md rounded-xl text-gray-800 hover:text-black transition-all duration-200 group shadow-lg border border-gray-200/50"
              >
                <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>
            </div>

            {/* Rest of your content */}
            <div className="flex flex-wrap gap-3 mb-6">
              {tour.categories?.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-sm border border-primary/30 text-sm text-text font-medium"
                >
                  {category}
                </span>
              ))}
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text mb-6 leading-tight">
              {tour.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-text-secondary mb-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(tour.rating || 0)
                          ? "text-primary"
                          : "text-text-muted"
                      }
                      size={18}
                    />
                  ))}
                </div>
                <span className="font-semibold text-text">
                  {tour.rating?.toFixed(1) || "N/A"}
                </span>
                <span className="text-sm">
                  ({tour.ratingsCount || 0} reviews)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <FaMapMarkerAlt className="text-primary" size={14} />
                </div>
                <span>
                  {tour.place?.city || "Unknown"},{" "}
                  {tour.place?.country || "Egypt"}
                </span>
              </div>

              {tour.duration && (
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-secondary/10">
                    <FaClock className="text-secondary" size={14} />
                  </div>
                  <span>{tour.duration} hours</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-tertiary/10">
                  <FaUsers className="text-tertiary" size={14} />
                </div>
                <span>{tour.enrollmentsCount || 0} travelers enrolled</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onEnrollClick}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Enroll Now
              </button>

              <button
                onClick={handleSaveTour}
                className="p-3.5 rounded-xl bg-surface border border-border hover:bg-surface/80 transition-all duration-300 hover:scale-105 cursor-pointer group/save"
                title={isSaved ? "Remove from saved" : "Save tour"}
              >
                <FaBookmark
                  className={`transition-all duration-300 ${
                    isSaved
                      ? "text-primary fill-primary transform scale-110"
                      : "text-text-secondary group-hover/save:text-primary group-hover/save:scale-110"
                  }`}
                  size={20}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailHero;
