import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

const PageHeader = ({ title, description, titleKey, descriptionKey }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  
  const displayTitle = titleKey ? t(titleKey) : title;
  const displayDescription = descriptionKey ? t(descriptionKey) : description;

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`mb-8 md:mb-12 text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`} >
      <motion.h1 initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }} className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-linear-to-r from-(--gradient-from) via-(--primary) to-(--gradient-to) bg-clip-text text-transparent drop-shadow-sm leading-tight">
        {displayTitle}
      </motion.h1>
      
      <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className={`h-1 w-20 md:w-32 bg-linear-to-r from-(--gradient-from) to-(--gradient-to) rounded-full mb-4 mx-auto ${isRTL ? 'md:mr-0 md:ml-auto' : 'md:mx-0'}`}/>
      
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-(--text-secondary) text-base md:text-lg lg:text-xl max-w-3xl leading-relaxed mx-auto md:mx-0">
        {displayDescription}
      </motion.p>
    </motion.div>
  );
};

export default PageHeader;