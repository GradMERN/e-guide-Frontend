import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import {
  Star,
  MapPin,
  Languages,
  Award,
  BadgeCheck,
  BookOpen,
  Sparkles,
  Crown,
  Calendar,
  Users,
  Clock,
} from "lucide-react";
import { guideService } from "../../apis/guideService";
import TourCard from "../tours/TourCard";
import TourGuideNotFoundScreen from "./TourGuideNotFoundScreen";
import LoadingScreen from "../common/LoadingScreen";

const StatBadge = ({ icon, text, sub }) => (
  <div className="flex items-center gap-1.5 guide-profile-icon bg-glass-bg px-2.5 py-1.5 rounded-full border border-glass-border shrink-0 max-w-full">
    <span className="shrink-0">{icon}</span>
    <span className="text-[10px] sm:text-xs font-medium truncate">{text}</span>
    {sub && (
      <span className="text-[10px] text-gray-500 hidden sm:inline">{sub}</span>
    )}
  </div>
);

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 min-w-[100px] pb-4 pt-2 text-sm font-bold transition-colors relative text-center whitespace-nowrap ${
      active ? "guide-profile-tab" : "text-gray-500 hover:text-gray-300"
    }`}
  >
    {label}
    {active && (
      <motion.div
        layoutId="tabLine"
        className="absolute bottom-0 left-0 right-0  guide-profile-line"
      />
    )}
  </button>
);

export default function TourGuideProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchGuideProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await guideService.getGuideProfile(id);
        if (response.success && response.data) {
          setGuide(response.data);
        } else {
          setError("Guide not found");
        }
      } catch (err) {
        console.error("Error fetching guide profile:", err);
        setError(err.response?.data?.message || "Failed to load guide profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGuideProfile();
    }
  }, [id]);

  if (loading) return <LoadingScreen />;
  if (error || !guide) return <TourGuideNotFoundScreen navigate={navigate} />;

  // Default cover image
  const coverImage =
    "https://images.unsplash.com/photo-1568603417739-95a3ee515c00?q=80&w=1600&auto=format&fit=crop";

  // Get initials for avatar fallback
  const getInitials = () => {
    const first = guide.firstName?.[0] || "";
    const last = guide.lastName?.[0] || "";
    return (first + last).toUpperCase();
  };

  // Format member since date
  const memberSince = guide.createdAt
    ? new Date(guide.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div
      dir="ltr"
      className="min-h-screen  guide-profile-bg  font-sans pb-24 selection:bg-[#C7A15C] selection:text-black overflow-x-hidden"
    >
      <div className="relative h-[30vh] sm:h-[40vh] w-full guide-profile-bg">
        <img
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0" />
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 relative -mt-30 z-10">
        <div className="flex flex-wrap md:flex-nowrap gap-4 items-end mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative shrink-0 mx-auto md:mx-0"
          >
            <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border-4 sm:border-[6px] border-neutral-950 overflow-hidden shadow-2xl bg-neutral-800">
              {guide.avatar?.url ? (
                <img
                  src={guide.avatar.url}
                  alt={guide.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#C7A15C]/20 text-[#C7A15C] text-3xl sm:text-5xl font-bold">
                  {getInitials()}
                </div>
              )}
            </div>
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-[#C7A15C] text-black p-1.5 rounded-full border-[3px] border-neutral-950 shadow-lg">
              <Award size={14} className="sm:w-5 sm:h-5" />
            </div>
          </motion.div>

          <div className="pb-1 text-center md:text-left flex-1 min-w-0 w-full">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold guide-profile-title tracking-tight wrap-break-word leading-tight">
              {guide.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-1 mb-3">
              <span className="guide-profile-icon text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                {t("guideProfile.designation", "Professional Tour Guide")}
              </span>
              <BadgeCheck size={14} className="guide-profile-icon" />
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 ">
              <StatBadge
                icon={<Star size={10} className="guide-profile-icon" />}
                text={guide.rating || t("guideProfile.newGuide", "New")}
                sub={guide.totalReviews ? `(${guide.totalReviews})` : null}
              />
              {guide.city && (
                <StatBadge
                  icon={<MapPin size={10} className="guide-profile-icon" />}
                  text={guide.city}
                />
              )}
              {guide.languages?.length > 0 && (
                <StatBadge
                  icon={<Languages size={10} className="guide-profile-icon" />}
                  text={`${guide.languages.length} ${t(
                    "guideProfile.langs",
                    "Langs"
                  )}`}
                />
              )}
              <StatBadge
                icon={<Crown size={10} className="guide-profile-icon" />}
                text={`${guide.toursCount} ${t("guideProfile.tours", "Tours")}`}
              />
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/5  pt-2 mb-8">
          <div className="flex w-full overflow-x-auto no-scrollbar gap-2 sm:gap-0">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
              label={t("guideProfile.overview", "Overview")}
            />
            <TabButton
              active={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
              label={`${t("guideProfile.reviews", "Reviews")} (${
                guide.totalReviews || 0
              })`}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-12 "
            >
              {guide.bio && (
                <section>
                  <h3 className="text-lg md:text-2xl font-bold guide-profile-title mb-3 flex items-center gap-2 ">
                    <BookOpen size={18} className="guide-profile-icon" />{" "}
                    {t("guideProfile.biography", "Biography")}
                  </h3>
                  <p className="guide-profile-subtitle leading-relaxed font-light text-sm sm:text-lg wrap-break-word">
                    {guide.bio}
                  </p>
                </section>
              )}

              <section>
                <h3 className="text-lg md:text-2xl font-bold guide-profile-title mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="guide-profile-icon" />{" "}
                  {t("guideProfile.aboutMe", "About Me")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {guide.languages?.length > 0 && (
                    <div className="bg-linear-to-br from-white/5 to-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-[#C7A15C]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-[#C7A15C]/10 p-2 rounded-lg guide-profile-icon mt-0.5">
                          <Languages
                            size={16}
                            className="guide-profile-icon shrink-0"
                          />
                        </div>
                        <h4 className="guide-profile-title font-bold text-sm truncate">
                          {t("guideProfile.languages", "Languages")}
                        </h4>
                      </div>
                      <p className="guide-profile-subtitle text-xs leading-relaxed wrap-break-word">
                        {guide.languages.join(", ")}
                      </p>
                    </div>
                  )}

                  {guide.specialties?.length > 0 && (
                    <div className="bg-linear-to-br from-white/5 to-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-[#C7A15C]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-[#C7A15C]/10 p-2 rounded-lg guide-profile-icon mt-0.5">
                          <Award
                            size={16}
                            className="guide-profile-icon shrink-0"
                          />
                        </div>
                        <h4 className="guide-profile-title font-bold text-sm truncate">
                          {t("guideProfile.specialties", "Specialties")}
                        </h4>
                      </div>
                      <p className="guide-profile-subtitle text-xs leading-relaxed wrap-break-word">
                        {guide.specialties.join(", ")}
                      </p>
                    </div>
                  )}

                  {guide.experience && (
                    <div className="bg-linear-to-br from-white/5 to-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-[#C7A15C]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-[#C7A15C]/10 p-2 rounded-lg guide-profile-icon mt-0.5">
                          <Clock
                            size={16}
                            className="guide-profile-icon shrink-0"
                          />
                        </div>
                        <h4 className="guide-profile-title font-bold text-sm truncate">
                          {t("guideProfile.experience", "Experience")}
                        </h4>
                      </div>
                      <p className="guide-profile-subtitle text-xs leading-relaxed wrap-break-word">
                        {guide.experience}
                      </p>
                    </div>
                  )}

                  {memberSince && (
                    <div className="bg-linear-to-br from-white/5 to-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-[#C7A15C]/30 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-[#C7A15C]/10 p-2 rounded-lg guide-profile-icon mt-0.5">
                          <Calendar
                            size={16}
                            className="guide-profile-icon shrink-0"
                          />
                        </div>
                        <h4 className="guide-profile-title font-bold text-sm truncate">
                          {t("guideProfile.memberSince", "Member Since")}
                        </h4>
                      </div>
                      <p className="guide-profile-subtitle text-xs leading-relaxed wrap-break-word">
                        {memberSince}
                      </p>
                    </div>
                  )}

                  <div className="bg-linear-to-br from-white/5 to-white/[0.02] p-4 rounded-xl border border-white/5 hover:border-[#C7A15C]/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-[#C7A15C]/10 p-2 rounded-lg guide-profile-icon mt-0.5">
                        <Users
                          size={16}
                          className="guide-profile-icon shrink-0"
                        />
                      </div>
                      <h4 className="guide-profile-title font-bold text-sm truncate">
                        {t("guideProfile.totalTours", "Total Tours")}
                      </h4>
                    </div>
                    <p className="guide-profile-subtitle text-xs leading-relaxed wrap-break-word">
                      {guide.toursCount}{" "}
                      {t("guideProfile.toursCreated", "tours created")}
                    </p>
                  </div>
                </div>
              </section>

              {guide.tours?.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <Crown size={24} className="guide-profile-icon" />
                    <h3 className="text-lg md:text-2xl font-bold guide-profile-title">
                      {t("guideProfile.myTours", "My Tours")}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
                    {guide.tours?.slice(0, 6).map((tour) => (
                      <TourCard key={tour._id} tour={tour} />
                    ))}
                  </div>
                </section>
              )}

              {(!guide.tours || guide.tours.length === 0) && (
                <section className="text-center py-10">
                  <div className="text-gray-500 italic border border-dashed border-white/10 rounded-2xl p-8">
                    <Crown
                      size={48}
                      className="mx-auto mb-4 text-gray-600 opacity-50"
                    />
                    <p>
                      {t("guideProfile.noTours", "No tours available yet.")}
                    </p>
                  </div>
                </section>
              )}
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-3xl mx-auto"
            >
              <div className="flex flex-col items-center justify-center gap-2  bg-glass-bg p-6 rounded-3xl border border-glass-border mb-8 text-center">
                <div className="text-5xl font-bold text-[#C7A15C]">
                  {guide.rating || "-"}
                </div>
                <div>
                  <div className="flex justify-center text-[#C7A15C] mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        fill={
                          i < Math.round(guide.rating || 0)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          i < Math.round(guide.rating || 0) ? "" : "opacity-30"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {guide.totalReviews || 0}{" "}
                    {t("guideProfile.verifiedReviews", "Verified Reviews")}
                  </p>
                </div>
              </div>

              {guide.reviews?.length > 0 ? (
                guide.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="guide-content-card p-5 rounded-2xl  border "
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        {review.avatar ? (
                          <img
                            src={review.avatar}
                            alt={review.user}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#C7A15C]/20 flex items-center justify-center text-[#C7A15C] font-bold">
                            {review.user?.[0] || "?"}
                          </div>
                        )}
                        <div>
                          <span className="font-bold guide-profile-title text-sm block">
                            {review.user}
                          </span>
                          {review.tourName && (
                            <span className="text-xs text-gray-500">
                              {t("guideProfile.on", "on")} {review.tourName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex text-[#C7A15C]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className={i < review.rating ? "" : "opacity-30"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="guide-profile-subtitle text-xs sm:text-sm italic wrap-break-word">
                      "{review.comment}"
                    </p>
                    {review.createdAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500 italic py-10 text-center border border-dashed border-white/10 rounded-2xl text-sm">
                  {t("guideProfile.noReviews", "No reviews yet.")}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
