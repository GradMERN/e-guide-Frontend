import { motion } from "motion/react";
import { FaTimesCircle, FaRedo } from "react-icons/fa";

const RejectionNotice = ({ application, t }) => {
  const rejectionReason = application.rejectionReason || t("guide.application.rejectedMessage", "Unfortunately, your application was not approved at this time.");

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-xl p-6 md:p-8 mb-8 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 shadow-lg">
      <div className="flex items-start gap-4">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.5, delay: 0.2 }}>
          <FaTimesCircle className="text-red-500 text-3xl md:text-4xl shrink-0 mt-1" />
        </motion.div>

        <div className="flex-1">
          <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-xl md:text-2xl font-bold text-(--text) mb-3">
            {t("guide.application.rejectedTitle", "Application Not Approved")}
          </motion.h2>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-(--text-secondary) mb-4">
            {rejectionReason}
          </motion.p>

          {application.rejectionReason && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-red-200 dark:border-red-700">
              <p className="text-sm font-semibold text-(--text) mb-1">{t("guide.application.reason", "Reason")}:</p>
              <p className="text-sm text-(--text-secondary)">{application.rejectionReason}</p>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex items-center gap-2 mt-5 p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-100 dark:border-red-800">
            <FaRedo className="text-(--primary) shrink-0" />
            <p className="text-(--text) font-medium">{t("guide.application.canReapply","You can submit a new application with updated information.")}</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default RejectionNotice;