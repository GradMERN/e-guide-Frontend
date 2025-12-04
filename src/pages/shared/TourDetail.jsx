import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TourDetailHero from "../../components/tourDetail/TourDetailHero";
import TourOverview from "../../components/tourDetail/TourOverview";
import TourGuide from "../../components/tourDetail/TourGuide";
import TourInclusions from "../../components/tourDetail/TourInclusions";
import TourBookingCard from "../../components/tourDetail/TourBookingCard";
import TourReviews from "../../components/tourDetail/TourReviews";
// import { tourService } from "../../services/tourService"; // Uncomment when ready

const TourDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [tour, setTour] = useState(null);

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await tourService.getTourById(id);
      // setTour(response.data);

      // Mock data matching your schema
      setTour({
        _id: "1",
        name: "Pyramids of Giza Experience",
        description:
          "Embark on an unforgettable journey to the last remaining wonder of the ancient world. This comprehensive tour takes you deep into the history of ancient Egypt, exploring the magnificent Pyramids of Giza, the enigmatic Sphinx, and the fascinating Solar Boat Museum.",
        price: 2500,
        currency: "EGP",
        mainImage: {
          url: "",
          public_id: "",
        },
        galleryImages: [
          { url: "", public_id: "" },
          { url: "", public_id: "" },
          { url: "", public_id: "" },
        ],
        place: {
          _id: "p1",
          name: "Pyramids of Giza",
          city: "Cairo",
          country: "Egypt",
        },
        guide: {
          _id: "g1",
          firstName: "Ahmed",
          lastName: "Hassan",
          avatar: { url: "" },
        },
        difficulty: "moderate",
        rating: 4.8,
        ratingsCount: 342,
        enrollmentsCount: 1240,
        isPublished: true,
        categories: ["Historical", "Cultural"],
        tags: ["Pyramids", "Ancient Egypt", "Sphinx"],
        languages: ["English", "Arabic", "French"],
        // Additional fields for display (not in schema but needed)
        duration: 8, // hours
        maxGroupSize: 12,
        summary:
          "Our expert Egyptologists will guide you through millennia of history, sharing insights and stories that bring these ancient monuments to life. Experience the grandeur of the pyramids up close and discover the secrets of the pharaohs.",
        included: [
          "Professional Egyptologist guide",
          "Hotel pickup and drop-off",
          "Air-conditioned transportation",
          "Traditional Egyptian lunch",
          "Entrance fees to all sites",
          "Camel ride experience",
          "Bottled water",
          "All taxes and service charges",
        ],
        excluded: [
          "Gratuities (optional)",
          "Entry inside the pyramids",
          "Personal expenses",
          "Travel insurance",
        ],
        // Mock reviews
        reviews: [
          {
            _id: "1",
            user: { name: "Sarah Johnson" },
            rating: 5,
            comment:
              "Absolutely incredible experience! Our guide was so knowledgeable and passionate. The pyramids are even more impressive in person. Highly recommend this tour to anyone visiting Egypt!",
            date: "2 weeks ago",
          },
          {
            _id: "2",
            user: { name: "Mohammed Ahmed" },
            rating: 5,
            comment:
              "Perfect tour! Everything was well organized, the guide was excellent, and the lunch was delicious. The camel ride was a highlight! Dr. Hassan made the history come alive.",
            date: "1 month ago",
          },
          {
            _id: "3",
            user: { name: "Emma Williams" },
            rating: 4,
            comment:
              "Great tour overall. The pyramids are breathtaking and our guide was fantastic. Only minor complaint was it was quite hot, but that's expected. Bring sunscreen and water!",
            date: "1 month ago",
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch tour:", error);
    } finally {
      setLoading(false);
    }
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

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text mb-3">Tour Not Found</h2>
          <p className="text-text-secondary">
            The tour you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-background min-h-screen">
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <TourDetailHero tour={tour} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column - Tour Details */}
          <div className="lg:col-span-2 space-y-8">
            <TourOverview tour={tour} />
            <TourGuide guide={tour.guide} />
            <TourReviews
              reviews={tour.reviews}
              ratingsAverage={tour.rating}
              ratingsCount={tour.ratingsCount}
            />
          </div>

          {/* Right Column - Booking & Inclusions */}
          <div className="lg:col-span-1 space-y-8">
            <TourBookingCard tour={tour} />
            <TourInclusions included={tour.included} excluded={tour.excluded} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetail;
