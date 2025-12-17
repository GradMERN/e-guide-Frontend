import { motion } from "motion/react";

const StepLanguages = ({ formData, toggleLanguage, languageOptions, t, labelClass }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <label className={`block text-sm font-semibold mb-4 ${labelClass}`}>{t("guide.languages", "Select Languages You Speak")} *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languageOptions.map((lang) => {
            const key = lang.toLowerCase().replace(/\s+/g, "_");
            const isSelected = formData.languages.includes(lang);
            return (
              <label key={lang} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${ isSelected ? "border-(--primary) bg-(--primary)/10" : "border-(--border) hover:border-(--primary)/50"}`}>
                <input type="checkbox" checked={isSelected} onChange={() => toggleLanguage(lang)} className="mr-3 w-5 h-5 rounded border-(--border) text-(--primary)"/>
                <span className={`${labelClass} font-medium`}>{t(`languages.${key}`, lang)}</span>
              </label>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StepLanguages;