import React from "react";

const TourHero = () => {
  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#FFE6A0]/20 to-[#FFD670]/20 border border-[#FFE6A0]/30 mb-6">
            <span className="text-xl">✨</span>
            <span className="text-sm font-medium" style={{ color: "#FFE6A0" }}>
              Premium Tour Experiences
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Discover Egypt's
            <br />
            <span className="bg-linear-to-r from-[#FFE6A0] via-[#FFD670] to-[#FFC940] bg-clip-text text-transparent">
              Timeless Wonders
            </span>
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Journey through 5,000 years of history with expert guides. From
            ancient pyramids to Nile cruises, experience the magic of Egypt like
            never before.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-4 py-3 backdrop-blur-xl bg-white/80 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/10">
              <span className="text-2xl">🏛️</span>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Explore
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  50+ Sites
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 backdrop-blur-xl bg-white/80 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/10">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Rated
                </p>
                <p className="font-bold text-gray-900 dark:text-white">
                  4.8/5.0
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 backdrop-blur-xl bg-white/80 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/10">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Travelers
                </p>
                <p className="font-bold text-gray-900 dark:text-white">50K+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Large Card */}
          <div className="col-span-2 backdrop-blur-xl bg-white/80 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 hover:border-[#FFE6A0]/50 transition-all group">
            <div className="relative h-64 bg-linear-to-br from-[#FFE6A0]/40 via-[#FFD670]/30 to-[#FFC940]/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl transform transition-transform duration-700 group-hover:scale-110">
                  🏛️
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white mb-1">
                  Ancient Pyramids
                </h3>
                <p className="text-sm" style={{ color: "#FFE6A0" }}>
                  Giza & Saqqara
                </p>
              </div>
            </div>
          </div>

          {/* Small Card 1 */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 hover:border-[#FFE6A0]/50 transition-all group">
            <div className="relative h-48 bg-linear-to-br from-blue-900/40 via-cyan-900/30 to-teal-900/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl transform transition-transform duration-700 group-hover:scale-110">
                  🚤
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold text-white">Nile Cruise</h3>
                <p className="text-xs text-cyan-300">River Tours</p>
              </div>
            </div>
          </div>

          {/* Small Card 2 */}
          <div className="backdrop-blur-xl bg-white/80 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200/50 dark:border-white/10 hover:border-[#FFE6A0]/50 transition-all group">
            <div className="relative h-48 bg-linear-to-br from-purple-900/40 via-pink-900/30 to-rose-900/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl transform transition-transform duration-700 group-hover:scale-110">
                  🕌
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold text-white">Heritage</h3>
                <p className="text-xs text-pink-300">Islamic Cairo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourHero;
