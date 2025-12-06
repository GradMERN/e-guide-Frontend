import React, { useState, useEffect } from "react";
import { useTours } from "../../store/hooks"; // Use custom hook
import TourHero from "../../components/tours/TourHero";
import TourFilters from "../../components/tours/TourFilters";
import TourGrid from "../../components/tours/TourGrid";

const TourPackages = () => {
  const { tours, loading, error, fetchTours } = useTours();

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedPlace, setSelectedPlace] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Fetch only published tours
    fetchTours({ isPublished: true });
  }, [fetchTours]);

  // Filter tours locally (client-side filtering)
  const filteredTours = Array.isArray(tours)
    ? tours
        .filter((tour) => {
          // Skip if tour is not published
          if (!tour.isPublished) return false;

          // Search filter
          const matchesSearch =
            searchTerm === "" ||
            (tour.name &&
              tour.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tour.description &&
              tour.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()));

          // Price filter
          const matchesPrice =
            priceRange === "all" ||
            (priceRange === "low" && tour.price < 1000) ||
            (priceRange === "medium" &&
              tour.price >= 1000 &&
              tour.price <= 3000) ||
            (priceRange === "high" && tour.price > 3000);

          // Location filter
          const matchesPlace =
            selectedPlace === "all" ||
            (tour.place && tour.place.city === selectedPlace);

          // Category filter
          const matchesCategory =
            selectedCategory === "all" ||
            (tour.categories && tour.categories.includes(selectedCategory));

          return (
            matchesSearch && matchesPrice && matchesPlace && matchesCategory
          );
        })
        .sort((a, b) => {
          if (sortBy === "price-low") return a.price - b.price;
          if (sortBy === "price-high") return b.price - a.price;
          if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
          if (sortBy === "popular")
            return (b.enrollmentsCount || 0) - (a.enrollmentsCount || 0);
          return 0;
        })
    : [];

  // Get unique places for filter dropdown
  const places = ["all"];
  if (Array.isArray(tours)) {
    tours.forEach((tour) => {
      if (tour.place && tour.place.city && !places.includes(tour.place.city)) {
        places.push(tour.place.city);
      }
    });
  }

  // Get unique categories for filter dropdown
  const categories = ["all"];
  if (Array.isArray(tours)) {
    tours.forEach((tour) => {
      if (tour.categories) {
        tour.categories.forEach((category) => {
          if (category && !categories.includes(category)) {
            categories.push(category);
          }
        });
      }
    });
  }

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
          <h2 className="text-2xl font-bold text-text mb-3">
            Error Loading Tours
          </h2>
          <p className="text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => fetchTours({ isPublished: true })}
            className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative text-text overflow-hidden bg-background mt-10">
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <TourHero />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TourFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedPlace={selectedPlace}
              setSelectedPlace={setSelectedPlace}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              places={places}
              categories={categories}
              filteredCount={filteredTours.length}
              totalCount={tours.length || 0}
            />
          </div>

          <div className="lg:col-span-3">
            <TourGrid tours={filteredTours} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourPackages;
