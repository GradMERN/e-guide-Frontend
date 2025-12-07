import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdOutlineTour } from "react-icons/md";
import { useTours } from "../../store/hooks";
import { motion, AnimatePresence } from "motion/react";
import TourCard from "../tours/TourCard"; 
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";
import { LoadingSkeleton, ErrorState, EmptyState } from "../common/LoadingStates";

export default function TourPackagesSection() {
  const { t } = useTranslation();
  const { tours, loading, error, fetchTours } = useTours(); 
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

    useEffect(() => {
      fetchTours({ isPublished: true });
    }, [fetchTours]);

    useEffect(() => {
      const updateConstraints = () => {
        if (sliderRef.current) {
          const scrollWidth = sliderRef.current.scrollWidth;
          const offsetWidth = sliderRef.current.offsetWidth;
          setDragConstraints({ left: -(scrollWidth - offsetWidth), right: 0 });
        }
      };
      updateConstraints();
      window.addEventListener("resize", updateConstraints);
      return () => window.removeEventListener("resize", updateConstraints);
  }, [tours]);

    const handleViewAllTours = () => {
      navigate("/tours");
    };

  return (
    <SectionWrapperFull>
      <TitlesHome icon={MdOutlineTour} title={t("tourPackages.title")} paragraph={t("tourPackages.description")}/>

      {loading && <LoadingSkeleton count={6} type="card" />}

      {error && !loading && (
        <ErrorState error={error} title={t("tourPackages.loadError")} onRetry={() => fetchTours({ isPublished: true })} retryText={t("common.retry")}/>
      )}

      {!loading && !error && tours.length === 0 && (
        <EmptyState icon={MdOutlineTour} title={t("tourPackages.noTours")} message={t("tourPackages.noToursMessage")}
          primaryAction={{label: t("tourPackages.contactForCustom"), onClick: () => navigate("/contact")}}
          secondaryAction={{label: t("tourPackages.refresh"),onClick: () => fetchTours({ isPublished: true })}}
        />
      )}

      {!loading && !error && tours.length > 0 && (
        <>
          <div className="hidden lg:grid lg:grid-cols-3 gap-6 xl:gap-8 max-w-7xl mx-auto">
            {tours.slice(0, 6).map((tour, index) => (
              <motion.div key={tour._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }} className="h-full">
                <TourCard tour={tour} />
              </motion.div>
            ))}
          </div>

          <div className="lg:hidden max-w-full mx-auto overflow-hidden">
            <motion.div  ref={sliderRef} className="flex gap-4 py-4 px-2 cursor-grab active:cursor-grabbing" drag="x" dragConstraints={dragConstraints} dragElastic={0.18}>
              {tours.slice(0, 6).map((tour, index) => (
                <motion.div  key={tour._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: index * 0.1 }} className="w-[280px] sm:w-[320px] shrink-0" whileTap={{ scale: 0.96 }}>
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }}  whileInView={{ opacity: 1, y: 0 }}  viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }}  className="text-center mt-8 sm:mt-12 lg:mt-16 px-4">
            <motion.button onClick={handleViewAllTours} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary-hero text-sm sm:text-base px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-auto">
              <span className="flex items-center justify-center gap-2">
                {t("tourPackages.viewAll")}
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.button>
          </motion.div>
        </>
      )}
    </SectionWrapperFull>
  );
};