import { useState, useEffect } from "react";
import TourGuidesSlider from "../tourGuides/TourGuideSlider.jsx";
import SectionWrapperFull from "../common/SectionWrapper.jsx";
import TitlesHome from "../common/TitlesHome.jsx";
import { TbUserCheck } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import { guideService } from "../../apis/guideService.js";
import { FaSpinner } from "react-icons/fa";

export default function TourGuidesSection() {
  const { t } = useTranslation();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const response = await guideService.getFeaturedGuides(6);
        if (response.success && response.data) {
          // Transform data to match slider format
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
        console.error("Error fetching guides:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [t]);

  // Don't render section if no guides
  if (!loading && guides.length === 0) {
    return null;
  }

  return (
    <SectionWrapperFull className=" py-20 px-5 font-bold text-white text-center ">
      <TitlesHome
        icon={TbUserCheck}
        title={t("tourGuide.homeSection.title")}
        paragraph={t("tourGuide.homeSection.subtitle")}
      />

      <div className="cards" dir="ltr">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400">
            {t("common.loadError") || "Failed to load guides"}
          </div>
        ) : (
          <TourGuidesSlider tourGuides={guides} autoplay={false} />
        )}
      </div>
    </SectionWrapperFull>
  );
}
