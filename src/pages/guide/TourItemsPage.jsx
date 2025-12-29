import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LoadingScreen from "../../components/common/LoadingScreen";
import TourItemsGrid from "../../components/guide/Tour/TourItemsGrid";
import { guideService } from "../../apis/guideService";
import { FaArrowLeft, FaMapMarkerAlt, FaImages, FaClock } from "react-icons/fa";

const TourItemsPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const inputBg = isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await guideService.getTour(tourId);
        if (!mounted) return;
        setTour(res.data);
      } catch (err) {
        toast.error(
          t("guide.tours.errors.loadFailed") || "Failed to load tour"
        );
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [tourId, t]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className={`text-center ${cardBg} rounded-2xl border ${borderColor} p-8 md:p-12 shadow-xl max-w-md w-full`}>
          <div className="mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center mb-4">
              <FaMapMarkerAlt className="text-white text-3xl md:text-4xl" />
            </div>
            <h3 className={`text-xl md:text-2xl font-bold ${textColor} mb-2`}>
              {t("guide.tours.empty") || "Tour Not Found"}
            </h3>
            <p className={`${secondaryText} text-sm md:text-base`}>
              The tour you're looking for doesn't exist or has been removed.
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black rounded-lg hover:from-[#D5B36A] hover:to-[#F0D9A0] transition-all font-semibold shadow-lg shadow-[#C7A15C]/30"
          >
            {t("common.back") || "Go Back"}
          </button>
        </div>
      </div>
    );
  }

  // Calculate tour stats
  const itemsCount = tour?.tourItems?.length || tour?.items?.length || 0;
  const publishedCount = (tour?.tourItems || tour?.items || []).filter(item => item.isPublished).length;

  return (
    <div className="min-h-screen p-3 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className={`${cardBg} rounded-2xl border ${borderColor} shadow-lg p-4 md:p-6 lg:p-8 mb-4 md:mb-6`}>
        <div className="flex flex-col gap-4">
          {/* Back Button & Actions Row */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#C7A15C] to-[#E2C784] text-black rounded-lg hover:from-[#D5B36A] hover:to-[#F0D9A0] transition-all font-medium shadow-md hover:shadow-lg text-sm md:text-base group"
            >
              <FaArrowLeft className="transition-transform group-hover:-translate-x-1" />
              <span className="hidden sm:inline">{t("common.back") || "Back"}</span>
            </button>

            {/* Quick Stats - Desktop Only */}
            <div className="hidden lg:flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${inputBg}`}>
                <FaImages className="text-[#D5B36A]" />
                <span className={`text-sm ${secondaryText}`}>
                  {itemsCount} {t("guide.tourItems.title") || "Items"}
                </span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${inputBg}`}>
                <FaClock className="text-green-500" />
                <span className={`text-sm ${secondaryText}`}>
                  {publishedCount} {t("guide.tours.published") || "Published"}
                </span>
              </div>
            </div>
          </div>

          {/* Tour Title & Description */}
          <div>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gradient-to-r from-[#C7A15C] to-[#E2C784] flex items-center justify-center flex-shrink-0 shadow-md">
                <FaMapMarkerAlt className="text-white text-xl md:text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className={`text-xl md:text-3xl lg:text-4xl font-bold ${textColor} mb-2 break-words`}>
                  {tour?.name || "Untitled Tour"}
                </h1>
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <span className="px-3 py-1 rounded-full bg-[#D5B36A]/20 text-[#D5B36A] font-medium">
                    {t("guide.tours.waypointsTitle") || "Waypoints"}
                  </span>
                  {tour?.place?.name && (
                    <span className={`px-3 py-1 rounded-full ${inputBg} ${secondaryText}`}>
                      📍 {tour.place.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tour Description */}
            {tour?.description && (
              <p className={`${secondaryText} text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-none`}>
                {tour.description}
              </p>
            )}
          </div>

          {/* Mobile Stats */}
          <div className="flex lg:hidden items-center gap-3 pt-3 border-t border-[var(--border)]">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${inputBg} flex-1`}>
              <FaImages className="text-[#D5B36A] text-sm" />
              <span className={`text-xs ${secondaryText}`}>
                {itemsCount} Items
              </span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${inputBg} flex-1`}>
              <FaClock className="text-green-500 text-sm" />
              <span className={`text-xs ${secondaryText}`}>
                {publishedCount} Published
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Items Grid */}
      <div className={`${cardBg} rounded-2xl border ${borderColor} shadow-lg p-4 md:p-6 lg:p-8`}>
        <TourItemsGrid tour={tour} isDarkMode={isDarkMode} />
      </div>

      {/* Floating Action Hint - Mobile */}
      {itemsCount === 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden">
          <div className={`${cardBg} rounded-full px-6 py-3 shadow-2xl border ${borderColor} flex items-center gap-2`}>
            <span className="animate-pulse text-2xl">👆</span>
            <span className={`text-sm ${textColor} font-medium`}>
              {t("guide.tours.addItem") || "Add your first waypoint"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourItemsPage;