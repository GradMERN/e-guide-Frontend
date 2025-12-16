import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { guideApplicationService } from "../../apis/guideApplicationService";
import {
  FaPlus,
  FaTrash,
  FaSpinner,
  FaFileAlt,
  FaCertificate,
  FaFile,
} from "react-icons/fa";

const BecomeGuideForm = ({ isReapply = false, previousApplication = null }) => {
  const { user, isDarkMode } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [existingApp, setExistingApp] = useState(null);
  const [existingCertificates, setExistingCertificates] = useState([]);
  // Files to be uploaded with form submission
  const [certificateFiles, setCertificateFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [formData, setFormData] = useState({
    experience: "",
    languages: [],
    specialties: [],
    bio: "",
  });

  // Language and specialty options
  const languageOptions = [
    "English",
    "Arabic",
    "French",
    "Spanish",
    "German",
    "Italian",
    "Chinese",
    "Japanese",
  ];

  const specialtyOptions = [
    "Archaeology",
    "History",
    "Culture",
    "Architecture",
    "Art",
    "Nature",
    "Religion",
    "Food",
    "Adventure",
  ];

  // Load existing application (skip if this is a reapply)
  useEffect(() => {
    const loadApplication = async () => {
      // If reapplying, pre-fill with previous application data and load existing certificates
      if (isReapply && previousApplication) {
        setFormData({
          experience: previousApplication.background?.experience || "",
          languages: previousApplication.background?.languages || [],
          specialties: previousApplication.background?.specialties || [],
          bio: previousApplication.background?.bio || "",
        });
        setExistingCertificates(previousApplication.certificates || []);
        return;
      }

      // For new applications, check if one already exists
      try {
        const response = await guideApplicationService.getMyApplication();
        const appData = response.data?.application || response.data?.data;
        if (appData) {
          setExistingApp(appData);
          setFormData({
            experience: appData.background?.experience || "",
            languages: appData.background?.languages || [],
            specialties: appData.background?.specialties || [],
            bio: appData.background?.bio || "",
          });
          setExistingCertificates(appData.certificates || []);
        }
      } catch (error) {
        // No existing application, that's ok
      }
    };

    if (user) {
      loadApplication();
    }
  }, [user, isReapply, previousApplication]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleLanguage = (lang) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((l) => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleSpecialty = (specialty) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  // Add certificate files to upload list (will be uploaded on submit)
  const handleCertificateSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Reset the input so the same file can be selected again
    e.target.value = "";

    setCertificateFiles((prev) => [...prev, ...files]);
    toast.info(t("guide.filesAdded", `${files.length} certificate(s) added`));
  };

  // Add document files to upload list (will be uploaded on submit)
  const handleDocumentSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Reset the input so the same file can be selected again
    e.target.value = "";

    setDocumentFiles((prev) => [...prev, ...files]);
    toast.info(t("guide.filesAdded", `${files.length} document(s) added`));
  };

  // Remove a pending certificate file
  const handleRemoveCertificateFile = (index) => {
    setCertificateFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove a pending document file
  const handleRemoveDocumentFile = (index) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Delete an existing certificate (already uploaded to server)
  const handleDeleteExistingCertificate = async (certificateId) => {
    if (!window.confirm(t("guide.confirmDelete", "Are you sure?"))) return;

    try {
      setLoading(true);
      await guideApplicationService.deleteCertificate(certificateId);
      setExistingCertificates((prev) =>
        prev.filter((c) => c._id !== certificateId)
      );
      toast.success(t("guide.certificateDeleted", "Certificate deleted"));
    } catch (error) {
      toast.error(t("guide.deleteError", "Failed to delete certificate"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.experience.trim()) {
      toast.warning(t("guide.experienceRequired", "Experience is required"));
      return;
    }

    if (formData.languages.length === 0) {
      toast.warning(t("guide.selectLanguages", "Select at least one language"));
      return;
    }

    try {
      setLoading(true);

      // Submit with optional files
      const files = {
        certificates: certificateFiles,
        documents: documentFiles,
      };

      await guideApplicationService.submitApplication(formData, files);
      toast.success(
        t(
          "guide.applicationSubmitted",
          "Application submitted successfully! Check your email for updates."
        )
      );
      // Clear pending files
      setCertificateFiles([]);
      setDocumentFiles([]);
      // Redirect to become-guide page to see the pending status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          t("guide.submitError", "Failed to submit application")
      );
    } finally {
      setLoading(false);
    }
  };

  // Use CSS variables for theming so form matches project colors
  const bgClass = "bg-[var(--surface)] border-[var(--border)]";

  const inputClass = `bg-[var(--background)] border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]`;

  const labelClass = "text-[var(--text)]";

  return (
    <div className="w-full">
      <div className={`${bgClass} rounded-xl`}>
        {!isReapply && (
          <>
            <h1 className={`text-3xl font-bold mb-2 text-[var(--text)]`}>
              {t("guide.becomeGuide", "Become a Guide")}
            </h1>
            <p className={labelClass}>
              {t(
                "guide.joinOurCommunity",
                "Join our community of expert guides and share your knowledge"
              )}
            </p>
          </>
        )}

        {existingApp && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--background)] border-[var(--border)]">
            <p className="text-sm text-[var(--text-secondary)]">
              {t("guide.applicationStatus", `Status: ${existingApp.status}`)}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Background Section */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${labelClass}`}>
              {t("guide.experience", "Years of Experience *")}
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              placeholder={t(
                "guide.experiencePlaceholder",
                "e.g., 5 years as professional guide"
              )}
              className={`w-full px-4 py-2 border rounded-lg ${inputClass}`}
              required
            />
          </div>

          {/* Languages Section */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${labelClass}`}>
              {t("guide.languages", "Languages *")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languageOptions.map((lang) => {
                const key = lang.toLowerCase().replace(/\s+/g, "_");
                return (
                  <label key={lang} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.languages.includes(lang)}
                      onChange={() => toggleLanguage(lang)}
                      className="mr-2 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)]"
                    />
                    <span className={`${labelClass} text-sm`}>
                      {t(`languages.${key}`, lang)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Specialties Section */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${labelClass}`}>
              {t("guide.specialties", "Specialties")}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {specialtyOptions.map((specialty) => {
                const key = specialty.toLowerCase().replace(/\s+/g, "_");
                return (
                  <label key={specialty} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.specialties.includes(specialty)}
                      onChange={() => toggleSpecialty(specialty)}
                      className="mr-2 w-4 h-4 rounded border-[var(--border)] text-[var(--primary)]"
                    />
                    <span className={`${labelClass} text-sm`}>
                      {t(`guide.specialties.${key}`, specialty)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${labelClass}`}>
              {t("guide.bio", "Professional Bio")}
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder={t(
                "guide.bioPlaceholder",
                "Tell us about your background and expertise..."
              )}
              className={`w-full px-4 py-2 border rounded-lg ${inputClass} h-32 resize-none`}
            />
          </div>

          {/* Certificates Section */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${labelClass}`}>
              <FaCertificate className="inline mr-2" />
              {t("guide.certificates", "Certificates")}
              <span className="text-xs font-normal text-[var(--text-secondary)]">
                {" "}
                ({t("guide.optional", "optional")})
              </span>
            </label>

            {/* Existing certificates (already uploaded) */}
            {existingCertificates.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  {t("guide.uploadedCertificates", "Uploaded certificates:")}
                </p>
                {existingCertificates.map((cert) => (
                  <div
                    key={cert._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2">
                      <FaFileAlt className="text-[var(--primary)]" />
                      <div>
                        <p className={`text-sm font-semibold ${labelClass}`}>
                          {cert.name}
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {cert.issuer}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteExistingCertificate(cert._id)}
                      disabled={loading}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pending certificate files (to be uploaded on submit) */}
            {certificateFiles.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  {t("guide.pendingUpload", "Will be uploaded on submit:")}
                </p>
                {certificateFiles.map((file, index) => (
                  <div
                    key={`cert-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2">
                      <FaCertificate className="text-[var(--primary)]" />
                      <p className={`text-sm ${labelClass}`}>{file.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCertificateFile(index)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition bg-[var(--background)] border-[var(--border)] text-[var(--text)] hover:opacity-95">
              <FaPlus />
              <span className="text-sm font-semibold">
                {t("guide.addCertificate", "Add Certificate")}
              </span>
              <input
                type="file"
                onChange={handleCertificateSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          {/* Documents Section */}
          <div>
            <label className={`block text-sm font-semibold mb-3 ${labelClass}`}>
              <FaFile className="inline mr-2" />
              {t("guide.documents", "Supporting Documents")}
              <span className="text-xs font-normal text-[var(--text-secondary)]">
                {" "}
                ({t("guide.optional", "optional")})
              </span>
            </label>

            {/* Pending document files (to be uploaded on submit) */}
            {documentFiles.length > 0 && (
              <div className="mb-4 space-y-2">
                <p className="text-xs text-[var(--text-secondary)]">
                  {t("guide.pendingUpload", "Will be uploaded on submit:")}
                </p>
                {documentFiles.map((file, index) => (
                  <div
                    key={`doc-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2">
                      <FaFile className="text-[var(--primary)]" />
                      <p className={`text-sm ${labelClass}`}>{file.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveDocumentFile(index)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition bg-[var(--background)] border-[var(--border)] text-[var(--text)] hover:opacity-95">
              <FaPlus />
              <span className="text-sm font-semibold">
                {t("guide.addDocument", "Add Document")}
              </span>
              <input
                type="file"
                onChange={handleDocumentSelect}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                multiple
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background:
                "linear-gradient(90deg, var(--gradient-from), var(--gradient-to))",
            }}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-[var(--button-text,white)] ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:brightness-105"
            }`}
          >
            {loading && <FaSpinner className="animate-spin" />}
            {isReapply
              ? t("guide.resubmit", "Resubmit Application")
              : t("guide.submit", "Submit Application")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomeGuideForm;
