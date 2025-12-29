import { useState, useEffect } from "react";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { guideApplicationService } from "../../apis/guideApplicationService";
import LoadingScreen from "../../components/common/LoadingScreen"; 
import {FaUser,FaCalendar,FaCheck,FaTimes,FaFileAlt,FaDownload,FaEye,} from "react-icons/fa";

const AdminGuideApplications = () => {
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();
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

  useEffect(() => {
    loadApplications();
    loadStats();
  }, [filter]);

  const stopLoadingWithDelay = () => {
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await guideApplicationService.getAllApplications(filter);
      setApplications(response.data.data);
    } catch (error) {
      toast.error(t("common.loadingError", "Failed to load applications"));
    } finally {
      stopLoadingWithDelay();
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
      toast.error(error.response?.data?.message || t("common.error", "An error occurred"));
      stopLoadingWithDelay();
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      await guideApplicationService.approveApplication(selectedApp._id, actionData.notes);
      toast.success(t("guide.applicationApproved", "Application approved"));
      setShowModal(false);
      setSelectedApp(null);
      setActionData({ type: null, notes: "", reason: "" });
      loadApplications();
    } catch (error) {
      toast.error(error.response?.data?.message);
      stopLoadingWithDelay();
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await guideApplicationService.rejectApplication(selectedApp._id, actionData.reason);
      toast.success(t("guide.applicationRejected", "Application rejected"));
      setShowModal(false);
      setSelectedApp(null);
      setActionData({ type: null, notes: "", reason: "" });
      loadApplications();
    } catch (error) {
      toast.error(error.response?.data?.message);
      stopLoadingWithDelay();
    }
  };

  const bgClass = isDarkMode ? "bg-[#0F0E0C]" : "bg-[#f7f4ea]";
  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-[#5c2e06]";
  const textSecondary = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-[#dcc9a1]";

  const statusColors = {
    pending: isDarkMode ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-100 text-yellow-800",
    interview_scheduled: isDarkMode ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-800",
    approved: isDarkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-800",
    rejected: isDarkMode ? "bg-red-500/20 text-red-300" : "bg-red-100 text-red-800",
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className={`p-4 sm:p-8 min-h-screen ${bgClass}`} dir="ltr">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-left">
          <h1 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-2`}>
            {t("guide.applications", "Guide Applications")}
          </h1>
          <p className={textSecondary}>
            {t("guide.manageApplications", "Review and manage guide applications")}
          </p>
        </div>

        {stats && (
          <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
            {[
              { label: t("guide.total", "Total"), val: stats.totalApplications, color: textColor },
              { label: t("guide.pending", "Pending"), val: stats.pendingApplications, color: "text-yellow-500" },
              { label: t("guide.approved", "Approved"), val: stats.approvedGuides, color: "text-green-500" },
              { label: t("guide.successRate", "Rate"), val: stats.totalApplications > 0 ? `${Math.round((stats.approvedGuides / stats.totalApplications) * 100)}%` : "0%", color: "text-blue-500" }
            ].map((stat, i) => (
              <div key={i} className={`${cardBg} min-w-[140px] flex-1 rounded-xl p-4 sm:p-6 border ${borderColor} shadow-sm`}>
                <p className={`text-xs sm:text-sm font-medium ${textSecondary} mb-1`}>{stat.label}</p>
                <p className={`text-xl sm:text-3xl font-bold ${stat.color}`}>{stat.val}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mb-6 flex items-center overflow-x-auto no-scrollbar gap-2 pb-2">
          <div className="flex flex-nowrap gap-2">
            {["pending", "interview_scheduled", "approved", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border shrink-0 ${
                  filter === status
                    ? (isDarkMode ? "bg-[#D5B36A] text-[#050505] border-[#D5B36A]" : "bg-[#b06419] text-white border-[#b06419]")
                    : (isDarkMode ? "bg-[#1B1A17] text-gray-400 border-[#D5B36A]/20" : "bg-white text-gray-600 border-gray-200")
                }`}>
                {t(`guide.${status}`, status.replace("_", " "))}
              </button>
            ))}
          </div>
        </div>

        {applications.length === 0 ? (
          <div className={`${cardBg} rounded-xl p-12 text-center border ${borderColor}`}>
            <p className={textSecondary}>{t("guide.noApplications", "No applications found")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              app.user && (
                <div key={app._id} className={`${cardBg} rounded-xl p-5 sm:p-6 border ${borderColor} hover:shadow-md transition group`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#C7A15C] to-[#E2C784] flex items-center justify-center shrink-0 shadow-sm text-black">
                        <FaUser size={20} />
                      </div>
                      <div className="min-w-0 text-left">
                        <h3 className={`font-bold ${textColor} truncate`}>
                          {app.user.firstName} {app.user.lastName}
                        </h3>
                        <p className={`text-sm ${textSecondary} truncate`}>{app.user.email}</p>
                        <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[app.status]}`}>
                          {t(`guide.${app.status}`, app.status)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedApp(app);
                        setShowModal(true);
                        setActionData({ type: null, notes: "", reason: "" });
                      }}
                      className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold text-sm transition shadow-sm ${
                        isDarkMode ? "bg-[#D5B36A] text-black hover:bg-[#E8C77F]" : "bg-[#b06419] text-white hover:bg-[#9c7543]"
                      }`}
                    >
                      {t("guide.viewDetails", "Review")}
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {showModal && selectedApp && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-0 sm:p-4 animate-fadeIn">
            <div className={`${cardBg} w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden`}>
              <div className={`p-5 sm:p-6 border-b ${borderColor} flex justify-between items-center shrink-0`}>
                <h2 className={`text-xl font-bold ${textColor}`}>
                  {selectedApp.user?.firstName} {selectedApp.user?.lastName}
                </h2>
                <button onClick={() => { setShowModal(false); setSelectedApp(null); }} className={`p-2 rounded-full hover:bg-black/5 ${textColor} transition`}>
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 overscroll-contain text-left">
                <section>
                  <h3 className={`text-xs font-bold uppercase tracking-widest ${textSecondary} mb-3`}>
                    {t("guide.background", "Professional Profile")}
                  </h3>
                  <div className={`p-4 rounded-xl border ${borderColor} ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'}`}>
                    <p className={`${textColor} italic leading-relaxed mb-4`}>"{selectedApp.background.bio}"</p>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <p className={textSecondary}><strong>Experience:</strong> {selectedApp.background.experience}</p>
                      <p className={textSecondary}><strong>Languages:</strong> {selectedApp.background.languages.join(", ")}</p>
                      <p className={textSecondary}><strong>Specialties:</strong> {selectedApp.background.specialties.join(", ")}</p>
                    </div>
                  </div>
                </section>

                {selectedApp.certificates.length > 0 && (
                  <section>
                    <h3 className={`text-xs font-bold uppercase tracking-widest ${textSecondary} mb-3`}>
                      {t("guide.certificates", "Documents")}
                    </h3>
                    <div className="space-y-2">
                      {selectedApp.certificates.map((cert) => (
                        <div key={cert._id} className={`flex items-center justify-between p-3 rounded-lg border ${borderColor}`}>
                          <div className="flex items-center gap-3 truncate">
                            <FaFileAlt className={textSecondary} />
                            <span className={`text-sm ${textColor} truncate`}>{cert.name}</span>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <a href={cert.url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition"><FaEye /></a>
                            <button onClick={() => guideApplicationService.downloadCertificate(cert._id, cert.name)} className="p-2 text-[#D5B36A] hover:bg-[#D5B36A]/10 rounded-lg transition"><FaDownload /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {(selectedApp.status === "pending" || selectedApp.status === "interview_scheduled") && (
                <div className={`p-5 sm:p-6 border-t ${borderColor} bg-black/5 shrink-0`}>
                  {actionData.type ? (
                    <div className="space-y-4 animate-slideUp">
                      <h4 className={`font-bold ${textColor} text-left`}>{t(`guide.${actionData.type}Title`, `Confirm ${actionData.type}`)}</h4>
                      {actionData.type === "schedule" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="date" value={interviewData.scheduledDate} onChange={(e) => setInterviewData({...interviewData, scheduledDate: e.target.value})} className={`p-3 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-[#1B1A17]' : 'bg-white'} ${textColor}`} />
                          <input type="time" value={interviewData.scheduledTime} onChange={(e) => setInterviewData({...interviewData, scheduledTime: e.target.value})} className={`p-3 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-[#1B1A17]' : 'bg-white'} ${textColor}`} />
                          <button onClick={handleScheduleInterview} className={`sm:col-span-2 p-3 rounded-lg font-bold bg-[#D5B36A] text-black`}>{t("guide.confirmSchedule", "Schedule Interview")}</button>
                          <button onClick={() => setActionData({type: null, notes: "", reason: ""})} className={`sm:col-span-2 text-sm ${textSecondary}`}>Back to options</button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea 
                            value={actionData.type === "approve" ? actionData.notes : actionData.reason} 
                            onChange={(e) => setActionData({...actionData, [actionData.type === "approve" ? "notes" : "reason"]: e.target.value})}
                            className={`w-full p-3 rounded-lg border ${borderColor} ${isDarkMode ? 'bg-[#1B1A17]' : 'bg-white'} ${textColor} h-24`}
                            placeholder={actionData.type === "approve" ? "Add internal notes..." : "Provide rejection reason..."}
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setActionData({type: null, notes: "", reason: ""})} className={`flex-1 p-3 rounded-lg border ${borderColor} ${textColor}`}>Cancel</button>
                            <button onClick={actionData.type === "approve" ? handleApprove : handleReject} className={`flex-1 p-3 rounded-lg font-bold text-white ${actionData.type === "approve" ? "bg-green-600" : "bg-red-600"}`}>Confirm</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <button onClick={() => setActionData({...actionData, type: "schedule"})} className="p-3 rounded-lg font-bold bg-blue-600 text-white flex items-center justify-center gap-2 text-sm"><FaCalendar size={14} /> Schedule</button>
                      <button onClick={() => setActionData({...actionData, type: "approve"})} className="p-3 rounded-lg font-bold bg-green-600 text-white flex items-center justify-center gap-2 text-sm"><FaCheck size={14} /> Approve</button>
                      <button onClick={() => setActionData({...actionData, type: "reject"})} className="p-3 rounded-lg font-bold bg-red-600 text-white flex items-center justify-center gap-2 text-sm"><FaTimes size={14} /> Reject</button>
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