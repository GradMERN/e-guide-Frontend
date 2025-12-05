import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const TourInclusions = ({ tour }) => {
  const included = [
    "Professional Egyptologist guide",
    "Entrance fees to all sites",
    "Bottled water",
  ];

  const excluded = [
    "Gratuities (optional)",
    "Personal expenses",
    "Travel insurance",
  ];

  return (
    <div className="bg-surface rounded-2xl p-6">
      <h3 className="text-xl font-bold text-text mb-6">What's Included</h3>

      <div className="space-y-8">
        {/* Included */}
        <div>
          <h4 className="text-lg font-semibold text-text mb-4">Included</h4>
          <div className="space-y-3">
            {included.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-green-500" size={14} />
                </div>
                <span className="text-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Excluded */}
        <div>
          <h4 className="text-lg font-semibold text-text mb-4">Not Included</h4>
          <div className="space-y-3">
            {excluded.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <FaTimes className="text-red-500" size={14} />
                </div>
                <span className="text-text-secondary">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourInclusions;
