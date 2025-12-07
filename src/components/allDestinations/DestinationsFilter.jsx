import React from "react";
import { FaFilter, FaSearch, FaMapMarkerAlt, FaSortAmountDown } from "react-icons/fa";
import CustomDropdown from "./CustomDropdown";

const DestinationsFilter = ({
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    sortBy,
    setSortBy,
    regions,
    filteredCount,
    totalCount,
}) => {

    const regionOptions = regions.map((r) => ({
        value: r,
        label: r === "all" ? "All Regions" : r,
    }));

    const sortOptions = [
        { value: "recommended", label: "Recommended" },
        { value: "price-low", label: "Price: Low to High" },
        { value: "price-high", label: "Price: High to Low" },
        { value: "rating", label: "Highest Rated" },
    ];

    return (
        <div className="sticky top-24 bg-surface rounded-2xl p-6 border border-border shadow-2xl overflow-hidden">

            <div className="flex items-center gap-3 mb-6">
                <FaFilter className="text-xl text-[#c7a15c]" />
                <h2 className="text-2xl font-bold text-text">Filters</h2>
            </div>


            <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-text-secondary mb-3">
                    <FaSearch className="text-xs text-[#c7a15c]" /> Search Destinations
                </label>
                <div className="relative group">
                    <input type="text" placeholder="e.g. Cairo, Luxor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-surface rounded-xl text-text text-sm placeholder-text-muted outline-none transition-all border border-border hover:border-[#c7a15c] focus:border-[#c7a15c] focus:ring-1 focus:ring-[#c7a15c]" />
                    <FaSearch
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 transition-colors text-text-muted group-hover:text-[#c7a15c]"
                        size={14} />
                </div>
            </div>


            <CustomDropdown
                label="Region"
                icon={FaMapMarkerAlt}
                value={selectedRegion}
                options={regionOptions}
                onChange={setSelectedRegion} />


            <CustomDropdown
                label="Sort By"
                icon={FaSortAmountDown}
                value={sortBy}
                options={sortOptions}
                onChange={setSortBy} />


            <div className="pt-6 border-t border-border">
                <p className="text-sm text-text-muted">
                    Showing <span className="font-semibold text-[#c7a15c]">{filteredCount}</span> of{" "}
                    <span className="font-semibold text-[#c7a15c]">{totalCount}</span> destinations
                </p>
            </div>
        </div>
    );
};

export default DestinationsFilter;