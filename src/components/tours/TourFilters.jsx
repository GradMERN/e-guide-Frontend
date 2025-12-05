import React from "react";
import {
  FaFilter,
  FaSearch,
  FaMapMarkerAlt,
  FaTag,
  FaSortAmountDown,
  FaMoneyBillWave,
} from "react-icons/fa";

const TourFilters = ({
  searchTerm,
  setSearchTerm,
  selectedPlace,
  setSelectedPlace,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  places,
  categories,
  filteredCount,
  totalCount,
}) => {
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPlace("all");
    setSelectedCategory("all");
    setPriceRange("all");
    setSortBy("popular");
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchTerm !== "" ||
    selectedPlace !== "all" ||
    selectedCategory !== "all" ||
    priceRange !== "all" ||
    sortBy !== "popular";

  return (
    <div className="sticky top-24 bg-surface rounded-2xl p-6 border border-border shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FaFilter className="text-lg text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">Filters</h2>
            <p className="text-xs text-text-muted">Refine your search</p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs px-3 py-1.5 rounded-lg text-text-secondary hover:text-text hover:bg-background transition-colors border border-border"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text mb-3 flex items-center gap-2">
          <FaSearch className="text-primary" size={12} />
          Search Tours
        </label>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background rounded-xl text-text text-sm placeholder-text-muted focus:outline-none transition-all border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-text-muted group-focus-within:text-primary transition-colors"
            size={14}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text mb-3 flex items-center gap-2">
          <FaMapMarkerAlt className="text-primary" size={12} />
          Location
        </label>
        <div className="relative">
          <select
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            className="w-full px-4 py-3 bg-background rounded-xl text-text text-sm focus:outline-none appearance-none cursor-pointer transition-all border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {places.map((place) => (
              <option key={place} value={place}>
                {place === "all" ? "All Locations" : place}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-text-muted">
            ▼
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text mb-3 flex items-center gap-2">
          <FaTag className="text-primary" size={12} />
          Category
        </label>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 bg-background rounded-xl text-text text-sm focus:outline-none appearance-none cursor-pointer transition-all border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-text-muted">
            ▼
          </div>
        </div>
      </div>

      {/* Price Range - Simple Radio Buttons */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text mb-3 flex items-center gap-2">
          <FaMoneyBillWave className="text-primary" size={12} />
          Price Range
        </label>
        <div className="space-y-2">
          {[
            { value: "all", label: "All Prices" },
            { value: "low", label: "Under 1000 EGP" },
            { value: "medium", label: "1000 - 3000 EGP" },
            { value: "high", label: "Above 3000 EGP" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-background transition-colors"
            >
              <input
                type="radio"
                name="priceRange"
                value={option.value}
                checked={priceRange === option.value}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-4 h-4 text-primary focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By - Simple Dropdown */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text mb-3 flex items-center gap-2">
          <FaSortAmountDown className="text-primary" size={12} />
          Sort By
        </label>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 bg-background rounded-xl text-text text-sm focus:outline-none appearance-none cursor-pointer transition-all border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-text-muted">
            ▼
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text">Showing Results</p>
            <p className="text-xs text-text-muted">
              {filteredCount} of {totalCount} tours
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-primary">
              {Math.round((filteredCount / totalCount) * 100) || 0}%
            </p>
            <p className="text-xs text-text-muted">matched</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourFilters;
