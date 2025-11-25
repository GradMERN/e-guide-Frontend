import React from "react";

const TourOverview = ({ tour }) => {
  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10">
      <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
      <p className="text-lg text-gray-300 leading-relaxed mb-6">
        {tour.description}
      </p>

      {tour.summary && (
        <p className="text-base text-gray-400 leading-relaxed">
          {tour.summary}
        </p>
      )}
    </div>
  );
};

export default TourOverview;
