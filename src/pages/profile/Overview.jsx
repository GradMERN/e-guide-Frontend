import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { userService } from "../../apis/userService";
import { useSelector } from "react-redux";
import {
  FaCheckCircle,
  FaPlayCircle,
  FaClock,
  FaStar,
  FaBookmark,
  FaEdit,
  FaKey,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";

const UserProfileCard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className="p-6 rounded-lg shadow-md flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      {/* Profile Info */}
      <div className="flex flex-col sm:flex-row items-center sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full sm:w-auto text-center sm:text-left">
        <div className="relative mx-auto md:mx-0">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt="Profile"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2"
              style={{ borderColor: "var(--primary)" }}
            />
          ) : (
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-black font-bold text-3xl border-2"
              style={{
                borderColor: "var(--primary)",
                background: "linear-gradient(to right, #C7A15C, #E2C784)",
              }}
            >
              {user?.firstName?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <div className="w-full mx-2 sm:w-auto">
          <h3 className="text-xl font-bold">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.name || "User"}
          </h3>
          <p className="text-sm capitalize" style={{ color: "var(--primary)" }}>
            {user?.role || "User"}
          </p>
          <div
            className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            {user?.email && (
              <div className="flex items-center gap-1">
                <FaEnvelope size={12} />
                <span>{user.email}</span>
              </div>
            )}
            {user?.phone && (
              <div className="flex items-center gap-1">
                <FaPhone size={12} />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
          {(user?.city || user?.country) && (
            <div
              className="flex items-center justify-center sm:justify-start text-sm mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              <FaMapMarkerAlt className="mr-1" size={12} />
              <span>
                {user?.city && user?.country
                  ? `${user.city}, ${user.country}`
                  : user?.city || user?.country}
              </span>
            </div>
          )}
          {user?.createdAt && (
            <div
              className="flex items-center justify-center sm:justify-start text-sm mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              <FaCalendarAlt className="mr-1" size={12} />
              <span>
                {t("profile.memberSince") || "Member since"}{" "}
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col items-center w-full lg:w-auto gap-3">
        <button
          type="button"
          onClick={() => navigate("/profile/info")}
          className="w-full flex items-center justify-center py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
          style={{
            background: "var(--button-bg)",
            color: "var(--text-button)",
          }}
        >
          <FaEdit className="mr-2" />
          {t("editProfile")}
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile/security")}
          className="w-full flex items-center justify-center py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
          style={{
            backgroundColor: "var(--secondary)",
            color: "var(--text-button)",
          }}
        >
          <FaKey className="mr-2" />
          {t("changePassword")}
        </button>
      </div>
    </div>
  );
};

const StatsOverview = ({ stats, loading }) => {
  const { t } = useTranslation();
  const savedTours = useSelector((state) => state.saved?.items?.length || 0);

  const statItems = [
    {
      title: t("completedTours") || "Completed Tours",
      number: stats?.completedEnrollments || 0,
      icon: (
        <FaCheckCircle
          className="w-8 h-8"
          style={{ color: "var(--primary)" }}
        />
      ),
    },
    {
      title: t("activeTours") || "Active Tours",
      number: stats?.activeEnrollments || 0,
      icon: <FaPlayCircle className="w-8 h-8" style={{ color: "#10B981" }} />,
    },
    {
      title: t("pendingEnrollments") || "Pending",
      number: stats?.pendingEnrollments || 0,
      icon: <FaClock className="w-8 h-8" style={{ color: "#F59E0B" }} />,
    },
    {
      title: t("myReviews") || "My Reviews",
      number: stats?.reviewsCount || 0,
      icon: <FaStar className="w-8 h-8" style={{ color: "#D5B36A" }} />,
    },
    {
      title: t("saved") || "Saved Tours",
      number: savedTours,
      icon: <FaBookmark className="w-8 h-8" style={{ color: "#8B5CF6" }} />,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="p-4 rounded-lg shadow-md animate-pulse"
            style={{ backgroundColor: "var(--surface)" }}
          >
            <div className="h-8 w-8 rounded-full bg-gray-300 mb-2"></div>
            <div className="h-4 w-20 bg-gray-300 rounded mb-2"></div>
            <div className="h-8 w-12 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-lg shadow-md flex flex-col items-center text-center"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            borderWidth: "1px",
          }}
        >
          {stat.icon}
          <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
            {stat.title}
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
            {stat.number}
          </p>
        </div>
      ))}
    </div>
  );
};

const RecentEnrollments = ({ enrollments, loading }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case "started":
        return "bg-green-500/20 text-green-400";
      case "active":
        return "bg-blue-500/20 text-blue-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div
        className="p-6 rounded-lg shadow-md"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="h-6 w-40 bg-gray-300 rounded mb-4 animate-pulse"></div>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 py-3 border-b border-gray-700 animate-pulse"
          >
            <div className="w-12 h-12 bg-gray-300 rounded"></div>
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4">
        {t("recentEnrollments") || "Recent Enrollments"}
      </h3>
      {!enrollments || enrollments.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          {t("noEnrollmentsYet") ||
            "No enrollments yet. Start exploring tours!"}
        </p>
      ) : (
        <div className="space-y-3">
          {enrollments.map((enrollment, index) => (
            <div
              key={enrollment.id || index}
              className="flex items-center gap-4 py-3 border-b last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              {enrollment.tourImage ? (
                <img
                  src={enrollment.tourImage}
                  alt={enrollment.tourName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(to right, #C7A15C, #E2C784)",
                  }}
                >
                  <FaMapMarkerAlt className="text-black" />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium">{enrollment.tourName}</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {new Date(enrollment.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  enrollment.status
                )}`}
              >
                {t(`common.statuses.${enrollment.status}`) || enrollment.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RecentReviews = ({ reviews, loading }) => {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div
        className="p-6 rounded-lg shadow-md"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <div className="h-6 w-32 bg-gray-300 rounded mb-4 animate-pulse"></div>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="py-3 border-b border-gray-700 animate-pulse">
            <div className="h-4 w-40 bg-gray-300 rounded mb-2"></div>
            <div className="h-3 w-full bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4">
        {t("myReviews") || "My Reviews"}
      </h3>
      {!reviews || reviews.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>
          {t("noReviewsYet") || "You haven't written any reviews yet."}
        </p>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, index) => (
            <div
              key={review.id || index}
              className="py-3 border-b last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="font-medium">{review.tourName}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={12}
                      className={
                        i < review.rating ? "text-[#D5B36A]" : "text-gray-500"
                      }
                    />
                  ))}
                </div>
              </div>
              <p
                className="text-sm line-clamp-2"
                style={{ color: "var(--text-muted)" }}
              >
                {review.comment}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {new Date(review.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
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
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);

  return (
    <div
      className="p-4 sm:p-6 md:p-8 rounded-2xl min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {t("welcome")},{" "}
          <span className="text-[#C7A15C]">{user?.firstName || "User"}</span>
        </h1>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {t("profileOverview")}
      </h2>
      <div className="space-y-8">
        <UserProfileCard />
        <StatsOverview stats={stats} loading={loading} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentEnrollments
            enrollments={recentEnrollments}
            loading={loading}
          />
          <RecentReviews reviews={recentReviews} loading={loading} />
        </div>
      </div>
    </div>
  );
}
