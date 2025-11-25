import React from "react";
import { FaSearch } from "react-icons/fa";
import TourCard from "./TourCard";

const TourGrid = ({ tours }) => {
  if (tours.length === 0) {
    return (
      <div className="text-center py-20">
        <div
          className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
          style={{
            background:
              "linear-gradient(to right, rgba(255, 230, 160, 0.2), rgba(255, 214, 112, 0.2))",
          }}
        >
          <FaSearch style={{ color: "#FFE6A0" }} className="text-4xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          No Tours Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
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
