import React from "react";
import { useTranslation } from "react-i18next";

import nileCruiseImage from "../../assets/images/tours/Nile.jpg";
import islamicCairoImage from "../../assets/images/tours/islamic.jpg";

const TourHero = () => {
  const { t } = useTranslation();

  const images = {
    pyramids:
      "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    nileCruise: nileCruiseImage,
    islamicCairo: islamicCairoImage,
  };

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 mb-6">
            <span className="text-xl">✨</span>
            <span className="text-sm font-medium text-text">
              {t("tourHero.badge")}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-text">
            {t("tourHero.titleLine1")}
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-tertiary bg-clip-text text-transparent">
              {t("tourHero.titleLine2")}
            </span>
          </h1>

          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            {t("tourHero.description")}
          </p>

          <div className="flex flex-wrap gap-4">
            {["sites", "rating", "travelers"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border"
              >
                <span className="text-2xl">
                  {t(`tourHero.stats.${item}.icon`)}
                </span>
                <div>
                  <p className="text-xs text-text-muted">
                    {t(`tourHero.stats.${item}.label`)}
                  </p>
                  <p className="font-bold text-text">
                    {t(`tourHero.stats.${item}.value`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-surface rounded-2xl overflow-hidden border border-border/40 hover:border-primary transition-all group">
            <div className="relative h-64">
              <img
                src={images.pyramids}
                alt={t("tourHero.cards.pyramids.alt")}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-bold text-white mb-1">
                  {t("tourHero.cards.pyramids.title")}
                </h3>
                <p className="text-sm text-gray-200">
                  {t("tourHero.cards.pyramids.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {["nile", "islamic"].map((item) => (
            <div
              key={item}
              className="bg-surface rounded-2xl overflow-hidden border border-border/40 hover:border-primary transition-all group"
            >
              <div className="relative h-48">
                <img
                  src={
                    item === "nile" ? images.nileCruise : images.islamicCairo
                  }
                  alt={t(`tourHero.cards.${item}.alt`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-lg font-bold text-white">
                    {t(`tourHero.cards.${item}.title`)}
                  </h3>
                  <p className="text-xs text-gray-200">
                    {t(`tourHero.cards.${item}.subtitle`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourHero;
