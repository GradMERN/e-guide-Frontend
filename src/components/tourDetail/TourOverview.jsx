import React from "react";
import { FaLanguage, FaTags } from "react-icons/fa";

const TourOverview = ({ tour }) => {
  return (
    <div className="bg-surface rounded-2xl p-8 border border-border shadow-lg">
      <h2 className="text-3xl font-bold text-text mb-6">Tour Overview</h2>
      <p className="text-lg text-text-secondary leading-relaxed mb-8">
        {tour.description}
      </p>

      {tour.summary && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-text mb-4">Highlights</h3>
          <p className="text-base text-text-secondary leading-relaxed">
            {tour.summary}
          </p>
        </div>
      )}

      {/* Languages */}
      {tour.languages && tour.languages.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <FaLanguage className="text-primary" />
            Available Languages
          </h3>
          <div className="flex flex-wrap gap-2">
            {tour.languages.map((language, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-lg bg-tertiary/10 text-sm font-medium text-text"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {tour.tags && tour.tags.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <FaTags className="text-secondary" />
            Tour Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tour.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-lg bg-primary/10 text-sm font-medium text-text"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TourOverview;
