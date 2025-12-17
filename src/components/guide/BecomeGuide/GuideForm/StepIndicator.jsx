import { FaCheck } from "react-icons/fa";
import React from "react";

const StepIndicator = ({ steps, currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-6 left-2 right-2 h-1 bg-(--border) hidden sm:block">
          <div  className="h-full bg-linear-to-r from-(--gradient-from) to-(--gradient-to) transition-all duration-500" style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}/>
        </div>

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white shadow-lg" : isCurrent
                      ? "bg-linear-to-r from-(--gradient-from) to-(--gradient-to) text-white ring-4 ring-(--primary)/20 shadow-lg" : "bg-(--surface) border-2 border-(--border) text-(--text-secondary)"}`}>
                  {isCompleted ? <FaCheck className="text-loop" /> : <Icon className={isCurrent ? "icon-step-focus" : "icon-step-inactive"} />}
                </div>
                <span className={`mt-2 text-xs font-medium text-center hidden sm:block ${isCurrent ? "text-(--text)" : "text-(--text-secondary)"}`}>
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (<div className="flex-1 h-1 mx-2 relative top-6 hidden sm:block z-0"></div>)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;