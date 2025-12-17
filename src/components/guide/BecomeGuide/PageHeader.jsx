import { motion } from "motion/react";

const PageHeader = ({ title, description }) => {
  return (
    <motion.div initial={{ opacity: 0, y: -20 }}  animate={{ opacity: 1, y: 0 }}  transition={{ duration: 0.5 }}  className="mb-8 md:mb-12 text-center md:text-left">
      <motion.h1  initial={{ opacity: 0, y: -30 }}  animate={{ opacity: 1, y: 0 }}  transition={{ delay: 0.2, type: "spring", stiffness: 100 }}  className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-linear-to-r from-(--gradient-from) via-(--primary) to-(--gradient-to) bg-clip-text text-transparent drop-shadow-sm leading-tight">
        {title}
      </motion.h1>
      
      <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="h-1 w-20 md:w-32 bg-linear-to-r from-(--gradient-from) to-(--gradient-to) rounded-full mb-4 mx-auto md:mx-0"/>
      
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-(--text-secondary) text-base md:text-lg lg:text-xl max-w-3xl leading-relaxed mx-auto md:mx-0">
        {description}
      </motion.p>
    </motion.div>
  );
};

export default PageHeader;