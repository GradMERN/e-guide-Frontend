import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { guideApplicationService } from "../../apis/guideApplicationService";
import {
  FaUser,
  FaCalendar,
  FaCheck,
  FaTimes,
  FaClock,
  FaFileAlt,
  FaSpinner,
} from "react-icons/fa";

const AdminGuideApplications = () => {
  const { isDarkMode } = useAuth();
  const { t, i18n } = useTranslation();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interviewData, setInterviewData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    timezone: "Africa/Cairo",
  });
  const [actionData, setActionData] = useState({
    type: null,
    notes: "",
    reason: "",
  });

  const isRtl = i18n?.language === "ar";

  // Fetch applications
  useEffect(() => {
    loadApplications();
    loadStats();
  }, [filter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await guideApplicationService.getAllApplications(filter);
      setApplications(response.data.data);
    } catch (error) {
      toast.error(t("common.loadingError", "Failed to load applications"));
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await guideApplicationService.getApplicationStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Failed to load stats");
    }
  };

  const handleScheduleInterview = async () => {
    if (!interviewData.scheduledDate || !interviewData.scheduledTime) {
      toast.warning(t("guide.selectDate", "Please select date and time"));
      return;
    }

    try {
      setLoading(true);
      await guideApplicationService.scheduleInterview(
        selectedApp._id,
        interviewData.scheduledDate,
        interviewData.scheduledTime,
        interviewData.timezone
      );
      toast.success(t("guide.scheduled", "Interview scheduled successfully"));
      setShowModal(false);
      setSelectedApp(null);
      loadApplications();
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("common.error", "An error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      await guideApplicationService.approveApplication(
        selectedApp._id,
        actionData.notes
      );
      toast.success(t("guide.applicationApproved", "Application approved"));
      setShowModal(false);
      setSelectedApp(null);
      setActionData({ type: null, notes: "", reason: "" });
      loadApplications();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await guideApplicationService.rejectApplication(
        selectedApp._id,
        actionData.reason
      );
      toast.success(t("guide.applicationRejected", "Application rejected"));
      setShowModal(false);
      setSelectedApp(null);
      setActionData({ type: null, notes: "", reason: "" });
      loadApplications();
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const bgClass = isDarkMode ? "bg-[#0F0E0C]" : "bg-[#f7f4ea]";
  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-[#5c2e06]";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-[#dcc9a1]";

  const statusColors = {
    pending: isDarkMode
      ? "bg-yellow-500/20 text-yellow-300"
      : "bg-yellow-100 text-yellow-800",
    interview_scheduled: isDarkMode
      ? "bg-blue-500/20 text-blue-300"
      : "bg-blue-100 text-blue-800",
    approved: isDarkMode
      ? "bg-green-500/20 text-green-300"
      : "bg-green-100 text-green-800",
    rejected: isDarkMode
      ? "bg-red-500/20 text-red-300"
      : "bg-red-100 text-red-800",
  };

  return (
    <div className={`p-8 min-h-screen ${bgClass}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textColor} mb-2`}>
            {t("guide.applications", "Guide Applications")}
          </h1>
          <p className={textSecondary}>
            {t(
              "guide.manageApplications",
              "Review and manage guide applications"
            )}
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className={`${cardBg} rounded-lg p-6 border ${borderColor}`}>
              <p className={textSecondary}>
                {t("guide.total", "Total Applications")}
              </p>
              <p className={`text-3xl font-bold ${textColor}`}>
                {stats.totalApplications}
              </p>
            </div>
            <div className={`${cardBg} rounded-lg p-6 border ${borderColor}`}>
              <p className={textSecondary}>{t("guide.pending", "Pending")}</p>
              <p className={`text-3xl font-bold text-yellow-500`}>
                {stats.pendingApplications}
              </p>
            </div>
            <div className={`${cardBg} rounded-lg p-6 border ${borderColor}`}>
              <p className={textSecondary}>
                {t("guide.approved", "Approved Guides")}
              </p>
              <p className={`text-3xl font-bold text-green-500`}>
                {stats.approvedGuides}
              </p>
            </div>
            <div className={`${cardBg} rounded-lg p-6 border ${borderColor}`}>
              <p className={textSecondary}>
                {t("guide.successRate", "Success Rate")}
              </p>
              <p className={`text-3xl font-bold text-blue-500`}>
                {stats.totalApplications > 0
                  ? Math.round(
                      (stats.approvedGuides / stats.totalApplications) * 100
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex gap-4 flex-wrap">
          {["pending", "interview_scheduled", "approved", "rejected"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === status
                    ? isDarkMode
                      ? "bg-[#D5B36A] text-[#050505]"
                      : "bg-[#b06419] text-white"
                    : isDarkMode
                    ? "bg-[#1B1A17] text-gray-400"
                    : "bg-white text-gray-600"
                }`}
              >
                {t(`guide.${status}`, status)}
              </button>
            )
          )}
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FaSpinner className={`text-4xl animate-spin ${textColor}`} />
          </div>
        ) : applications.length === 0 ? (
          <div
            className={`${cardBg} rounded-lg p-12 text-center border ${borderColor}`}
          >
            <p className={textSecondary}>
              {t("guide.noApplications", "No applications found")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className={`${cardBg} rounded-lg p-6 border ${borderColor} hover:shadow-lg transition`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex items-center gap-4 flex-1 ${
                      isRtl ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D5B36A] to-[#8B6F47] flex items-center justify-center">
                      <FaUser className="text-white" />
                    </div>
                    <div className={isRtl ? "text-right" : ""}>
                      <h3 className={`font-bold ${textColor}`}>
                        {app.user.firstName} {app.user.lastName}
                      </h3>
                      <p className={textSecondary}>{app.user.email}</p>
                      <div className="flex gap-2 mt-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            statusColors[app.status]
                          }`}
                        >
                          {t(`guide.${app.status}`, app.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setShowModal(true);
                      setActionData({ type: null, notes: "", reason: "" });
                    }}
                    className={`px-6 py-2 rounded-lg font-semibold transition ${
                      isDarkMode
                        ? "bg-[#D5B36A] text-[#050505] hover:bg-[#E8C77F]"
                        : "bg-[#b06419] text-white hover:bg-[#9c7543]"
                    }`}
                  >
                    {t("guide.viewDetails", "View Details")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div
              className={`${cardBg} rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${textColor}`}>
                  {selectedApp.user.firstName} {selectedApp.user.lastName}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedApp(null);
                  }}
                  className={`text-2xl ${textColor} hover:opacity-50`}
                >
                  ×
                </button>
              </div>

              {/* Application Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className={`font-semibold ${textColor} mb-2`}>
                    {t("guide.background", "Background")}
                  </h3>
                  <p className={textSecondary}>{selectedApp.background.bio}</p>
                  <p className={`mt-2 ${textSecondary}`}>
                    <strong>Experience:</strong>{" "}
                    {selectedApp.background.experience}
                  </p>
                  <p className={`${textSecondary}`}>
                    <strong>Languages:</strong>{" "}
                    {selectedApp.background.languages.join(", ")}
                  </p>
                  <p className={`${textSecondary}`}>
                    <strong>Specialties:</strong>{" "}
                    {selectedApp.background.specialties.join(", ")}
                  </p>
                </div>

                {/* Certificates */}
                {selectedApp.certificates.length > 0 && (
                  <div>
                    <h3 className={`font-semibold ${textColor} mb-2`}>
                      {t("guide.certificates", "Certificates")}
                    </h3>
                    <div className="space-y-2">
                      {selectedApp.certificates.map((cert) => (
                        <a
                          key={cert._id}
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`block p-2 rounded border ${borderColor} ${
                            isDarkMode
                              ? "hover:bg-[#1B1A17]"
                              : "hover:bg-[#f0e6c9]"
                          } transition`}
                        >
                          <FaFileAlt className="inline mr-2" />
                          {cert.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interview Status - show only if scheduled and date is in the future */}
                {selectedApp.interview &&
                  selectedApp.interview.status === "scheduled" &&
                  (() => {
                    try {
                      const scheduled = new Date(
                        selectedApp.interview.scheduledDate
                      );
                      const now = new Date();
                      if (isNaN(scheduled.getTime())) return null;
                      if (scheduled <= now) return null; // hide past interviews
                      return (
                        <div>
                          <h3 className={`font-semibold ${textColor} mb-2`}>
                            {t("guide.interviewDetails", "Interview Details")}
                          </h3>
                          <p className={textSecondary}>
                            <FaCalendar className="inline mr-2" />
                            {scheduled.toLocaleDateString()}
                          </p>
                          <p className={textSecondary}>
                            <FaClock className="inline mr-2" />
                            {selectedApp.interview.scheduledTime}
                          </p>
                        </div>
                      );
                    } catch (e) {
                      return null;
                    }
                  })()}
              </div>

              {/* Actions */}
              {(selectedApp.status === "pending" ||
                selectedApp.status === "interview_scheduled") && (
                <div className="space-y-4 border-t border-[#D5B36A]/20 pt-6">
                  {actionData.type === "schedule" ? (
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-semibold ${textColor} mb-2`}
                        >
                          {t("guide.selectDate", "Date")}
                        </label>
                        <input
                          type="date"
                          value={interviewData.scheduledDate}
                          onChange={(e) =>
                            setInterviewData({
                              ...interviewData,
                              scheduledDate: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2 rounded border ${borderColor} ${
                            isDarkMode
                              ? "bg-[#1B1A17] text-white"
                              : "bg-[#f7edce] text-[#5c2e06]"
                          }`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-semibold ${textColor} mb-2`}
                        >
                          {t("guide.selectTime", "Time")}
                        </label>
                        <input
                          type="time"
                          value={interviewData.scheduledTime}
                          onChange={(e) =>
                            setInterviewData({
                              ...interviewData,
                              scheduledTime: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2 rounded border ${borderColor} ${
                            isDarkMode
                              ? "bg-[#1B1A17] text-white"
                              : "bg-[#f7edce] text-[#5c2e06]"
                          }`}
                        />
                      </div>
                      <button
                        onClick={handleScheduleInterview}
                        disabled={loading}
                        className={`w-full px-4 py-2 rounded font-semibold transition ${
                          isDarkMode
                            ? "bg-[#D5B36A] text-[#050505] hover:bg-[#E8C77F]"
                            : "bg-[#b06419] text-white hover:bg-[#9c7543]"
                        }`}
                      >
                        {t("guide.scheduleInterview", "Schedule Interview")}
                      </button>
                    </div>
                  ) : actionData.type === "approve" ? (
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-semibold ${textColor} mb-2`}
                        >
                          {t("guide.approvalNotes", "Approval Notes")}
                        </label>
                        <textarea
                          value={actionData.notes}
                          onChange={(e) =>
                            setActionData({
                              ...actionData,
                              notes: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2 rounded border ${borderColor} ${
                            isDarkMode
                              ? "bg-[#1B1A17] text-white"
                              : "bg-[#f7edce] text-[#5c2e06]"
                          } h-24 resize-none`}
                          placeholder="Optional notes..."
                        />
                      </div>
                      <button
                        onClick={handleApprove}
                        disabled={loading}
                        className="w-full px-4 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        {t("guide.confirm", "Confirm Approval")}
                      </button>
                    </div>
                  ) : actionData.type === "reject" ? (
                    <div className="space-y-4">
                      <div>
                        <label
                          className={`block text-sm font-semibold ${textColor} mb-2`}
                        >
                          {t("guide.rejectionReason", "Rejection Reason")}
                        </label>
                        <textarea
                          value={actionData.reason}
                          onChange={(e) =>
                            setActionData({
                              ...actionData,
                              reason: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2 rounded border ${borderColor} ${
                            isDarkMode
                              ? "bg-[#1B1A17] text-white"
                              : "bg-[#f7edce] text-[#5c2e06]"
                          } h-24 resize-none`}
                          placeholder="Please explain why..."
                        />
                      </div>
                      <button
                        onClick={handleReject}
                        disabled={loading}
                        className="w-full px-4 py-2 rounded font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        {t("guide.confirmReject", "Confirm Rejection")}
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() =>
                          setActionData({
                            type: "schedule",
                            notes: "",
                            reason: "",
                          })
                        }
                        className={`px-4 py-2 rounded font-semibold transition flex items-center justify-center gap-2 ${
                          isDarkMode
                            ? "bg-[#D5B36A] text-[#050505] hover:bg-[#E8C77F]"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        <FaCalendar />{" "}
                        {t("guide.scheduleInterview", "Schedule")}
                      </button>
                      <button
                        onClick={() =>
                          setActionData({
                            type: "approve",
                            notes: "",
                            reason: "",
                          })
                        }
                        className="px-4 py-2 rounded font-semibold bg-green-600 text-white hover:bg-green-700 transition flex items-center justify-center gap-2"
                      >
                        <FaCheck /> {t("guide.approveApplication", "Approve")}
                      </button>
                      <button
                        onClick={() =>
                          setActionData({
                            type: "reject",
                            notes: "",
                            reason: "",
                          })
                        }
                        className="px-4 py-2 rounded font-semibold bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-2"
                      >
                        <FaTimes /> {t("guide.rejectApplication", "Reject")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuideApplications;
