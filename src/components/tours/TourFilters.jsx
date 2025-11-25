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
    <div className="sticky top-24 bg-white dark:bg-white/5 rounded-2xl p-6 border border-[#B2A496] dark:border-white/10 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <FaFilter className="text-xl text-[#5E3719] dark:text-[#FFE6A0]" />
        <h2 className="text-2xl font-bold text-[#5E3719] dark:text-white">
          Filters
        </h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#735238] dark:text-gray-300 mb-3">
          Search Tours
        </label>
        <div className="relative group">
          <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 transition-transform group-hover:scale-110 text-[#5E3719] dark:text-[#FFE6A0]"
            size={14}
          />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black/40 rounded-xl text-[#5E3719] dark:text-white text-sm placeholder-[#9D8977] dark:placeholder-gray-500 focus:outline-none transition-all border border-[#B2A496] dark:border-white/10 focus:border-[#5E3719] dark:focus:border-[#FFE6A0] focus:ring-2 focus:ring-[#5E3719]/20 dark:focus:ring-[#FFE6A0]/20"
          />
        </div>
      </div>

      {/* City Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#735238] dark:text-gray-300 mb-3">
          Destination
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-black/40 rounded-xl text-[#5E3719] dark:text-white text-sm focus:outline-none appearance-none cursor-pointer transition-all border border-[#B2A496] dark:border-white/10 focus:border-[#5E3719] dark:focus:border-[#FFE6A0] focus:ring-2 focus:ring-[#5E3719]/20 dark:focus:ring-[#FFE6A0]/20"
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
        <label className="block text-sm font-semibold text-[#735238] dark:text-gray-300 mb-3">
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
                className="w-4 h-4 text-[#5E3719] dark:text-[#FFE6A0] focus:ring-2 focus:ring-[#5E3719] dark:focus:ring-[#FFE6A0]"
              />
              <span className="text-sm text-[#735238] dark:text-gray-300 group-hover:text-[#5E3719] dark:group-hover:text-white transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-[#735238] dark:text-gray-300 mb-3">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-4 py-3 bg-white dark:bg-black/40 rounded-xl text-[#5E3719] dark:text-white text-sm focus:outline-none appearance-none cursor-pointer transition-all border border-[#B2A496] dark:border-white/10 focus:border-[#5E3719] dark:focus:border-[#FFE6A0] focus:ring-2 focus:ring-[#5E3719]/20 dark:focus:ring-[#FFE6A0]/20"
        >
          <option value="popular">Most Popular</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="pt-6 border-t border-[#B2A496] dark:border-white/10">
        <p className="text-sm text-[#886E58] dark:text-gray-400">
          Showing{" "}
          <span className="font-semibold text-[#5E3719] dark:text-[#FFE6A0]">
            {filteredCount}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#5E3719] dark:text-[#FFE6A0]">
            {totalCount}
          </span>{" "}
          tours
        </p>
      </div>
    </div>
  );
};

export default TourFilters;
