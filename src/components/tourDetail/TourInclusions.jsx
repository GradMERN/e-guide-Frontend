import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const TourInclusions = ({ included, excluded }) => {
  return (
    <div className="bg-surface rounded-2xl p-8 border border-border shadow-lg">
      <h2 className="text-3xl font-bold text-text mb-6">What's Included</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Included */}
        <div>
          <h3 className="text-xl font-semibold text-text mb-4">Included</h3>
          <div className="space-y-3">
            {included?.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 rounded-lg mt-0.5 bg-primary/10">
                  <FaCheck className="text-primary" size={12} />
                </div>
                <p className="text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Excluded */}
        <div>
          <h3 className="text-xl font-semibold text-text mb-4">Not Included</h3>
          <div className="space-y-3">
            {excluded?.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 mt-0.5">
                  <FaTimes className="text-red-500" size={12} />
                </div>
                <p className="text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourInclusions;
