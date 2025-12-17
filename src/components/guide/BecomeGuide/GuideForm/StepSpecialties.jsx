import { motion } from "motion/react";

const StepSpecialties = ({ formData, toggleSpecialty, specialtyOptions, t, labelClass }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <label className={`block text-sm font-semibold mb-4 ${labelClass}`}>{t("guide.specialties", "Select Your Specialties")}
          <span className="text-xs font-normal text-(--text-secondary) ml-2">({t("guide.optional", "optional")})</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {specialtyOptions.map((specialty) => {
            const key = specialty.toLowerCase().replace(/\s+/g, "_");
            const isSelected = formData.specialties.includes(specialty);
            return (
              <label key={specialty} className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${ isSelected ? "border-(--primary) bg-(--primary)/10" : "border-(--border) hover:border-(--primary)/50"}`}>
                <input type="checkbox" checked={isSelected} onChange={() => toggleSpecialty(specialty)} className="mr-3 w-5 h-5 rounded border-(--border) text-(--primary)"/>
                <span className={`${labelClass} font-medium`}>{t(`guide.specialties.${key}`, specialty)}</span>
              </label>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StepSpecialties;