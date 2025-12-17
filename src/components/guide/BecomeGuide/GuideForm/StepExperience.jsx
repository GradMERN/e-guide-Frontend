import { motion } from "motion/react";

const StepExperience = ({ formData, handleInputChange, t, inputClass, labelClass }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <label className={`block text-sm font-semibold mb-3 ${labelClass}`}>{t("guide.experience", "Years of Experience")} *</label>
        <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} placeholder={t("guide.experiencePlaceholder","e.g., 5 years as professional guide")}className={`w-full px-4 py-3 border rounded-lg ${inputClass}`} required/>
      </div>

      <div>
        <label className={`block text-sm font-semibold mb-3 ${labelClass}`}>{t("guide.bio", "Professional Bio")} *</label>
        <textarea name="bio" value={formData.bio} onChange={handleInputChange} placeholder={t("guide.bioPlaceholder","Tell us about your background and expertise...")} className={`w-full px-4 py-3 border rounded-lg ${inputClass} h-40 resize-none`} required/>
        <p className="mt-2 text-xs text-(--text-secondary)">{formData.bio.length} / 500 characters</p>
      </div>
    </motion.div>
  );
};

export default StepExperience;