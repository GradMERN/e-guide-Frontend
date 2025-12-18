import { motion } from "motion/react";
import {FaClock, FaCalendarAlt, FaTimesCircle, FaFileAlt, FaClipboardCheck, FaCheck,} from "react-icons/fa";
import React from "react";

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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-(--surface) rounded-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border border-(--border) shadow-lg">
      <h2 className="text-lg sm:text-xl font-bold text-(--text) mb-6 sm:mb-8 text-center px-2">
        {t("guide.application.progress", "Application Progress")}
      </h2>

      <div className="mb-6 sm:mb-8">
        <div className="hidden sm:flex items-center justify-between relative">
          <div className="absolute top-6 left-2 right-2 h-1 bg-(--border)">
            <div className="h-full bg-linear-to-r from-(--gradient-from) to-(--gradient-to) transition-all duration-500" style={{width: `${((currentStep - 1) / (applicationSteps.length - 1)) * 100}%`,}}/>
          </div>

          {applicationSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = completedSteps.includes(step.id) && step.id !== currentStep;
            const isCurrent = currentStep === step.id;
            const isRejected = application.status === "rejected" && step.id === 4;

            return (
              <React.Fragment key={step.id}>
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }} className="flex flex-col items-center relative z-10">
                  <motion.div whileHover={{ scale: 1.1 }} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${ isRejected ? "bg-(--danger) text-white shadow-lg" : isCompleted ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white shadow-lg" : isCurrent ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white ring-4 ring-(--primary)/20 shadow-lg" : "bg-(--surface) border-2 border-(--border) text-(--text-secondary)"}`}>
                    {isRejected ? (
                      <FaTimesCircle className="text-loop" />
                    ) : isCompleted ? (
                      <FaCheck className="text-loop" />
                    ) : (
                      <StepIcon className={isCurrent ? "icon-step-focus" : "icon-step-inactive"} />
                    )}
                  </motion.div>

                  <span className={`mt-2 text-xs font-medium text-center ${ isCurrent ? "text-(--text)" : "text-(--text-secondary)"}`}>
                    {t(`guide.application.steps.${step.key}`, step.key)}
                  </span>
                </motion.div>

                {index < applicationSteps.length - 1 && (<div className="flex-1 h-1 mx-2 relative top-6 z-0"></div>)}
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex flex-col sm:hidden space-y-4">
          {applicationSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = completedSteps.includes(step.id) && step.id !== currentStep;
            const isCurrent = currentStep === step.id;
            const isRejected = application.status === "rejected" && step.id === 4;

            return (
              <React.Fragment key={step.id}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }} className="flex items-center gap-4">
                  <motion.div whileTap={{ scale: 0.95 }} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${ isRejected ? "bg-(--danger) text-white shadow-lg" : isCompleted ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white shadow-lg" : isCurrent ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white ring-4 ring-(--primary)/20 shadow-lg" : "bg-(--surface) border-2 border-(--border) text-(--text-secondary)"}`}>
                    {isRejected ? (
                      <FaTimesCircle className="text-loop" />
                    ) : isCompleted ? (
                      <FaCheck className="text-loop" />
                    ) : (
                      <StepIcon className={isCurrent ? "icon-step-focus" : "icon-step-inactive"} />
                    )}
                  </motion.div>

                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${ isCurrent ? "text-(--text)" : "text-(--text-secondary)"}`}>
                      {t(`guide.application.steps.${step.key}`, step.key)}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-(--text-secondary) mt-1">
                        {t("guide.application.currentStep", "Current step")}
                      </p>
                    )}
                    {isCompleted && !isRejected && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {t("guide.application.completed", "Completed")}
                      </p>
                    )}
                    {isRejected && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        {t("guide.application.rejected", "Rejected")}
                      </p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isCompleted && !isRejected && (
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    )}
                    {isCurrent && !isRejected && (
                      <div className="w-2 h-2 rounded-full bg-(--primary) animate-pulse"></div>
                    )}
                    {isRejected && (
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    )}
                  </div>
                </motion.div>

                {index < applicationSteps.length - 1 && (
                  <div className="flex items-center gap-4 pl-5">
                    <div className={`w-0.5 h-6 transition-all duration-300 ${completedSteps.includes(step.id + 1) ? "bg-linear-to-b from-(--gradient-from) to-(--gradient-to)" : "bg-(--border)"}`}></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressTracker;