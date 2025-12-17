import { motion } from "motion/react";
import {FaPlus,FaTrash,FaFileAlt,FaCertificate,FaFile} from "react-icons/fa";

const StepDocuments = ({existingCertificates,certificateFiles,documentFiles,handleCertificateSelect,handleDocumentSelect,handleRemoveCertificateFile,handleRemoveDocumentFile,handleDeleteExistingCertificate,loading,t,labelClass,bgClass,}) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <label className={`block text-sm font-semibold mb-4 ${labelClass}`}>
          <FaCertificate className="inline mr-2" />{t("guide.certificates", "Certificates")}
          <span className="text-xs font-normal text-(--text-secondary) ml-2">({t("guide.optional", "optional")})</span>
        </label>

        {existingCertificates.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs text-(--text-secondary) mb-2">{t("guide.uploadedCertificates", "Uploaded certificates:")}</p>
            {existingCertificates.map((cert) => (
              <div key={cert._id} className={`flex items-center justify-between p-4 rounded-lg ${bgClass}`}>
                <div className="flex items-center gap-3">
                  <FaFileAlt className="text-(--primary) text-xl" />
                  <div>
                    <p className={`text-sm font-semibold ${labelClass}`}>{cert.name}</p>
                    <p className="text-xs text-(--text-secondary)">{cert.issuer}</p>
                  </div>
                </div>
                <button type="button" onClick={() => handleDeleteExistingCertificate(cert._id)} disabled={loading} className="text-red-500 hover:text-red-700 transition p-2">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        {certificateFiles.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs text-(--text-secondary) mb-2">{t("guide.pendingUpload", "Will be uploaded on submit:")}</p>
            {certificateFiles.map((file, index) => (
              <div key={`cert-${index}`} className={`flex items-center justify-between p-4 rounded-lg ${bgClass}`}>
                <div className="flex items-center gap-3">
                  <FaCertificate className="text-(--primary) text-xl" />
                  <p className={`text-sm ${labelClass}`}>{file.name}</p>
                </div>
                <button type="button" onClick={() => handleRemoveCertificateFile(index)} className="text-red-500 hover:text-red-700 transition p-2">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer transition bg-(--background) border-(--border) text-(--text) hover:border-(--primary) hover:bg-(--primary)/5">
          <FaPlus />
          <span className="font-semibold">{t("guide.addCertificate", "Add Certificate")}</span>
          <input type="file" onChange={handleCertificateSelect} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple disabled={loading} className="hidden"/>
        </label>
      </div>

      <div>
        <label className={`block text-sm font-semibold mb-4 ${labelClass}`}>
          <FaFile className="inline mr-2" />{t("guide.documents", "Supporting Documents")}
          <span className="text-xs font-normal text-(--text-secondary) ml-2">({t("guide.optional", "optional")})</span>
        </label>

        {documentFiles.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-xs text-(--text-secondary) mb-2">{t("guide.pendingUpload", "Will be uploaded on submit:")}</p>
            {documentFiles.map((file, index) => (
              <div key={`doc-${index}`} className={`flex items-center justify-between p-4 rounded-lg ${bgClass}`}>
                <div className="flex items-center gap-3">
                  <FaFile className="text-(--primary) text-xl" />
                  <p className={`text-sm ${labelClass}`}>{file.name}</p>
                </div>
                <button type="button" onClick={() => handleRemoveDocumentFile(index)} className="text-red-500 hover:text-red-700 transition p-2">
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed rounded-lg cursor-pointer transition bg-(--background) border-(--border) text-(--text)]hover:border-[var(--primary)] hover:bg-(--primary)/5">
          <FaPlus />
          <span className="font-semibold">{t("guide.addDocument", "Add Document")}</span>
          <input type="file" onChange={handleDocumentSelect} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" multiple disabled={loading} className="hidden"/>
        </label>
      </div>
    </motion.div>
  );
};

export default StepDocuments;