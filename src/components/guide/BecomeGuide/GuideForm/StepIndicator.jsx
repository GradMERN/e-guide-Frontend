import { FaCheck } from "react-icons/fa";
import React from "react";

const StepIndicator = ({ steps, currentStep, totalSteps }) => {
  return (
    <div className="mb-6 sm:mb-8 pb-4 sm:pb-6">
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute top-6 left-2 right-2 h-1 bg-(--border)">
          <div className="h-full bg-linear-to-r from-(--gradient-from) to-(--gradient-to) transition-all duration-500" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}/>
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white shadow-lg" : isCurrent ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white ring-4 ring-(--primary)/20 shadow-lg" : "bg-(--surface) border-2 border-(--border) text-(--text-secondary)"}`}>
                  {isCompleted ? (
                    <FaCheck className="text-loop" />
                  ) : (
                    <Icon className={isCurrent ? "icon-step-focus" : "icon-step-inactive"} />
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium text-center ${ isCurrent ? "text-(--text)" : "text-(--text-secondary)"}`}>
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 relative top-6 z-0"></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex flex-col sm:hidden space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isCompleted ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white shadow-lg" : isCurrent ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white ring-4 ring-(--primary)/20 shadow-lg" : "bg-(--surface) border-2 border-(--border) text-(--text-secondary)"}`}>
                  {isCompleted ? (
                    <FaCheck className="text-loop" />
                  ) : (
                    <Icon className={isCurrent ? "icon-step-focus" : "icon-step-inactive"} />
                  )}
                </div>

                <div className="flex-1">
                  <p className={`font-semibold text-sm ${isCurrent ? "text-(--text)" : "text-(--text-secondary)"}`}>
                    {step.title}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-(--text-secondary) mt-1">
                      Current step
                    </p>
                  )}
                  {isCompleted && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      Completed
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  {isCompleted && (
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  )}
                  {isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-(--primary) animate-pulse"></div>
                  )}
                  {!isCompleted && !isCurrent && (
                    <div className="w-2 h-2 rounded-full bg-(--border)"></div>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex items-center gap-4 pl-5">
                  <div className={`w-0.5 h-6 transition-all duration-300 ${ currentStep > step.number ? "bg-linear-to-b from-(--gradient-from) to-(--gradient-to)" : "bg-(--border)"}`}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;