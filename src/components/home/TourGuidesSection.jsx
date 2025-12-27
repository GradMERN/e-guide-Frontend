import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TourGuidesSlider from "../tourGuides/TourGuideSlider.jsx";
import SectionWrapperFull from "../common/SectionWrapper.jsx";
import TitlesHome from "../common/TitlesHome.jsx";
import { TbUserCheck } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { guideService } from "../../apis/guideService.js";
import { LoadingSkeleton, ErrorState, EmptyState } from "../common/LoadingStates.jsx";

export default function TourGuidesSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await guideService.getFeaturedGuides(6);
      
      if (response.success && response.data) {
        const transformedGuides = response.data.map((guide) => ({
          id: guide._id,
          name: guide.name || `${guide.firstName} ${guide.lastName}`,
          designation:
            guide.city && guide.country
              ? `${guide.city}, ${guide.country}`
              : t("tourGuide.homeSection.expertGuide") || "Expert Tour Guide",
          quote:
            t("tourGuide.homeSection.defaultQuote") ||
            "Discover the wonders of Egypt with me.",
          src: guide.avatar?.url || null,
          rating: guide.rating || 0,
          totalReviews: guide.totalReviews || 0,
          toursCount: guide.toursCount || 0,
        }));
        setGuides(transformedGuides);
      }
    } catch (err) {
      setError(true); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [t]);

  return (
    <SectionWrapperFull className="py-20 px-5 font-bold text-white text-center">
      <div className="max-w-7xl mx-auto">
        <TitlesHome
          icon={TbUserCheck}
          title={t("tourGuide.homeSection.title")}
          paragraph={t("tourGuide.homeSection.subtitle")}
        />

        <div className="cards mt-10" dir="ltr">

          {loading && <LoadingSkeleton count={3} type="guide" />}

          {!loading && error && (
            <ErrorState 
              // We call the translation key directly here
              error={t("tourGuide.homeSection.loadError")} 
              onRetry={fetchGuides} 
              title={t("tourGuide.homeSection.errorTitle")} 
              retryText={t("common.retry")}
            />
          )}

          {!loading && !error && guides.length === 0 && (
            <EmptyState
              icon={TbUserCheck}
              title={t("tourGuide.homeSection.noGuidesTitle") || "No Guides Found"}
              message={t("tourGuide.homeSection.noGuidesMessage")}
              primaryAction={{
                label: t("common.browseTours"),
                onClick: () => navigate("/tours")
              }}
              secondaryAction={{
                label: t("common.retry"),
                onClick: fetchGuides
              }}
            />
          )}

          {!loading && !error && guides.length > 0 && (
            <TourGuidesSlider tourGuides={guides} autoplay={false} />
          )}
        </div>
      </div>
    </SectionWrapperFull>
  );
}