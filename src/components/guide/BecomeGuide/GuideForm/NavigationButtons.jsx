import { FaArrowLeft, FaArrowRight, FaSpinner } from "react-icons/fa";

const NavigationButtons = ({currentStep,totalSteps,handleBack,handleNext,loading,isReapply,t,bgClass,labelClass,}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-(--border)">

      <button type="button" onClick={handleBack} disabled={currentStep === 1} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${ currentStep === 1 ? "opacity-0 cursor-not-allowed" : `${bgClass} ${labelClass} hover:border-(--primary)`}`}>
        <FaArrowLeft />{t("guide.back", "Back")}
      </button>

      {currentStep < totalSteps ? (
        <button type="button" onClick={handleNext} style={{background:"linear-gradient(90deg, var(--gradient-from), var(--gradient-to))"}} className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition text-(--button-text,white) hover:brightness-105 shadow-lg">
          {t("guide.next", "Next")}<FaArrowRight />
        </button>
      ) : (
        <button type="submit" disabled={loading} style={{background: "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))"}} className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition text-(--button-text,white) shadow-lg ${ loading ? "opacity-50 cursor-not-allowed" : "hover:brightness-105"}`}>
          {loading && <FaSpinner className="animate-spin" />}
          {isReapply ? t("guide.resubmit", "Resubmit Application") : t("guide.submit", "Submit Application")}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;