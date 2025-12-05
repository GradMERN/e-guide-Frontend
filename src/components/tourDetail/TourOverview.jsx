import React from "react";
import { FaLanguage, FaTags, FaListUl } from "react-icons/fa";

const TourOverview = ({ tour }) => {
  return (
    <div className="bg-surface rounded-2xl p-8 border border-border shadow-lg">
      <h2 className="text-3xl font-bold text-text mb-6">Tour Overview</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-text mb-4">Description</h3>
        <p className="text-lg text-text-secondary leading-relaxed">
          {tour.description}
        </p>
      </div>

      {/* Categories - from model */}
      {tour.categories && tour.categories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <FaListUl className="text-primary" />
            Tour Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {tour.categories.map((category, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-lg bg-primary/10 text-sm font-medium text-text"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages - from model */}
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

      {/* Tags - from model */}
      {tour.tags && tour.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <FaTags className="text-secondary" />
            Tour Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tour.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-lg bg-secondary/10 text-sm font-medium text-text"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Difficulty Level */}
    </div>
  );
};

export default TourOverview;
