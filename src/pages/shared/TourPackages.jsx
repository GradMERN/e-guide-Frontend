// TourPackages.jsx
import React, { useState, useEffect } from "react";
import TourHero from "../../components/tours/TourHero";
import TourFilters from "../../components/tours/TourFilters";
import TourGrid from "../../components/tours/TourGrid";
// import { tourService } from "../../services/tourService"; // Uncomment when ready

const TourPackages = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedPlace, setSelectedPlace] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      // Replace with your actual API call
      // const response = await tourService.getAllTours();
      // setTours(response.data);

      // Temporary static data matching your schema
      setTours([
        {
          _id: "1",
          name: "Pyramids of Giza",
          description:
            "Explore the last wonder of the ancient world with expert Egyptologists",
          price: 2500,
          currency: "EGP",
          mainImage: { url: "", public_id: "" },
          place: { _id: "p1", name: "Giza", city: "Cairo", country: "Egypt" },
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
          tags: ["Pyramids", "Ancient Egypt"],
          languages: ["English", "Arabic"],
        },
        {
          _id: "2",
          name: "Luxor Valley of Kings",
          description:
            "Discover the royal tombs and magnificent temples of ancient Thebes",
          price: 3200,
          currency: "EGP",
          mainImage: { url: "", public_id: "" },
          place: {
            _id: "p2",
            name: "Valley of Kings",
            city: "Luxor",
            country: "Egypt",
          },
          guide: {
            _id: "g2",
            firstName: "Fatima",
            lastName: "Mohamed",
            avatar: { url: "" },
          },
          difficulty: "easy",
          rating: 4.9,
          ratingsCount: 256,
          enrollmentsCount: 890,
          isPublished: true,
          categories: ["Historical", "Archaeological"],
          tags: ["Tombs", "Pharaohs"],
          languages: ["English", "French", "Arabic"],
        },
        {
          _id: "3",
          name: "Alexandria Coastal Tour",
          description:
            "Visit the Mediterranean jewel and its Greco-Roman landmarks",
          price: 1800,
          currency: "EGP",
          mainImage: { url: "", public_id: "" },
          place: {
            _id: "p3",
            name: "Alexandria Library",
            city: "Alexandria",
            country: "Egypt",
          },
          guide: {
            _id: "g3",
            firstName: "Nour",
            lastName: "Ali",
            avatar: { url: "" },
          },
          difficulty: "easy",
          rating: 4.6,
          ratingsCount: 189,
          enrollmentsCount: 620,
          isPublished: true,
          categories: ["Cultural", "Historical"],
          tags: ["Mediterranean", "Greek History"],
          languages: ["English", "Arabic"],
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch tours:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter tours based on criteria
  const filteredTours = tours
    .filter((tour) => {
      if (!tour.isPublished) return false;

      const matchesSearch =
        tour.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "low" && tour.price < 1000) ||
        (priceRange === "medium" && tour.price >= 1000 && tour.price <= 3000) ||
        (priceRange === "high" && tour.price > 3000);

      const matchesPlace =
        selectedPlace === "all" || tour.place?.city === selectedPlace;

      const matchesDifficulty =
        selectedDifficulty === "all" || tour.difficulty === selectedDifficulty;

      const matchesCategory =
        selectedCategory === "all" ||
        tour.categories?.includes(selectedCategory);

      return (
        matchesSearch &&
        matchesPrice &&
        matchesPlace &&
        matchesDifficulty &&
        matchesCategory
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "popular")
        return (b.enrollmentsCount || 0) - (a.enrollmentsCount || 0);
      return 0;
    });

  // Get unique places (cities) for filter
  const places = [
    "all",
    ...new Set(tours.map((tour) => tour.place?.city).filter(Boolean)),
  ];

  // Get unique categories
  const categories = [
    "all",
    ...new Set(tours.flatMap((tour) => tour.categories || [])),
  ];

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

  return (
    <div className="relative text-text overflow-hidden bg-background">
      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <TourHero />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <TourFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedPlace={selectedPlace}
              setSelectedPlace={setSelectedPlace}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              places={places}
              categories={categories}
              filteredCount={filteredTours.length}
              totalCount={tours.length}
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
