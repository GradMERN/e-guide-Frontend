import { motion } from "motion/react";
import { IoWarningOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

export function LoadingSkeleton({ count = 6, type = "card" }) {
  if (type === "card") {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="block sm:hidden">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="animate-pulse">
            <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-lg">
              <div className="h-40 bg-linear-to-br from-primary/20 to-secondary/20"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-primary/30 rounded-lg w-3/4"></div>
                <div className="h-3 bg-border rounded w-full"></div>
                <div className="h-3 bg-border rounded w-5/6"></div>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                  <div className="h-5 bg-primary/30 rounded-lg w-20"></div>
                  <div className="h-8 bg-linear-to-r from-primary/30 to-secondary/30 rounded-lg w-24"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
          {[...Array(count)].map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.1 }} className="animate-pulse">
              <div className="bg-surface rounded-xl border border-border overflow-hidden shadow-lg">
                <div className="h-48 bg-linear-to-br from-primary/20 to-secondary/20"></div>
                <div className="p-6 space-y-4">
                  <div className="h-5 bg-primary/30 rounded-lg w-3/4"></div>
                  <div className="h-3 bg-border rounded w-full"></div>
                  <div className="h-3 bg-border rounded w-5/6"></div>
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                    <div className="h-6 bg-primary/30 rounded-lg w-24"></div>
                    <div className="h-9 bg-linear-to-r from-primary/30 to-secondary/30 rounded-lg w-28"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function ErrorState({ error, onRetry, title, retryText }) {
  const { t } = useTranslation();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="w-full max-w-2xl mx-auto text-center py-8 sm:py-12 px-4">
      <div className="relative bg-surface border-2 border-primary/30 rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 pointer-events-none"></div>
        
        <div className="relative z-10">
          <motion.div  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 mb-4 sm:mb-6">
            <IoWarningOutline className="text-4xl sm:text-5xl text-primary" />
          </motion.div>
          
          <h3 className="text-xl sm:text-2xl font-bold text-text mb-2 sm:mb-3">
            {title || t("common.loadError")}
          </h3>
          <p className="text-text-secondary text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed px-2">
            {error}
          </p>
          
          {onRetry && (
            <motion.button onClick={onRetry} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary-hero text-sm px-6 sm:px-8 py-2.5 sm:py-3">
              {retryText || t("common.retry")}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export function EmptyState({icon: Icon, title, message, primaryAction, secondaryAction}) {
  const { t } = useTranslation();
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-3xl mx-auto text-center py-12 sm:py-16 px-4">
      <div className="relative bg-surface border border-border rounded-2xl p-8 sm:p-12 lg:p-16 shadow-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-primary/10 to-transparent rounded-full -translate-x-12 sm:-translate-x-16 -translate-y-12 sm:-translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-linear-to-tl from-secondary/10 to-transparent rounded-full translate-x-16 sm:translate-x-20 translate-y-16 sm:translate-y-20"></div>
        
        <div className="relative z-10">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: "spring", stiffness: 150, damping: 15}} className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 mb-4 sm:mb-6">
            {Icon && <Icon className="text-5xl sm:text-6xl lg:text-7xl text-primary" />}
          </motion.div>
          
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text mb-3 sm:mb-4 px-2">
            {title}
          </h3>
          <p className="text-text-secondary text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed px-2">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            {primaryAction && (
              <motion.button onClick={primaryAction.onClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary-hero text-sm sm:text-base px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
                {primaryAction.label}
              </motion.button>
            )}
            
            {secondaryAction && (
              <motion.button onClick={secondaryAction.onClick} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary-hero text-sm sm:text-base px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 w-full sm:w-auto">
                {secondaryAction.label}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};