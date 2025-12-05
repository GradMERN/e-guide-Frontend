import React from "react";
import { Link } from "react-router-dom";
import { FaBookmark, FaArrowLeft } from "react-icons/fa";
import { useSaved } from "../../store/hooks";
import TourCard from "../../components/tours/TourCard";

const SavedTours = () => {
  const { savedTours, clearSaved } = useSaved();

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to remove all saved tours?")) {
      clearSaved();
    }
  };

  if (savedTours.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-44 pb-20">
        {" "}
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <FaBookmark className="text-primary text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-text">Saved Tours</h1>
                  <p className="text-text-secondary mt-1">
                    Your personal collection
                  </p>
                </div>
              </div>
              <Link
                to="/tours"
                className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-text-secondary hover:text-text transition-colors"
              >
                <FaArrowLeft className="text-sm" />
                <span className="text-sm font-medium">Back to Tours</span>
              </Link>
            </div>
          </div>

          {/* Empty State */}
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface mb-6">
              <FaBookmark className="text-4xl text-text-muted" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">
              No saved tours yet
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              When you find tours you're interested in, click the bookmark icon
              to save them here for later.
            </p>
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold hover:opacity-90 transition-opacity"
            >
              Browse Tours
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-44 pb-20">
      {" "}
      {/* Added pt-24 */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <FaBookmark className="text-primary text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text">Saved Tours</h1>
                <p className="text-text-secondary mt-1">
                  {savedTours.length}{" "}
                  {savedTours.length === 1 ? "tour" : "tours"} saved
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <span className="text-sm font-medium">Clear All</span>
              </button>
              <Link
                to="/tours"
                className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-text-secondary hover:text-text transition-colors"
              >
                <FaArrowLeft className="text-sm" />
                <span className="text-sm font-medium">Back to Tours</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTours.map((tour) => (
            <TourCard
              key={tour._id || tour.id}
              tour={tour}
              hideSaveButton={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedTours;
