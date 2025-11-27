import React from "react";

const TourHero = () => {
  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-6">
            <span className="text-xl">✨</span>
            <span className="text-sm font-medium text-text">
              Premium Tour Experiences
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-text">
            Discover Egypt's
            <br />
            <span className="bg-linear-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              Timeless Wonders
            </span>
          </h1>

          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Journey through 5,000 years of history with expert guides. From
            ancient pyramids to Nile cruises, experience the magic of Egypt like
            never before.
          </p>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
              <span className="text-2xl">🏛️</span>
              <div>
                <p className="text-xs text-text-muted">Explore</p>
                <p className="font-bold text-text">50+ Sites</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-xs text-text-muted">Rated</p>
                <p className="font-bold text-text">4.8/5.0</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
              <span className="text-2xl">👥</span>
              <div>
                <p className="text-xs text-text-muted">Travelers</p>
                <p className="font-bold text-text">50K+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Image Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Large Card */}
          <div className="col-span-2 bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary transition-all group">
            <div className="relative h-64 bg-linear-to-br from-primary/30 via-secondary/20 to-tertiary/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl transform transition-transform duration-700 group-hover:scale-110">
                  🏛️
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-tertiary/40 dark:from-light-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-light-900 mb-1">
                  Ancient Pyramids
                </h3>
                <p className="text-sm text-light-800">Giza & Saqqara</p>
              </div>
            </div>
          </div>

          {/* Small Card 1 */}
          <div className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary transition-all group">
            <div className="relative h-48 bg-linear-to-br from-secondary/40 via-tertiary/30 to-border/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl transform transition-transform duration-700 group-hover:scale-110">
                  🚤
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-tertiary/40 dark:from-light-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold text-light-900">
                  Nile Cruise
                </h3>
                <p className="text-xs text-light-800">River Tours</p>
              </div>
            </div>
          </div>

          {/* Small Card 2 */}
          <div className="bg-surface rounded-2xl overflow-hidden border border-border hover:border-primary transition-all group">
            <div className="relative h-48 bg-linear-to-br from-tertiary/40 via-border/30 to-light-600/40">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl transform transition-transform duration-700 group-hover:scale-110">
                  🕌
                </div>
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-tertiary/40 dark:from-light-900/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-lg font-bold text-light-900">Heritage</h3>
                <p className="text-xs text-light-800">Islamic Cairo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourHero;
