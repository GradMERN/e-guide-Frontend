import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import TourItemsGrid from "../../components/guide/tour-items/TourItemsGrid";
import { guideService } from "../../apis/guideService";

const TourItemsPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useAuth();
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
        toast.error("Failed to load tour");
      } finally {
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [tourId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!tour) return <div className="p-6">Tour not found</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col lg:flex-row items-center lg:justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 bg-[#D5B36A] rounded text-black"
        >
          Back
        </button>

        <h2 className={`text-2xl font-bold ${textColor}`}>
          Waypoints — {tour.name}
        </h2>
      </div>
      <TourItemsGrid tour={tour} isDarkMode={isDarkMode} />
    </div>
  );
};

export default TourItemsPage;
