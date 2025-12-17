import { motion } from "motion/react";
import {FaClock,FaCalendarAlt,FaTimesCircle,FaCheckCircle,FaFileAlt,FaClipboardCheck,} from "react-icons/fa";

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

const ProgressTracker = ({ application, t }) => {
  const { currentStep, completedSteps } = getStepStatus(application.status);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-(--surface) rounded-xl p-6 md:p-8 mb-6 border border-(--border) shadow-lg">
      <h2 className="text-xl font-bold text-(--text) mb-8 text-center">
        {t("guide.application.progress", "Application Progress")}
      </h2>

      <div className="relative">
        <div className="absolute top-6 left-0 right-0 h-1 bg-(--border) hidden md:block" />

        <motion.div initial={{ width: 0 }} animate={{ width: `${(completedSteps.length / applicationSteps.length) * 100}%`,}} transition={{ duration: 1, delay: 0.3 }} className="absolute top-6 left-0 h-1 bg-linear-to-r from-(--gradient-from) to-(--gradient-to) hidden md:block"/>

        <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6 md:gap-0">
          {applicationSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isRejected =
              application.status === "rejected" && step.id === 4;

            return (
              <motion.div key={step.id} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }} className="flex flex-col items-center">
                <motion.div whileHover={{ scale: 1.1 }} className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all ${ isCurrent ? "ring-4 ring-(--primary)/20" : ""}`}
                  style={{
                    background: isRejected
                      ? "var(--danger, #ef4444)" : isCompleted
                      ? "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" : isCurrent
                      ? "linear-gradient(135deg, var(--gradient-from), var(--gradient-to))" : "var(--surface)",
                    color: isRejected || isCompleted || isCurrent ? "white" : "var(--text-secondary)",
                    boxShadow: isCurrent ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.08)",
                    border: !isRejected && !isCompleted && !isCurrent ? "2px solid var(--border)" : undefined,
                  }}>
                  {isRejected ? (
                    <FaTimesCircle className="text-xl md:text-2xl" />
                  ) : isCompleted ? (
                    <FaCheckCircle className="text-xl md:text-2xl" />
                  ) : (
                    <StepIcon className="text-xl md:text-2xl" />
                  )}
                </motion.div>

                <span
                  className={`mt-3 text-sm md:text-base font-semibold text-center ${
                    isCurrent
                      ? "text-(--primary)" : isCompleted
                      ? "text-(--text)" : "text-(--text-secondary)"}`}>
                  {t(`guide.application.steps.${step.key}`, step.key)}
                </span>

                {index < applicationSteps.length - 1 && (
                  <div className="w-1 h-12 my-3 md:hidden rounded" style={{ background: completedSteps.includes(step.id + 1) ? "linear-gradient(180deg, var(--gradient-from), var(--gradient-to))" : "var(--border)",}}/>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressTracker;