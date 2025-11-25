import React from "react";
import { FaStar, FaCheckCircle, FaLanguage, FaAward } from "react-icons/fa";

const TourGuide = ({ guide }) => {
  return (
    <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 border border-white/10">
      <h2 className="text-3xl font-bold text-white mb-6">Your Tour Guide</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Guide Image */}
        <div className="flex-shrink-0">
          <div
            className="w-32 h-32 rounded-2xl overflow-hidden border-4"
            style={{ borderColor: "#FFE6A0" }}
          >
            <div className="w-full h-full bg-gradient-to-br from-[#FFE6A0]/40 via-[#FFD670]/30 to-[#FFC940]/40 flex items-center justify-center">
              <span className="text-6xl">{guide.emoji || "👨‍🏫"}</span>
            </div>
          </div>
        </div>

        {/* Guide Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-2xl font-bold text-white">{guide.name}</h3>
            <FaCheckCircle style={{ color: "#FFE6A0" }} size={20} />
          </div>

          <p className="text-lg mb-4" style={{ color: "#FFE6A0" }}>
            {guide.title}
          </p>

          <p className="text-gray-300 mb-6 leading-relaxed">{guide.bio}</p>

          {/* Guide Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <FaStar style={{ color: "#FFE6A0" }} size={16} />
                <span className="text-xl font-bold text-white">
                  {guide.rating}
                </span>
              </div>
              <p className="text-xs text-gray-400">Rating</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <FaAward style={{ color: "#FFE6A0" }} size={16} />
                <span className="text-xl font-bold text-white">
                  {guide.toursCompleted}+
                </span>
              </div>
              <p className="text-xs text-gray-400">Tours</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <FaLanguage style={{ color: "#FFE6A0" }} size={16} />
                <span className="text-xl font-bold text-white">
                  {guide.languages.length}
                </span>
              </div>
              <p className="text-xs text-gray-400">Languages</p>
            </div>

            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="mb-1">
                <span className="text-xl font-bold text-white">
                  {guide.experience}
                </span>
              </div>
              <p className="text-xs text-gray-400">Years Exp.</p>
            </div>
          </div>

          {/* Languages */}
          <div className="mt-6">
            <p className="text-sm text-gray-400 mb-2">Languages:</p>
            <div className="flex flex-wrap gap-2">
              {guide.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: "rgba(255, 230, 160, 0.1)",
                    color: "#FFE6A0",
                  }}
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Specialties */}
          {guide.specialties && (
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Specialties:</p>
              <div className="flex flex-wrap gap-2">
                {guide.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium text-white"
                    style={{ backgroundColor: "rgba(255, 230, 160, 0.2)" }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourGuide;
