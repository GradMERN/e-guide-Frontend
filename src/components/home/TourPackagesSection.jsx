import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdOutlineTour } from "react-icons/md";
import { useTours } from "../../store/hooks";
import { motion, AnimatePresence } from "motion/react";
import TourCard from "../tours/TourCard"; 
import TitlesHome from "../common/TitlesHome";
import SectionWrapperFull from "../common/SectionWrapper";

export default function TourPackagesSection() {
  const { t } = useTranslation();
  const { tours, fetchTours } = useTours(); 
  const navigate = useNavigate();

    useEffect(() => {
      fetchTours({ isPublished: true });
    }, [fetchTours]);

    const handleViewAllTours = () => {
      navigate("/tours");
    };
  return (
    <SectionWrapperFull>
      <TitlesHome icon={MdOutlineTour} title={t("tourPackages.title")} paragraph={t("tourPackages.description")}/>
      <div className="lg:grid lg:grid-cols-3 gap-6 xl:gap-8 max-w-7xl mx-auto">
        {tours.slice(0, 6).map((tour) => (
          <div key={tour._id} className="h-full">
            <TourCard tour={tour} />
          </div>
        ))}
      </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.2 }} className="text-center mt-6 sm:mt-12">
          <motion.button onClick={handleViewAllTours} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}className="btn-primary-hero text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
            <span>View All Packages</span>
          </motion.button>
        </motion.div>
    </SectionWrapperFull>
  );
}
