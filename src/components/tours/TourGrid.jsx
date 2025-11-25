import React from "react";
import { FaSearch } from "react-icons/fa";
import TourCard from "./TourCard";

const TourGrid = ({ tours }) => {
  if (tours.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-gradient-to-r from-[#5E3719] to-[#735238] dark:from-[#FFE6A0]/20 dark:to-[#FFD670]/20">
          <FaSearch className="text-4xl text-white dark:text-[#FFE6A0]" />
        </div>
        <h3 className="text-2xl font-bold text-[#5E3719] dark:text-white mb-3">
          No Tours Found
        </h3>
        <p className="text-[#735238] dark:text-gray-400 text-lg">
          Try adjusting your filters to discover more adventures
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {tours.map((tour) => (
        <TourCard key={tour._id} tour={tour} />
      ))}
    </div>
  );
};

export default TourGrid;
