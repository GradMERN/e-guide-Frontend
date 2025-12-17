import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import {FaClock,FaCalendarAlt,FaTimesCircle,FaCheckCircle} from "react-icons/fa";

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
    bgClass: "bg-blue-50 dark:bg-blue-900/20",
    borderClass: "border-blue-200 dark:border-blue-800",
  },
  approved: {
    icon: FaCheckCircle,
    colorClass: "text-green-500",
    bgClass: "bg-green-50 dark:bg-green-900/20",
    borderClass: "border-green-200 dark:border-green-800",
  },
  rejected: {
    icon: FaTimesCircle,
    colorClass: "text-red-500",
    bgClass: "bg-red-50 dark:bg-red-900/20",
    borderClass: "border-red-200 dark:border-red-800",
  },
};

const StatusCard = ({ application, t }) => {
  const navigate = useNavigate();
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
        return t("guide.application.pendingMessage","Your application is currently being reviewed by our team. We will notify you once a decision has been made.");
      case "interview_scheduled":
        return t("guide.application.interviewMessage","Your interview has been scheduled. Please check your email for details.");
      case "approved":
        return t("guide.application.approvedMessage","Congratulations! Your application has been approved. You can now access your guide dashboard.");
      case "rejected":
        return (
          application.rejectionReason || t("guide.application.rejectedMessage","Unfortunately, your application was not approved at this time.")
        );
      default: return "";
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className={`${config.bgClass} ${config.borderClass} rounded-xl p-8 md:p-10 border-2 shadow-xl`}>
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6, delay: 0.3 }}>
          <StatusIcon className={`${config.colorClass} text-6xl md:text-7xl mx-auto mb-6`} />
        </motion.div>

        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-3xl md:text-4xl font-bold text-(--text) mb-4">
          {getTitle()}
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-(--text-secondary) text-base md:text-lg mb-6 max-w-2xl mx-auto">
          {getMessage()}
        </motion.p>

        {application.status === "interview_scheduled" && application.interview && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-(--surface) rounded-lg p-5 mt-6 inline-block border border-(--border) shadow-sm">
            <p className="text-(--text) font-semibold text-lg mb-2">
              {t("guide.application.interviewDate", "Interview Date")}:{" "}
              {new Date(application.interview.scheduledDate).toLocaleDateString()}
            </p>
            {application.interview.scheduledTime && (
              <p className="text-(--text-secondary)">
                {t("guide.application.interviewTime", "Time")}:{" "}
                {application.interview.scheduledTime}
              </p>
            )}
          </motion.div>
        )}

        {application.status === "approved" && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate("/guide/dashboard")} className="mt-6 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transition-all" style={{background: "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))", color: "var(--button-text, white)",}}>
            {t("guide.goToDashboard", "Go to Dashboard")}
          </motion.button>
        )}

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-sm text-(--text-secondary) mt-8">
          {t("guide.application.submittedOn", "Submitted on")}:{" "}
          {new Date(application.createdAt).toLocaleDateString()}
        </motion.p>
      </div>
    </motion.div>
  );
};

export default StatusCard;