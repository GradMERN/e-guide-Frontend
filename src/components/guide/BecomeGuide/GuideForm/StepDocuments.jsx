import { motion } from "motion/react";
import { FaPlus, FaTrash, FaFileAlt, FaCertificate, FaFile } from "react-icons/fa";

const StepDocuments = ({existingCertificates,certificateFiles,documentFiles,handleCertificateSelect,handleDocumentSelect,handleRemoveCertificateFile,handleRemoveDocumentFile,handleDeleteExistingCertificate,loading,t,labelClass,bgClass,}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-4 sm:space-y-6">
      <div>
        <label className={`block text-sm sm:text-base font-semibold mb-3 sm:mb-4 px-1 ${labelClass}`}>
          <FaCertificate className="inline mr-2 text-base sm:text-lg" />
          {t("guide.certificates", "Certificates")}
          <span className="text-xs sm:text-sm font-normal text-(--text-secondary) ml-2">({t("guide.optional", "optional")}) </span>
        </label>

        {existingCertificates.length > 0 && (
          <div className="mb-3 sm:mb-4 space-y-2">
            <p className="text-xs sm:text-sm text-(--text-secondary) mb-2 px-1">{t("guide.uploadedCertificates", "Uploaded certificates:")}</p>
            {existingCertificates.map((cert) => (
              <div key={cert._id} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${bgClass} gap-2`}>
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <FaFileAlt className="text-(--primary) text-lg sm:text-xl shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm sm:text-base font-semibold ${labelClass} truncate`}>{cert.name}</p>
                    <p className="text-xs sm:text-sm text-(--text-secondary) truncate">{cert.issuer}</p>
                  </div>
                </div>
                <button type="button" onClick={() => handleDeleteExistingCertificate(cert._id)} disabled={loading} className="text-red-500 hover:text-red-700 transition p-2 shrink-0" aria-label="Delete certificate">
                  <FaTrash className="text-sm sm:text-base" />
                </button>
              </div>
            ))}
          </div>
        )}

        {certificateFiles.length > 0 && (
          <div className="mb-3 sm:mb-4 space-y-2">
            <p className="text-xs sm:text-sm text-(--text-secondary) mb-2 px-1">{t("guide.pendingUpload", "Will be uploaded on submit:")}</p>
            {certificateFiles.map((file, index) => (
              <div key={`cert-${index}`} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${bgClass} gap-2`}>
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <FaCertificate className="text-(--primary) text-lg sm:text-xl shrink-0" />
                  <p className={`text-sm sm:text-base ${labelClass} truncate`}>{file.name}</p>
                </div>
                <button type="button" onClick={() => handleRemoveCertificateFile(index)} className="text-red-500 hover:text-red-700 transition p-2 shrink-0" aria-label="Remove certificate">
                  <FaTrash className="text-sm sm:text-base" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-2 border-dashed rounded-lg cursor-pointer transition bg-(--background) border-(--border) text-(--text) hover:border-(--primary) hover:bg-(--primary)/5">
          <FaPlus className="text-sm sm:text-base" />
          <span className="font-semibold text-sm sm:text-base">{t("guide.addCertificate", "Add Certificate")}</span>
          <input type="file" onChange={handleCertificateSelect} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple disabled={loading} className="hidden"/>
        </label>
      </div>

      <div>
        <label className={`block text-sm sm:text-base font-semibold mb-3 sm:mb-4 px-1 ${labelClass}`}>
          <FaFile className="inline mr-2 text-base sm:text-lg" />
          {t("guide.documents", "Supporting Documents")}
          <span className="text-xs sm:text-sm font-normal text-(--text-secondary) ml-2">({t("guide.optional", "optional")})</span>
        </label>

        {documentFiles.length > 0 && (
          <div className="mb-3 sm:mb-4 space-y-2">
            <p className="text-xs sm:text-sm text-(--text-secondary) mb-2 px-1">{t("guide.pendingUpload", "Will be uploaded on submit:")}</p>
            {documentFiles.map((file, index) => (
              <div key={`doc-${index}`} className={`flex items-center justify-between p-3 sm:p-4 rounded-lg ${bgClass} gap-2`}>
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <FaFile className="text-(--primary) text-lg sm:text-xl shrink-0" />
                  <p className={`text-sm sm:text-base ${labelClass} truncate`}>{file.name}</p>
                </div>
                <button type="button" onClick={() => handleRemoveDocumentFile(index)} className="text-red-500 hover:text-red-700 transition p-2 shrink-0" aria-label="Remove document">
                  <FaTrash className="text-sm sm:text-base" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-2 border-dashed rounded-lg cursor-pointer transition bg-(--background) border-(--border) text-(--text) hover:border-(--primary) hover:bg-(--primary)/5">
          <FaPlus className="text-sm sm:text-base" />
          <span className="font-semibold text-sm sm:text-base">{t("guide.addDocument", "Add Document")}</span>
          <input type="file" onChange={handleDocumentSelect} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple disabled={loading} className="hidden"/>
        </label>
      </div>
    </motion.div>
  );
};

export default StepDocuments;