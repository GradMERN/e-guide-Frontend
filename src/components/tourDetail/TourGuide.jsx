import React from "react";
import { FaStar, FaCheckCircle, FaAward, FaUsers } from "react-icons/fa";

const TourGuide = ({ guide }) => {
  if (!guide) return null;

  return (
    <div className="bg-surface rounded-2xl p-8 border border-border shadow-lg">
      <h2 className="text-3xl font-bold text-text mb-6">Your Tour Guide</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Guide Image/Avatar */}
        <div className="flex-shrink-0">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-primary/30">
            {guide.avatar?.url ? (
              <img
                src={guide.avatar.url}
                alt={`${guide.firstName} ${guide.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/40 via-secondary/30 to-tertiary/20 flex items-center justify-center">
                <span className="text-6xl">
                  {guide.firstName?.charAt(0) || "G"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Guide Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-2xl font-bold text-text">
              {guide.firstName} {guide.lastName}
            </h3>
            <FaCheckCircle className="text-primary" size={20} />
          </div>

          <p className="text-lg mb-6 text-primary font-medium">
            Certified Egyptologist
          </p>

          {/* Guide Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <FaStar className="text-primary" size={16} />
                <span className="text-xl font-bold text-text">4.9</span>
              </div>
              <p className="text-xs text-text-muted">Guide Rating</p>
            </div>

            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <FaAward className="text-secondary" size={16} />
                <span className="text-xl font-bold text-text">15+</span>
              </div>
              <p className="text-xs text-text-muted">Years Exp.</p>
            </div>

            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <FaUsers className="text-tertiary" size={16} />
                <span className="text-xl font-bold text-text">500+</span>
              </div>
              <p className="text-xs text-text-muted">Tours Guided</p>
            </div>

            <div className="bg-background rounded-xl p-4 border border-border">
              <div className="mb-1">
                <span className="text-xl font-bold text-text">98%</span>
              </div>
              <p className="text-xs text-text-muted">Satisfaction</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-text mb-3">
              About Your Guide
            </h4>
            <p className="text-text-secondary leading-relaxed">
              With over 15 years of experience guiding tours throughout Egypt,
              {guide.firstName} brings ancient history to life with engaging
              storytelling and deep expertise in Egyptian archaeology and
              culture.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuide;
