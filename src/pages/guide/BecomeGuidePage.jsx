import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import BecomeGuideForm from "../../components/guide/BecomeGuideForm";
import { useTranslation } from "react-i18next";
import { guideApplicationService } from "../../apis/guideApplicationService";
import {
  FaClock,
  FaCalendarAlt,
  FaTimesCircle,
  FaCheckCircle,
  FaFileAlt,
  FaUserCheck,
  FaClipboardCheck,
} from "react-icons/fa";

// Progress steps for application tracking
const applicationSteps = [
  { id: 1, key: "submitted", icon: FaFileAlt },
  { id: 2, key: "review", icon: FaClock },
  { id: 3, key: "interview", icon: FaCalendarAlt },
  { id: 4, key: "decision", icon: FaClipboardCheck },
];

const getStepStatus = (applicationStatus) => {
  switch (applicationStatus) {
    case "pending":
      return { currentStep: 2, completedSteps: [1] };
    case "interview_scheduled":
      return { currentStep: 3, completedSteps: [1, 2] };
    case "approved":
      return { currentStep: 4, completedSteps: [1, 2, 3, 4] };
    case "rejected":
      return { currentStep: 4, completedSteps: [1, 2, 3] };
    default:
      return { currentStep: 1, completedSteps: [] };
  }
};

const BecomeGuidePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // Redirect if not logged in
    if (!user) {
      navigate("/login");
      return;
    }
    // Redirect if already a guide or admin
    if (user.role === "guide") {
      navigate("/guide/dashboard");
      return;
    }
    if (user.role === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    // Check for existing application
    const checkApplication = async () => {
      try {
        setLoading(true);
        const response = await guideApplicationService.getMyApplication();
        if (response.data?.application) {
          setApplication(response.data.application);
        } else if (response.data?.data) {
          setApplication(response.data.data);
        }
      } catch (err) {
        // 404 means no application exists - that's fine
        if (err.response?.status !== 404) {
          console.error("Error checking application:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    checkApplication();
  }, [user, navigate, authLoading]);

  // Show loading while auth is checking
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  // If no user after loading, don't render (redirect will happen)
  if (!user) {
    return null;
  }

  // Show message for guides/admins who shouldn't be here
  if (user.role === "guide" || user.role === "admin") {
    return null;
  }

  // Show application status if exists
  if (application) {
    const statusConfig = {
      pending: {
        icon: FaClock,
        colorStyle: { color: "var(--warning, #d97706)" },
        bgStyle: { background: "var(--warning-bg, #fffbeb)" },
        title: t("guide.application.pendingTitle", "Application Under Review"),
        message: t(
          "guide.application.pendingMessage",
          "Your application is currently being reviewed by our team. We will notify you once a decision has been made."
        ),
      },
      interview_scheduled: {
        icon: FaCalendarAlt,
        colorStyle: { color: "var(--info, #0ea5e9)" },
        bgStyle: { background: "var(--info-bg, #eff6ff)" },
        title: t("guide.application.interviewTitle", "Interview Scheduled"),
        message: t(
          "guide.application.interviewMessage",
          "Your interview has been scheduled. Please check your email for details."
        ),
      },
      approved: {
        icon: FaCheckCircle,
        colorStyle: { color: "var(--success, #16a34a)" },
        bgStyle: { background: "var(--success-bg, #ecfdf5)" },
        title: t("guide.application.approvedTitle", "Application Approved!"),
        message: t(
          "guide.application.approvedMessage",
          "Congratulations! Your application has been approved. You can now access your guide dashboard."
        ),
      },
      rejected: {
        icon: FaTimesCircle,
        colorStyle: { color: "var(--danger, #ef4444)" },
        bgStyle: { background: "var(--danger-bg, #fff1f2)" },
        title: t("guide.application.rejectedTitle", "Application Not Approved"),
        message:
          application.rejectionReason ||
          t(
            "guide.application.rejectedMessage",
            "Unfortunately, your application was not approved at this time."
          ),
      },
    };

    const config = statusConfig[application.status] || statusConfig.pending;
    const StatusIcon = config.icon;

    // If rejected, allow reapply
    if (application.status === "rejected") {
      return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Previous rejection notice */}
            <div
              className="rounded-lg p-6 mb-8 border"
              style={{
                borderColor: "var(--danger, rgba(239,68,68,0.2))",
                ...config.bgStyle,
              }}
            >
              <div className="flex items-start gap-4">
                <StatusIcon
                  style={{ ...config.colorStyle, fontSize: 20 }}
                  className="flex-shrink-0 mt-1"
                />
                <div>
                  <h2 className="text-xl font-bold text-[var(--text)] mb-2">
                    {config.title}
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    {config.message}
                  </p>
                  {application.rejectionReason && (
                    <p className="mt-2 text-[var(--text-secondary)]">
                      <strong>
                        {t("guide.application.reason", "Reason")}:
                      </strong>{" "}
                      {application.rejectionReason}
                    </p>
                  )}
                  <p className="mt-4 text-[var(--text)]">
                    {t(
                      "guide.application.canReapply",
                      "You can submit a new application with updated information."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Show form for reapplication */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">
                {t("guide.reapply", "Reapply as a Tour Guide")}
              </h1>
              <p className="text-[var(--text-secondary)] text-lg">
                {t(
                  "guide.reapplyDescription",
                  "Update your information and submit a new application."
                )}
              </p>
            </div>

            <div className="bg-[var(--surface)] rounded-lg shadow-lg p-8">
              <BecomeGuideForm
                isReapply={true}
                previousApplication={application}
              />
            </div>
          </div>
        </div>
      );
    }

    // Progress tracker component
    const { currentStep, completedSteps } = getStepStatus(application.status);

    const ProgressTracker = () => (
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {applicationSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isRejected =
              application.status === "rejected" && step.id === 4;

            return (
              <React.Fragment key={step.id}>
                {/* Step circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCurrent ? "ring-4" : ""
                    }`}
                    style={{
                      background: isRejected
                        ? "var(--danger, #ef4444)"
                        : isCompleted
                        ? "var(--success, #16a34a)"
                        : isCurrent
                        ? "var(--primary)"
                        : "var(--surface)",
                      color:
                        isRejected || isCompleted || isCurrent
                          ? "white"
                          : "var(--text-secondary)",
                      boxShadow: isCurrent
                        ? "0 0 0 8px rgba(0,0,0,0.04)"
                        : undefined,
                      border:
                        !isRejected && !isCompleted && !isCurrent
                          ? "2px solid var(--border)"
                          : undefined,
                    }}
                  >
                    {isRejected ? (
                      <FaTimesCircle className="text-lg" />
                    ) : isCompleted ? (
                      <FaCheckCircle className="text-lg" />
                    ) : (
                      <StepIcon className="text-lg" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isCurrent
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-secondary)]"
                    }`}
                  >
                    {t(`guide.application.steps.${step.key}`, step.key)}
                  </span>
                </div>

                {/* Connector line */}
                {index < applicationSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded`}
                    style={{
                      background:
                        completedSteps.includes(step.id + 1) ||
                        (isCurrent && step.id < currentStep)
                          ? "var(--success, #16a34a)"
                          : "var(--border)",
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );

    // Show status for pending, interview_scheduled, or approved
    return (
      <div className="min-h-screen bg-[var(--background)] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Tracker */}
          <div className="bg-[var(--surface)] rounded-lg p-6 mb-6 border border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text)] mb-6 text-center">
              {t("guide.application.progress", "Application Progress")}
            </h2>
            <ProgressTracker />
          </div>

          {/* Status Card */}
          <div
            className={`${config.bgColor} rounded-lg p-8 border border-[var(--border)]`}
          >
            <div className="text-center">
              <StatusIcon className={`${config.color} text-6xl mx-auto mb-4`} />
              <h1 className="text-3xl font-bold text-[var(--text)] mb-4">
                {config.title}
              </h1>
              <p className="text-[var(--text-secondary)] text-lg mb-6">
                {config.message}
              </p>

              {application.status === "interview_scheduled" &&
                application.interview && (
                  <div className="bg-[var(--surface)] rounded-lg p-4 mt-4 inline-block">
                    <p className="text-[var(--text)] font-medium">
                      {t("guide.application.interviewDate", "Interview Date")}:{" "}
                      {new Date(
                        application.interview.scheduledDate
                      ).toLocaleDateString()}
                    </p>
                    {application.interview.scheduledTime && (
                      <p className="text-[var(--text-secondary)]">
                        {t("guide.application.interviewTime", "Time")}:{" "}
                        {application.interview.scheduledTime}
                      </p>
                    )}
                  </div>
                )}

              {application.status === "approved" && (
                <button
                  onClick={() => navigate("/guide/dashboard")}
                  className="mt-4 px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  {t("guide.goToDashboard", "Go to Dashboard")}
                </button>
              )}

              <p className="text-sm text-[var(--text-secondary)] mt-6">
                {t("guide.application.submittedOn", "Submitted on")}:{" "}
                {new Date(application.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show the application form for new users
  return (
    <div className="min-h-screen bg-[var(--background)] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[var(--primary)] mb-2">
            {t("guide.becomeGuide", "Become a Tour Guide")}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg">
            {t(
              "guide.becomeGuideDescription",
              "Share your expertise and passion for Egypt with travelers from around the world. Join our community of professional tour guides."
            )}
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-lg shadow-lg p-8">
          <BecomeGuideForm />
        </div>
      </div>
    </div>
  );
};

export default BecomeGuidePage;
