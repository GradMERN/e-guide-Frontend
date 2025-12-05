import React from "react";
import { FaCheck, FaTimes, FaLanguage, FaUserTie } from "react-icons/fa";

const TourInclusions = ({ included, excluded }) => {
  // If included is empty, show default based on languages
  const displayIncluded =
    included && included.length > 0
      ? included
      : [
          "Professional Egyptologist guide",
          "Entrance fees to all sites",
          "Bottled water",
        ];

  // If excluded is empty, show defaults
  const displayExcluded =
    excluded && excluded.length > 0
      ? excluded
      : ["Gratuities (optional)", "Personal expenses", "Travel insurance"];

  return (
    <div className="bg-surface rounded-2xl p-8 border border-border shadow-lg">
      <h2 className="text-3xl font-bold text-text mb-6">What's Included</h2>

      <div className="space-y-6">
        {/* Included */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <FaCheck className="text-primary" size={16} />
            </div>
            <h3 className="text-xl font-semibold text-text">Included</h3>
          </div>
          <div className="space-y-3">
            {displayIncluded.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className="p-2 rounded-lg mt-0.5"
                  style={{ backgroundColor: "rgba(255, 230, 160, 0.1)" }}
                >
                  <FaCheck className="text-primary" size={12} />
                </div>
                <p className="text-text-secondary">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Excluded */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-red-500/10">
              <FaTimes className="text-red-500" size={16} />
            </div>
            <h3 className="text-xl font-semibold text-text">Not Included</h3>
          </div>
          <div className="space-y-3">
            {displayExcluded.map((item, index) => (
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
