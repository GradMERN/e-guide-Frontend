import React from "react";
import { FaFilter, FaSearch } from "react-icons/fa";

const TourFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCity,
  setSelectedCity,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  cities,
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="sticky top-24 bg-surface rounded-2xl p-6 border border-border shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <FaFilter className="text-xl text-primary" />
        <h2 className="text-2xl font-bold text-text">Filters</h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-secondary mb-3">
          Search Tours
        </label>
        <div className="relative group">
          <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 transition-transform group-hover:scale-110 text-primary"
            size={14}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-surface rounded-xl text-text text-sm placeholder-text-muted focus:outline-none transition-all border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* City Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-secondary mb-3">
          Destination
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-4 py-3 bg-surface rounded-xl text-text text-sm focus:outline-none appearance-none cursor-pointer transition-all border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city === "all" ? "All Cities" : city}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-secondary mb-3">
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
              className="flex items-center gap-3 cursor-pointer group"
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

      {/* Sort By */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-text-secondary mb-3">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 bg-surface rounded-xl text-text text-sm focus:outline-none appearance-none cursor-pointer transition-all border border-border focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="pt-6 border-t border-border">
        <p className="text-sm text-text-muted">
          Showing{" "}
          <span className="font-semibold text-primary">{filteredCount}</span> of{" "}
          <span className="font-semibold text-primary">{totalCount}</span> tours
        </p>
      </div>
    </div>
  );
};

export default TourFilters;
