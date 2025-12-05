import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTours } from "../../store/hooks";
import TourDetailHero from "../../components/tourDetail/TourDetailHero";
import TourOverview from "../../components/tourDetail/TourOverview";
import TourGuide from "../../components/tourDetail/TourGuide";
import TourInclusions from "../../components/tourDetail/TourInclusions";
import TourReviews from "../../components/tourDetail/TourReviews";
import EnrollmentModal from "../../components/tourDetail/EnrollmentModal";
import { FaArrowLeft } from "react-icons/fa";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTour: tour, loading, error, fetchTourById } = useTours();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTourById(id);
    }
  }, [fetchTourById, id]);

  const handleBack = () => {
    navigate(-1); // Go back one page in history
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse">
            ✨
          </div>
        </div>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-text mb-3">Tour Not Found</h2>
          <p className="text-text-secondary mb-6">
            {error || "The tour you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/tours")}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface/80 backdrop-blur-sm rounded-xl text-text-secondary hover:text-text transition-colors group border border-border/50 hover:border-border shadow-lg"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Tours</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enrollment Modal */}
      <EnrollmentModal tour={tour} isOpen={isModalOpen} onClose={closeModal} />

      {/* Floating Back Button */}
      <div className="absolute top-35 left-20 z-50">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface/80 backdrop-blur-sm rounded-xl text-text-secondary hover:text-text transition-colors group border border-border/50 hover:border-border shadow-lg"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      {/* Hero with Enroll button - REMOVE onBack prop since we have our own button */}
      <TourDetailHero tour={tour} onEnrollClick={openModal} />

      {/* Main Content Container */}
      <div className="relative bg-background">
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Spacer for fixed back button */}
              <div className="h-16 lg:hidden"></div>

              {/* Overview Section */}
              <div className="mb-12">
                <TourOverview tour={tour} />
              </div>

              {/* Guide Section */}
              <div className="mb-12">
                <TourGuide guide={tour.guide} />
              </div>

              {/* Reviews Section */}
              <div>
                <TourReviews
                  ratingsAverage={tour.rating}
                  ratingsCount={tour.ratingsCount}
                />
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Spacer for fixed back button */}
                <div className="h-16 lg:hidden"></div>

                {/* Tour Information Card */}
                <div className="bg-surface rounded-2xl p-6 mb-8">
                  <h3 className="text-xl font-bold text-text mb-6">
                    Tour Details
                  </h3>

                  <div className="space-y-6">
                    {/* Price */}
                    <div className="pb-6 border-b border-border/40">
                      <p className="text-sm text-text-muted mb-2">
                        Price per person
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {tour.price}
                        </span>
                        <span className="text-lg text-text-secondary">
                          {tour.currency}
                        </span>
                        <span className="text-sm text-text-muted ml-2">
                          /person
                        </span>
                      </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-border/20">
                        <span className="text-text-secondary">Duration</span>
                        <span className="font-medium text-text">
                          {tour.duration || 8} hours
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border/20">
                        <span className="text-text-secondary">Difficulty</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            tour.difficulty === "easy"
                              ? "bg-green-500/10 text-green-600"
                              : tour.difficulty === "moderate"
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {tour.difficulty || "Moderate"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-border/20">
                        <span className="text-text-secondary">Group Size</span>
                        <span className="font-medium text-text">
                          Max {tour.maxGroupSize || 12}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-text-secondary">Languages</span>
                        <span className="font-medium text-text">
                          {tour.languages?.length || 2}
                        </span>
                      </div>
                    </div>

                    {/* Enroll Button */}
                    <div className="pt-6">
                      <button
                        onClick={openModal}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-background font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                      >
                        Enroll Now
                      </button>
                      <p className="text-sm text-text-muted text-center mt-3">
                        {tour.enrollmentsCount || 0} travelers enrolled
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tour Inclusions Card */}
                <TourInclusions tour={tour} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
