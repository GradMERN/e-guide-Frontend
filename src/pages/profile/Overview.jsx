import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import { useNavigate } from "react-router-dom";

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
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center text-black font-bold text-3xl border-2"
            style={{
              borderColor: "var(--primary)",
              background: "linear-gradient(to right, #C7A15C, #E2C784)",
            }}
          >
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-1 cursor-pointer hover:bg-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              style={{ color: "var(--text)" }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="w-full mx-2 sm:w-auto">
          <h3 className="text-xl font-bold">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.name || "User"}
          </h3>
          <div
            className="flex items-center justify-center sm:justify-start text-sm mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
            <span>
              {user?.city && user?.country
                ? `${user.city}, ${user.country}`
                : user?.address || user?.email || ""}
            </span>
          </div>
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
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"
            ></path>
          </svg>
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
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12.3212 10.6852L4 19L6 21M7 16L9 18M20 7.5C20 9.98528 17.9853 12 15.5 12C13.0147 12 11 9.98528 11 7.5C11 5.01472 13.0147 3 15.5 3C17.9853 3 20 5.01472 20 7.5Z"
            ></path>
          </svg>
          {t("changePassword")}
        </button>
      </div>
    </div>
  );
};

const StatsOverview = () => {
  const { t } = useTranslation();
  const stats = [
    {
      title: t("completedTours"),
      number: 12,
      icon: (
        <svg
          className="w-8 h-8"
          style={{ color: "var(--primary)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
    {
      title: t("upcomingTours"),
      number: 3,
      icon: (
        <svg
          className="w-8 h-8"
          style={{ color: "var(--primary)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
      ),
    },
    {
      title: t("saved"),
      number: 7,
      icon: (
        <svg
          className="w-8 h-8"
          style={{ color: "var(--primary)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          ></path>
        </svg>
      ),
    },
    {
      title: t("wishlist"),
      number: 15,
      icon: (
        <svg
          className="w-8 h-8"
          style={{ color: "var(--primary)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          ></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="p-4 rounded-lg shadow-md flex items-center space-x-4"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border)",
            borderWidth: "1px",
          }}
        >
          {stat.icon}
          <div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {stat.title}
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              {stat.number}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const RecentActivity = () => {
  const { t } = useTranslation();
  const activities = [
    {
      icon: (
        <svg
          className="w-6 h-6"
          style={{ color: "var(--primary)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
      description: "You booked a trip to Paris",
      time: "2 days ago",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          style={{ color: "var(--primary)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          ></path>
        </svg>
      ),
      description: 'You left a review for the "Rome in a Day" tour',
      time: "5 days ago",
    },
    {
      icon: (
        <svg
          className="w-6 h-6"
          style={{ color: "var(--primary)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          ></path>
        </svg>
      ),
      description: "You updated your profile picture",
      time: "1 week ago",
    },
  ];

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4">{t("recentActivity")}</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-1">{activity.icon}</div>
            <div className="flex-grow">
              <p className="font-semibold">{activity.description}</p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Overview() {
  const { t } = useTranslation();
  const { user } = useAuth();
  return (
    <div
      className="p-4 sm:p-6 md:p-8  rounded-2xl min-h-screen"
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
        <StatsOverview />
        <RecentActivity />
      </div>
    </div>
  );
}
