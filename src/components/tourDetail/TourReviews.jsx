"use client";
import React from "react";
import { FaStar } from "react-icons/fa";
import { InfiniteMovingCards } from "../ui/InfiniteMovingCards";

const TourReviews = ({ reviews, ratingsAverage, ratingsQuantity }) => {
  // Transform reviews to match the infinite cards format
  const reviewsForCards = reviews.map((review) => ({
    quote: review.comment,
    name: review.user.name,
    title: `${review.rating} stars • ${review.date}`,
  }));

  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white">Reviews</h2>

        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-bold" style={{ color: "#FFE6A0" }}>
                {ratingsAverage}
              </span>
              <FaStar style={{ color: "#FFE6A0" }} size={24} />
            </div>
            <p className="text-sm text-gray-400">{ratingsQuantity} reviews</p>
          </div>
        </div>
      </div>

      <div className="rounded-md flex flex-col antialiased items-center justify-center relative overflow-hidden -mx-8">
        <InfiniteMovingCards
          items={reviewsForCards}
          direction="right"
          speed="slow"
        />
      </div>
    </div>
  );
};

export default TourReviews;
