import React from "react";
import { FaStar } from "react-icons/fa";

const TourReviews = ({ reviews, ratingsAverage, ratingsCount }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-10 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
        <div>
          <h2 className="text-3xl font-bold text-text">Traveler Reviews</h2>
          <p className="text-text-secondary mt-1">
            Hear from our satisfied travelers
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.floor(ratingsAverage || 0)
                      ? "text-primary"
                      : "text-text-muted"
                  }
                  size={20}
                />
              ))}
            </div>
            <span className="text-3xl font-bold text-text">
              {ratingsAverage?.toFixed(1) || "0.0"}
            </span>
          </div>
          <p className="text-text-secondary">
            Based on {ratingsCount || 0} reviews
          </p>
        </div>
      </div>

      {reviews?.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-surface rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-text">
                      {review.user?.name?.charAt(0) || "T"}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">
                      {review.user?.name || "Traveler"}
                    </h4>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.rating
                              ? "text-primary"
                              : "text-text-muted"
                          }
                          size={12}
                        />
                      ))}
                      <span className="text-xs text-text-muted ml-2">
                        {review.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-text-secondary leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-surface rounded-2xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-4">
            <FaStar className="text-primary" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-text mb-2">
            No Reviews Yet
          </h3>
          <p className="text-text-secondary">
            Be the first to review this tour!
          </p>
        </div>
      )}
    </div>
  );
};

export default TourReviews;
