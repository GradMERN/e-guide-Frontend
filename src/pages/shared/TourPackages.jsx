import React, { useState } from "react";
import TourHero from "../../components/tours/TourHero";
import TourFilters from "../../components/tours/TourFilters";
import TourGrid from "../../components/tours/TourGrid";

const TourPackages = () => {
  // Static tour data
  const [tours] = useState([
    {
      _id: "1",
      name: "Pyramids of Giza Experience",
      price: 2500,
      currency: "EGP",
      city: "Cairo",
      duration: 8,
      ratingsAverage: 4.8,
      maxGroupSize: 12,
      description:
        "Explore the last wonder of the ancient world with expert Egyptologists",
    },
    {
      _id: "2",
      name: "Luxor Valley of Kings",
      price: 3200,
      currency: "EGP",
      city: "Luxor",
      duration: 10,
      ratingsAverage: 4.9,
      maxGroupSize: 15,
      description:
        "Discover the royal tombs and magnificent temples of ancient Thebes",
    },
    {
      _id: "3",
      name: "Alexandria Coastal Tour",
      price: 1800,
      currency: "EGP",
      city: "Alexandria",
      duration: 6,
      ratingsAverage: 4.6,
      maxGroupSize: 10,
      description:
        "Visit the Mediterranean jewel and its Greco-Roman landmarks",
    },
    {
      _id: "4",
      name: "Abu Simbel Temples",
      price: 3500,
      currency: "EGP",
      city: "Aswan",
      duration: 12,
      ratingsAverage: 4.9,
      maxGroupSize: 8,
      description: "Marvel at the colossal temples of Ramses II in Nubia",
    },
    {
      _id: "5",
      name: "Cairo Islamic Heritage",
      price: 1200,
      currency: "EGP",
      city: "Cairo",
      duration: 5,
      ratingsAverage: 4.7,
      maxGroupSize: 12,
      description:
        "Walk through medieval Cairo and visit historic mosques and bazaars",
    },
    {
      _id: "6",
      name: "Nile Cruise Adventure",
      price: 4200,
      currency: "EGP",
      city: "Luxor",
      duration: 16,
      ratingsAverage: 4.8,
      maxGroupSize: 20,
      description:
        "Sail along the Nile and explore temples between Luxor and Aswan",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedCity, setSelectedCity] = useState("all");

  const filteredTours = tours
    .filter((tour) => {
      const matchesSearch = tour.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && tour.price < 1000) ||
        (priceRange === "medium" && tour.price >= 1000 && tour.price <= 3000) ||
        (priceRange === "high" && tour.price > 3000);
      const matchesCity = selectedCity === "all" || tour.city === selectedCity;
      return matchesSearch && matchesPrice && matchesCity;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating")
        return (b.ratingsAverage || 0) - (a.ratingsAverage || 0);
      return 0;
    });

  // Get unique cities for filter
  const cities = ["all", ...new Set(tours.map((tour) => tour.city))];

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
      className="relative text-white overflow-hidden"
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
        <TourHero />

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <TourFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              cities={cities}
              filteredCount={filteredTours.length}
              totalCount={tours.length}
            />
          </div>

          {/* Tours Grid */}
          <div className="lg:col-span-3">
            <TourGrid tours={filteredTours} />
          </div>
        </div>
      </div>

      <style jsx>{`
        select option {
          background: #1a1a1a;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default TourPackages;
