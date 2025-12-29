import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { userService } from "../../apis/userService";
import { useSelector } from "react-redux";
import { getImageUrl } from "../../utils/imageUtils";
import {FaCheckCircle,FaPlayCircle,FaClock,FaStar,FaBookmark,FaEdit,FaKey,FaMapMarkerAlt,FaEnvelope,FaPhone,FaCalendarAlt,} from "react-icons/fa";

const ImageModal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <img src={imageUrl} alt="Profile Fullscreen" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
      </div>
    </div>
  );
};

const UserProfileCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const avatarUrl = getImageUrl(user?.avatar);

  return (
    <>
      <div className="p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-6" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
        <div className="flex flex-col sm:flex-row items-center w-full md:w-auto text-center sm:text-left gap-4">
          <div className="relative shrink-0">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-black font-bold text-3xl border-2 overflow-hidden ${avatarUrl ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}`} style={{ borderColor: "var(--primary)", background: avatarUrl ? "transparent" : "linear-gradient(to right, #C7A15C, #E2C784)" }} onClick={() => avatarUrl && setIsModalOpen(true)}>
              {avatarUrl ? <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150?text=Error"; }} /> : user?.firstName?.charAt(0) || "U"}
            </div>
            <div className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-1 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" style={{ color: "var(--text)" }} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold truncate">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || "User"}</h3>
            <p className="text-sm capitalize" style={{ color: "var(--primary)" }}>{user?.role || "User"}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              {user?.email && <div className="flex items-center gap-1"><FaEnvelope size={12} className="shrink-0" /><span className="truncate">{user.email}</span></div>}
              {user?.phone && <div className="flex items-center gap-1"><FaPhone size={12} className="shrink-0" /><span>{user.phone}</span></div>}
            </div>
            {(user?.city || user?.country) && <div className="flex items-center justify-center sm:justify-start text-sm mt-1" style={{ color: "var(--text-muted)" }}><FaMapMarkerAlt className="mr-1 shrink-0" size={12} /><span className="truncate">{user?.city && user?.country ? `${user.city}, ${user.country}` : user?.city || user?.country}</span></div>}
            {user?.createdAt && <div className="flex items-center justify-center sm:justify-start text-sm mt-1" style={{ color: "var(--text-muted)" }}><FaCalendarAlt className="mr-1 shrink-0" size={12} /><span>{t("profile.memberSince") || "Member since"} {new Date(user.createdAt).toLocaleDateString()}</span></div>}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-3">
          <button type="button" onClick={() => navigate("/profile/info")} className="w-full sm:w-auto flex items-center justify-center py-2 px-6 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out whitespace-nowrap" style={{ background: "var(--button-bg)", color: "var(--text-button)" }}><FaEdit className="mr-2" />{t("editProfile")}</button>
          <button type="button" onClick={() => navigate("/profile/security")} className="w-full sm:w-auto flex items-center justify-center py-2 px-6 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out whitespace-nowrap" style={{ backgroundColor: "var(--secondary)", color: "var(--text-button)" }}><FaKey className="mr-2" />{t("changePassword")}</button>
        </div>
      </div>
      <ImageModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageUrl={avatarUrl} />
    </>
  );
};

const StatsOverview = ({ stats, loading }) => {
  const { t } = useTranslation();
  const savedTours = useSelector((state) => state.saved?.items?.length || 0);
  const statItems = [
    { title: t("completedTours") || "Completed Tours", number: stats?.completedEnrollments || 0, icon: <FaCheckCircle className="w-8 h-8" style={{ color: "var(--primary)" }} /> },
    { title: t("activeTours") || "Active Tours", number: stats?.activeEnrollments || 0, icon: <FaPlayCircle className="w-8 h-8" style={{ color: "#10B981" }} /> },
    { title: t("pendingEnrollments") || "Pending", number: stats?.pendingEnrollments || 0, icon: <FaClock className="w-8 h-8" style={{ color: "#F59E0B" }} /> },
    { title: t("myReviews") || "My Reviews", number: stats?.reviewsCount || 0, icon: <FaStar className="w-8 h-8" style={{ color: "#D5B36A" }} /> },
    { title: t("saved") || "Saved Tours", number: savedTours, icon: <FaBookmark className="w-8 h-8" style={{ color: "#8B5CF6" }} /> },
  ];

  if (loading) return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">{[...Array(5)].map((_, i) => <div key={i} className="p-4 rounded-lg shadow-md animate-pulse" style={{ backgroundColor: "var(--surface)" }}><div className="h-8 w-8 rounded-full bg-gray-300 mb-2 mx-auto"></div><div className="h-4 w-20 bg-gray-300 rounded mb-2 mx-auto"></div><div className="h-8 w-12 bg-gray-300 rounded mx-auto"></div></div>)}</div>;
  return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">{statItems.map((stat, i) => <div key={i} className="p-4 rounded-lg shadow-md flex flex-col items-center text-center transition-transform hover:-translate-y-1" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderWidth: "1px" }}>{stat.icon}<p className="text-sm mt-2 font-medium" style={{ color: "var(--text-muted)" }}>{stat.title}</p><p className="text-2xl font-bold mt-1" style={{ color: "var(--text)" }}>{stat.number}</p></div>)}</div>;
};

const RecentEnrollments = ({ enrollments, loading }) => {
  const { t } = useTranslation();
  const getStatusColor = (s) => ({ started: "bg-green-500/20 text-green-400", active: "bg-blue-500/20 text-blue-400", pending: "bg-yellow-500/20 text-yellow-400" }[s] || "bg-gray-500/20 text-gray-400");
  if (loading) return <div className="p-6 rounded-lg shadow-md h-full" style={{ backgroundColor: "var(--surface)" }}><div className="h-6 w-40 bg-gray-300 rounded mb-4 animate-pulse"></div>{[...Array(3)].map((_, i) => <div key={i} className="flex items-center gap-4 py-3 border-b border-gray-700 animate-pulse"><div className="w-12 h-12 bg-gray-300 rounded shrink-0"></div><div className="flex-1"><div className="h-4 w-32 bg-gray-300 rounded mb-2"></div><div className="h-3 w-24 bg-gray-300 rounded"></div></div></div>)}</div>;
  return (
    <div className="p-6 rounded-lg shadow-md h-full" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
      <h3 className="text-xl font-semibold mb-4">{t("recentEnrollments") || "Recent Enrollments"}</h3>
      {!enrollments || enrollments.length === 0 ? <div className="flex items-center justify-center h-40"><p style={{ color: "var(--text-muted)" }}>{t("noEnrollmentsYet") || "No enrollments yet. Start exploring tours!"}</p></div> : <div className="space-y-3">{enrollments.map((e, i) => <div key={e.id || i} className="flex items-center gap-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--border)" }}><div className="shrink-0">{e.tourImage ? <img src={e.tourImage} alt={e.tourName} className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(to right, #C7A15C, #E2C784)" }}><FaMapMarkerAlt className="text-black" /></div>}</div><div className="flex-1 min-w-0"><p className="font-medium truncate">{e.tourName}</p><p className="text-sm truncate" style={{ color: "var(--text-muted)" }}>{new Date(e.date).toLocaleDateString()}</p></div><span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${getStatusColor(e.status)}`}>{t(`common.statuses.${e.status}`) || e.status}</span></div>)}</div>}
    </div>
  );
};

const RecentReviews = ({ reviews, loading }) => {
  const { t } = useTranslation();
  if (loading) return <div className="p-6 rounded-lg shadow-md h-full" style={{ backgroundColor: "var(--surface)" }}><div className="h-6 w-32 bg-gray-300 rounded mb-4 animate-pulse"></div>{[...Array(2)].map((_, i) => <div key={i} className="py-3 border-b border-gray-700 animate-pulse"><div className="h-4 w-40 bg-gray-300 rounded mb-2"></div><div className="h-3 w-full bg-gray-300 rounded"></div></div>)}</div>;
  return (
    <div className="p-6 rounded-lg shadow-md h-full" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
      <h3 className="text-xl font-semibold mb-4">{t("myReviews") || "My Reviews"}</h3>
      {!reviews || reviews.length === 0 ? <div className="flex items-center justify-center h-40"><p style={{ color: "var(--text-muted)" }}>{t("noReviewsYet") || "You haven't written any reviews yet."}</p></div> : <div className="space-y-3">{reviews.map((r, i) => <div key={r.id || i} className="py-3 border-b last:border-b-0" style={{ borderColor: "var(--border)" }}><div className="flex items-center justify-between mb-1 gap-2"><p className="font-medium truncate flex-1">{r.tourName}</p><div className="flex items-center gap-1 shrink-0">{[...Array(5)].map((_, i) => <FaStar key={i} size={12} className={i < r.rating ? "text-[#D5B36A]" : "text-gray-500"} />)}</div></div><p className="text-sm line-clamp-2" style={{ color: "var(--text-muted)" }}>{r.comment}</p><p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{new Date(r.date).toLocaleDateString()}</p></div>)}</div>}
    </div>
  );
};

export default function Overview() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await userService.getUserStats();
        if (response?.success && response?.data) {
          setStats(response.data.stats);
          setRecentEnrollments(response.data.recentEnrollments || []);
          setRecentReviews(response.data.recentReviews || []);
        }
      } catch (error) { console.error("Failed to fetch user stats:", error); } finally { setLoading(false); }
    };
    if (user) fetchUserStats();
  }, [user]);

  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-2xl min-h-screen max-w-6xl mx-auto w-full" style={{ backgroundColor: "var(--background)", color: "var(--text)" }}>
      <div className="mb-6"><h1 className="text-2xl sm:text-3xl font-bold truncate">{t("welcome")}, <span className="text-[#C7A15C]">{user?.firstName || "User"}</span></h1></div>
      <h2 className="text-xl sm:text-3xl font-bold mb-6">{t("profileOverview")}</h2>
      <div className="space-y-8">
        <UserProfileCard />
        <StatsOverview stats={stats} loading={loading} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><RecentEnrollments enrollments={recentEnrollments} loading={loading} /><RecentReviews reviews={recentReviews} loading={loading} /></div>
      </div>
    </div>
  );
}