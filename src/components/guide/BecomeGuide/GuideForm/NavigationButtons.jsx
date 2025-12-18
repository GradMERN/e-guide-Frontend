import { FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa";

const NavigationButtons = ({currentStep,totalSteps,handleBack,handleNext,loading,isReapply,t,bgClass,labelClass,handleSubmit,}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 pb-4 sm:pb-6 border-t border-(--border)">
      <button type="button" onClick={handleBack} disabled={currentStep === 1} className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base order-2 sm:order-1 ${ currentStep === 1 ? "opacity-40 cursor-not-allowed bg-(--surface) border border-(--border) text-(--text-secondary)" : `${bgClass} ${labelClass} hover:border-(--primary) border`}`}>
        <FaArrowLeft className="text-sm sm:text-base" />
        <span>{t("guide.back", "Back")}</span>
      </button>

      {currentStep < totalSteps ? (
        <button type="button" onClick={handleNext} style={{background: "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))",}} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition text-(--button-text,white) hover:brightness-105 shadow-lg text-sm sm:text-base order-1 sm:order-2">
          <span>{t("guide.next", "Next")}</span>
          <FaArrowRight className="text-sm sm:text-base" />
        </button>
      ) : (
        <button type="button" onClick={handleSubmit} disabled={loading} style={{ background: "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))",}} className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition text-(--button-text,white) shadow-lg text-sm sm:text-base order-1 sm:order-2 ${ loading ? "opacity-50 cursor-not-allowed" : "hover:brightness-105"}`}>
          {loading && <FaSpinner className="animate-spin text-sm sm:text-base" />}
          <span className="whitespace-nowrap">{isReapply ? t("guide.resubmit", "Resubmit Application") : t("guide.submit", "Submit Application")}</span>
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;