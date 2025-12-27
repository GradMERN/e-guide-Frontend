import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Added this
import { useTranslation } from "react-i18next";
import { useTours } from "../../store/hooks"; 
import { motion } from "framer-motion"; // THE MISSING IMPORT
import { HiOutlineExclamationCircle } from "react-icons/hi2"; // Re-adding the pro icon
import TourHero from "../../components/tours/TourHero";
import TourFilters from "../../components/tours/TourFilters";
import TourGrid from "../../components/tours/TourGrid";
import LoadingScreen from "../../components/common/LoadingScreen";

const TourPackages = () => {
  const { t } = useTranslation();
  const navigate = useNavigate(); // Added this
  const { tours, loading, error, fetchTours } = useTours();

  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [selectedPlace, setSelectedPlace] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchTours({ isPublished: true });
  }, [fetchTours]);

  // Logic for filtering tours
  const filteredTours = Array.isArray(tours)
    ? tours
        .filter((tour) => {
          if (!tour.isPublished) return false;

          const matchesSearch =
            searchTerm === "" ||
            (tour.name &&
              tour.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tour.description &&
              tour.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()));

          const matchesPrice =
            priceRange === "all" ||
            (priceRange === "low" && tour.price < 1000) ||
            (priceRange === "medium" &&
              tour.price >= 1000 &&
              tour.price <= 3000) ||
            (priceRange === "high" && tour.price > 3000);

          const matchesPlace =
            selectedPlace === "all" ||
            (tour.place && tour.place.city === selectedPlace);

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

  const places = ["all", ...new Set(tours?.map((t) => t.place?.city).filter(Boolean) || [])];
  const categories = ["all", ...new Set(tours?.flatMap((t) => t.categories || []).filter(Boolean) || [])];

  if (loading) {
    return <LoadingScreen fullPage={true} />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <HiOutlineExclamationCircle className="w-12 h-12 text-primary" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3">
              {t("tourPackages.loadError")}
            </h2>
            
            <p className="text-text-secondary text-base mb-8 leading-relaxed">
              {t("tourPackages.loadErrorDescription")}
            </p>
            
            <div className="flex flex-col gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => fetchTours({ isPublished: true })} className="w-full py-4 rounded-xl bg-primary text-black font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t("common.retry")}
              </motion.button>
              <button onClick={() => navigate("/")} className="text-sm font-medium text-text-secondary hover:text-primary transition-colors py-2">
                {t("common.backToHome")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative text-text overflow-hidden bg-background">
      <div className="relative max-w-7xl mx-auto px-6 pt-12 pb-20">
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