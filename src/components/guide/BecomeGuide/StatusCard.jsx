import { motion } from "motion/react";
import { FaClock, FaCalendarAlt, FaTimesCircle, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../../store/hooks";

const statusConfig = {
  pending: {
    icon: FaClock,
    colorClass: "text-amber-500",
    bgClass: "bg-amber-50 dark:bg-amber-900/20",
    borderClass: "border-amber-200 dark:border-amber-800",
  },
  interview_scheduled: {
    icon: FaCalendarAlt,
    colorClass: "text-blue-500",
    bgClass: "bg-amber-50 dark:bg-amber-900/20",
    borderClass: "border-amber-200 dark:border-amber-800",
  },
  approved: {
    icon: FaCheckCircle,
    colorClass: "text-green-500",
    bgClass: "bg-amber-50 dark:bg-amber-900/20",
    borderClass: "border-amber-200 dark:border-amber-800",
  },
  rejected: {
    icon: FaTimesCircle,
    colorClass: "text-red-500",
    bgClass: "bg-amber-50 dark:bg-amber-900/20",
    borderClass: "border-amber-200 dark:border-amber-800",
  },
};

const StatusCard = ({ application, t }) => {
  const { logout } = useAuth();
  const config = statusConfig[application.status] || statusConfig.pending;
  const StatusIcon = config.icon;

  const getTitle = () => {
    switch (application.status) {
      case "pending":
        return t("guide.application.pendingTitle", "Application Under Review");
      case "interview_scheduled":
        return t("guide.application.interviewTitle", "Interview Scheduled");
      case "approved":
        return t("guide.application.approvedTitle", "Application Approved!");
      case "rejected":
        return t("guide.application.rejectedTitle", "Application Not Approved");
      default:
        return t("guide.application.status", "Application Status");
    }
  };

  const getMessage = () => {
    switch (application.status) {
      case "pending":
        return t("guide.application.pendingMessage", "Your application is currently being reviewed by our team. We will notify you once a decision has been made.");
      case "interview_scheduled":
        return t("guide.application.interviewMessage","Your interview has been scheduled. Please check your email for details.");
      case "approved":
        return t("guide.application.approvedMessage", "Congratulations! Your application has been approved. Please logout and login again with your email and password to access your guide dashboard.");
      case "rejected":
        return ( application.rejectionReason || t("guide.application.rejectedMessage", "Unfortunately, your application was not approved at this time.")
        );
      default:
        return "";
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={`${config.bgClass} ${config.borderClass} rounded-xl p-4 sm:p-6 md:p-8 lg:p-10 border-2 shadow-xl`}>
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6, delay: 0.3 }}>
          <StatusIcon className={`${config.colorClass} text-5xl sm:text-6xl md:text-7xl mx-auto mb-4 sm:mb-6`}/>
        </motion.div>

        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-2xl sm:text-3xl md:text-4xl font-bold text-(--text) mb-3 sm:mb-4 px-2">
          {getTitle()}
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-(--text-secondary) text-sm sm:text-base md:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
          {getMessage()}
        </motion.p>

        {application.status === "interview_scheduled" && application.interview && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-(--surface) rounded-lg p-4 sm:p-5 mt-4 sm:mt-6 inline-block border border-(--border) shadow-sm w-full sm:w-auto">
            <p className="text-(--text) font-semibold text-base sm:text-lg mb-2">
              {t("guide.application.interviewDate", "Interview Date")}:{" "}
              {new Date(application.interview.scheduledDate).toLocaleDateString()}
            </p>
            {application.interview.scheduledTime && (
              <p className="text-(--text-secondary) text-sm sm:text-base">
                {t("guide.application.interviewTime", "Time")}:{" "}
                {application.interview.scheduledTime}
              </p>
            )}
          </motion.div>
        )}

        {application.status === "approved" && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg shadow-lg transition-all flex items-center justify-center gap-2 mx-auto w-full sm:w-auto" style={{ background: "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))", color: "var(--button-text, white)",}}>
            <FaSignOutAlt className="text-base sm:text-lg" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">{t("guide.logoutToRefresh", "Logout and Login Again")}</span>
          </motion.button>
        )}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-xs sm:text-sm text-(--text-secondary) mt-6 sm:mt-8 px-2">
          {t("guide.application.submittedOn", "Submitted on")}:{" "}
          {new Date(application.createdAt).toLocaleDateString()}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default StatusCard;