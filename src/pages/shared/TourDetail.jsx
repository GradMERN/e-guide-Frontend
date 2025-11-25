import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TourDetailHero from "../../components/tourDetail/TourDetailHero";
import TourOverview from "../../components/tourDetail/TourOverview";
import TourGuide from "../../components/tourDetail/TourGuide";
import TourInclusions from "../../components/tourDetail/TourInclusions";
import TourBookingCard from "../../components/tourDetail/TourBookingCard";
import TourReviews from "../../components/tourDetail/TourReviews";

const TourDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  // Mock tour data - replace with actual API call
  const [tour] = useState({
    _id: "1",
    name: "Pyramids of Giza Experience",
    price: 2500,
    currency: "EGP",
    city: "Cairo",
    duration: 8,
    ratingsAverage: 4.8,
    ratingsQuantity: 124,
    maxGroupSize: 12,
    description:
      "Embark on an unforgettable journey to the last remaining wonder of the ancient world. This comprehensive tour takes you deep into the history of ancient Egypt, exploring the magnificent Pyramids of Giza, the enigmatic Sphinx, and the fascinating Solar Boat Museum.",
    summary:
      "Our expert Egyptologists will guide you through millennia of history, sharing insights and stories that bring these ancient monuments to life. Experience the grandeur of the pyramids up close and discover the secrets of the pharaohs.",
    guide: {
      name: "Dr. Ahmed Hassan",
      title: "Senior Egyptologist",
      emoji: "👨‍🏫",
      rating: 4.9,
      toursCompleted: 250,
      experience: 15,
      languages: ["English", "Arabic", "French", "German"],
      specialties: [
        "Ancient Egyptian History",
        "Pyramid Architecture",
        "Hieroglyphics",
      ],
      bio: "Dr. Ahmed Hassan is a renowned Egyptologist with over 15 years of experience guiding tours at the Pyramids of Giza. He holds a PhD in Ancient Egyptian History from Cairo University and has published numerous research papers on pyramid construction techniques. His passion for Egypt's ancient heritage and engaging storytelling make every tour an unforgettable educational experience.",
    },
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
      {
        _id: "4",
        user: { name: "Carlos Rodriguez" },
        rating: 5,
        comment:
          "Best tour I've ever taken! Dr. Hassan's expertise and enthusiasm made this experience truly special. The history, the views, everything was perfect. Worth every penny!",
        date: "2 months ago",
      },
      {
        _id: "5",
        user: { name: "Yuki Tanaka" },
        rating: 5,
        comment:
          "An unforgettable journey through ancient history. The guide's explanations were detailed and fascinating. The lunch was also surprisingly good. Don't miss this tour!",
        date: "2 months ago",
      },
      {
        _id: "6",
        user: { name: "Lisa Anderson" },
        rating: 4,
        comment:
          "Wonderful experience seeing the pyramids up close. Our guide was very knowledgeable. The only downside was the crowds, but the tour operator handled it well.",
        date: "3 months ago",
      },
    ],
  });

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(to bottom, #0B192C 0%, #091626 50%, #000000 100%)",
        }}
      >
        <div className="relative">
          <div
            className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2"
            style={{ borderColor: "#FFE6A0" }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative text-white overflow-hidden min-h-screen"
      style={{
        background:
          "linear-gradient(to bottom, #0B192C 0%, #0E1A33 15%, #091626 30%, #121217 45%, #0F0B08 60%, #050404 75%, #000000 90%, #000000 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(255, 230, 160, 0.1)" }}
        ></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(255, 214, 112, 0.1)" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(255, 201, 64, 0.1)" }}
        ></div>
      </div>

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
              ratingsAverage={tour.ratingsAverage}
              ratingsQuantity={tour.ratingsQuantity}
            />
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <TourInclusions included={tour.included} excluded={tour.excluded} />
            <br />
            <TourBookingCard tour={tour} />
          </div>
        </div>
        <div className="mt-16"></div>
      </div>

      <style jsx>{`
        select option {
          background: #1a1a1a;
          color: white;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50% - 0.5rem));
          }
        }

        .animate-scroll {
          animation: scroll var(--animation-duration, 40s) linear infinite;
          animation-direction: var(--animation-direction, forwards);
        }
      `}</style>
    </div>
  );
};

export default TourDetail;
