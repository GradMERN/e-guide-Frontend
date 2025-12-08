import React from "react";
import { FaTags, FaLanguage, FaListUl } from "react-icons/fa";

const TourOverview = ({ tour }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-10 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
        <div>
          <h2 className="text-3xl font-bold text-text">Tour Description</h2>
          <p className="text-text-secondary mt-1">
            Discover what makes this tour special
          </p>
        </div>
      </div>

      <div className="mb-10">
        <p className="text-text-secondary leading-relaxed text-lg">
          {tour.description}
        </p>
      </div>

      {/* Categories & Tags */}
      <div className="space-y-8">
        {/* Categories */}
        {tour.categories && tour.categories.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <FaListUl className="text-primary" size={18} />
              </div>
              <h3 className="text-xl font-semibold text-text">Categories</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {tour.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-4 py-2.5 rounded-xl bg-primary/5 text-text text-sm font-medium"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tour.tags && tour.tags.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-secondary/10">
                <FaTags className="text-secondary" size={18} />
              </div>
              <h3 className="text-xl font-semibold text-text">Tags</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tour.tags.slice(0, 10).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-secondary/5 text-text-secondary text-sm hover:text-text transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourOverview;
