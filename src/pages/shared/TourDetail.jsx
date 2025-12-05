import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTours } from "../../store/hooks";
import TourDetailHero from "../../components/tourDetail/TourDetailHero";
import TourOverview from "../../components/tourDetail/TourOverview";
import TourGuide from "../../components/tourDetail/TourGuide";
import TourInclusions from "../../components/tourDetail/TourInclusions";
import TourBookingCard from "../../components/tourDetail/TourBookingCard";
import TourReviews from "../../components/tourDetail/TourReviews";
import { FaArrowLeft } from "react-icons/fa";

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTour: tour, loading, error, fetchTourById } = useTours();

  useEffect(() => {
    if (id) {
      fetchTourById(id);
    }
  }, [fetchTourById, id]);

  // Create summary from description if no summary field exists
  const getSummary = () => {
    if (!tour?.description) return "";
    const shortDesc = tour.description.substring(0, 200);
    return shortDesc + (tour.description.length > 200 ? "..." : "");
  };

  // Get included items from model or create defaults
  const getIncludedItems = () => {
    if (tour?.languages?.length > 0) {
      return [
        "Professional Egyptologist guide",
        "Entrance fees to all sites",
        ...tour.languages.map((lang) => `Guided tour in ${lang}`),
      ];
    }
    return [
      "Professional Egyptologist guide",
      "Entrance fees to all sites",
      "Bottled water",
    ];
  };

  // Get excluded items (these aren't in your model, so we keep hardcoded)
  const getExcludedItems = () => {
    return ["Gratuities (optional)", "Personal expenses", "Travel insurance"];
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/tours");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse">
            ✨
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-text mb-3">Tour Not Found</h2>
          <p className="text-text-secondary">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Back to Tours
          </button>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-3">Tour Not Found</h2>
          <p className="text-text-secondary">
            The tour you're looking for doesn't exist.
          </p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft /> Back to Tours
          </button>
        </div>
      </div>
    );
  }

  // Prepare display data using actual model fields
  const tourData = {
    ...tour,
    // Use description for summary if no summary field
    summary: getSummary(),
    // Use languages for included items
    included: getIncludedItems(),
    excluded: getExcludedItems(),
    // Add duration and groupSize from model if they exist, otherwise defaults
    duration: tour.duration || 8,
    maxGroupSize: tour.maxGroupSize || 12,
  };

  return (
    <div className="relative bg-background min-h-screen">
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Simple Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-text-secondary hover:text-text mb-6 transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to all tours</span>
        </button>

        <TourDetailHero tour={tourData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          <div className="lg:col-span-2 space-y-8">
            <TourOverview tour={tourData} />
            <TourGuide guide={tour.guide} />
            <TourReviews
              ratingsAverage={tour.rating}
              ratingsCount={tour.ratingsCount}
            />
          </div>

          <div className="lg:col-span-1 space-y-8">
            <TourBookingCard tour={tourData} />
            <TourInclusions
              included={tourData.included}
              excluded={tourData.excluded}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
