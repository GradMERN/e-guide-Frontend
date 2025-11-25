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
    <div className="sticky top-24 backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <FaFilter style={{ color: "#FFE6A0" }} className="text-xl" />
        <h2 className="text-2xl font-bold text-white">Filters</h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Search Tours
        </label>
        <div className="relative group">
          <FaSearch
            style={{ color: "#FFE6A0" }}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 transition-transform group-hover:scale-110"
            size={14}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-black/40 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none transition-all"
            style={{
              borderColor: "rgba(255, 230, 160, 0.2)",
              borderWidth: "1px",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#FFE6A0";
              e.target.style.boxShadow = "0 0 0 2px rgba(255, 230, 160, 0.3)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255, 230, 160, 0.2)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>

      {/* City Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Destination
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-4 py-3 bg-black/40 rounded-xl text-white text-sm focus:outline-none appearance-none cursor-pointer transition-all"
          style={{
            backgroundImage: "none",
            borderColor: "rgba(255, 230, 160, 0.2)",
            borderWidth: "1px",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#FFE6A0";
            e.target.style.boxShadow = "0 0 0 2px rgba(255, 230, 160, 0.3)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 230, 160, 0.2)";
            e.target.style.boxShadow = "none";
          }}
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
        <label className="block text-sm font-semibold text-gray-300 mb-3">
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
                className="w-4 h-4 focus:ring-2"
                style={{
                  accentColor: "#FFE6A0",
                }}
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 bg-black/40 rounded-xl text-white text-sm focus:outline-none appearance-none cursor-pointer transition-all"
          style={{
            backgroundImage: "none",
            borderColor: "rgba(255, 230, 160, 0.2)",
            borderWidth: "1px",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#FFE6A0";
            e.target.style.boxShadow = "0 0 0 2px rgba(255, 230, 160, 0.3)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 230, 160, 0.2)";
            e.target.style.boxShadow = "none";
          }}
        >
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="pt-6 border-t border-white/10">
        <p className="text-sm text-gray-400">
          Showing{" "}
          <span style={{ color: "#FFE6A0" }} className="font-semibold">
            {filteredCount}
          </span>{" "}
          of{" "}
          <span style={{ color: "#FFE6A0" }} className="font-semibold">
            {totalCount}
          </span>{" "}
          tours
        </p>
      </div>
    </div>
  );
};

export default TourFilters;
