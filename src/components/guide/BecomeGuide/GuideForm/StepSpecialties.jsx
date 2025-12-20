import { motion } from "motion/react";

const StepSpecialties = ({ formData, toggleSpecialty, specialtyOptions, t, labelClass }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
      <div>
        <label className={`block text-sm sm:text-base font-semibold mb-3 sm:mb-4 px-1 ${labelClass}`}>
          {t("guide.specialties", "Select Your Specialties")}
          <span className="text-xs sm:text-sm font-normal text-(--text-secondary) ltr:ml-2 rtl:mr-2">
            ({t("guide.optional", "optional")})
          </span>
        </label>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
          {specialtyOptions.map((specialty) => {
            const key = specialty.toLowerCase().replace(/\s+/g, "_");
            const isSelected = formData.specialties.includes(specialty);
            
            return (
              <label key={specialty} className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? "border-(--primary) bg-(--primary)/10" : "border-(--border) hover:border-(--primary)/50"}`}>
                <input type="checkbox" checked={isSelected} onChange={() => toggleSpecialty(specialty)} className="w-4 h-4 sm:w-5 sm:h-5 rounded border-(--border) text-(--primary) shrink-0" style={{accentColor: "var(--primary)", borderColor: "var(--border)",}}/>
                <span className={`${labelClass} font-medium text-sm sm:text-base`}>
                  {t(`guide.specialties.${key}`, specialty)}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default StepSpecialties;