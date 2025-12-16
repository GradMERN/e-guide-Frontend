import React, { useState, useEffect } from "react";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { guideApplicationService } from "../../apis/guideApplicationService";
import {
  FaGlobe,
  FaStar,
  FaFileAlt,
  FaSave,
  FaSpinner,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

const GuideProfileSettings = () => {
  const { user, isDarkMode } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [formData, setFormData] = useState({
    experience: "",
    languages: [],
    specialties: [],
    bio: "",
  });

  const languageOptions = [
    "English",
    "Arabic",
    "French",
    "Spanish",
    "German",
    "Italian",
    "Chinese",
    "Japanese",
    "Russian",
    "Portuguese",
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
    "Photography",
  ];

  useEffect(() => {
    loadGuideProfile();
  }, []);

  const loadGuideProfile = async () => {
    try {
      setFetchLoading(true);
      const response = await guideApplicationService.getMyApplication();
      const data = response.data.data;

      if (data) {
        setFormData({
          experience: data.background?.experience || "",
          languages: data.background?.languages || [],
          specialties: data.background?.specialties || [],
          bio: data.background?.bio || "",
        });
        setCertificates(data.certificates || []);
      }
    } catch (error) {
      console.log("No existing guide profile found");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const response = await guideApplicationService.uploadCertificate(
        file,
        file.name,
        "Self-Provided"
      );
      setCertificates((prev) => [...prev, response.data.certificate]);
      toast.success(t("guide.certificateUploaded", "Certificate uploaded"));
    } catch (error) {
      toast.error(t("guide.uploadError", "Failed to upload certificate"));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCertificate = async (certificateId) => {
    if (!window.confirm(t("guide.confirmDelete", "Delete this certificate?")))
      return;

    try {
      setLoading(true);
      await guideApplicationService.deleteCertificate(certificateId);
      setCertificates((prev) => prev.filter((c) => c._id !== certificateId));
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
      await guideApplicationService.updateGuideProfile(formData);
      toast.success(t("guide.profileUpdated", "Profile updated successfully"));
    } catch (error) {
      toast.error(
        error.response?.data?.message || t("common.error", "An error occurred")
      );
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const inputBg = isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50";

  if (fetchLoading) {
    return (
      <div
        className={`min-h-screen ${
          isDarkMode ? "bg-[#0d0c0a]" : "bg-gray-50"
        } p-6`}
      >
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-[#D5B36A] text-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-[#0d0c0a]" : "bg-gray-50"
      } p-6`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${textColor} mb-2`}>
            {t("guide.profileTitle", "Guide Profile")}
          </h1>
          <p className={secondaryText}>
            {t(
              "guide.profileDescription",
              "Manage your guide-specific information and qualifications"
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Experience & Bio */}
          <div
            className={`${cardBg} rounded-xl border ${borderColor} p-8 shadow-lg mb-6`}
          >
            <h2
              className={`text-xl font-bold ${textColor} mb-6 flex items-center gap-2`}
            >
              <FaFileAlt className="text-[#D5B36A]" />
              {t("guide.experience", "Experience & Bio")}
            </h2>

            <div className="space-y-6">
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {t("guide.yearsExperience", "Years of Experience")}
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
                  className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {t("guide.bio", "Professional Bio")}
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder={t(
                    "guide.bioPlaceholder",
                    "Tell visitors about your background and expertise..."
                  )}
                  className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Languages */}
          <div
            className={`${cardBg} rounded-xl border ${borderColor} p-8 shadow-lg mb-6`}
          >
            <h2
              className={`text-xl font-bold ${textColor} mb-6 flex items-center gap-2`}
            >
              <FaGlobe className="text-[#D5B36A]" />
              {t("guide.languages", "Languages")}
            </h2>

            <div className="flex flex-wrap gap-3">
              {languageOptions.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => toggleLanguage(lang)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    formData.languages.includes(lang)
                      ? "bg-[#D5B36A] text-black border-[#D5B36A]"
                      : `${borderColor} ${textColor} hover:border-[#D5B36A]`
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Specialties */}
          <div
            className={`${cardBg} rounded-xl border ${borderColor} p-8 shadow-lg mb-6`}
          >
            <h2
              className={`text-xl font-bold ${textColor} mb-6 flex items-center gap-2`}
            >
              <FaStar className="text-[#D5B36A]" />
              {t("guide.specialties", "Specialties")}
            </h2>

            <div className="flex flex-wrap gap-3">
              {specialtyOptions.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => toggleSpecialty(specialty)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    formData.specialties.includes(specialty)
                      ? "bg-[#D5B36A] text-black border-[#D5B36A]"
                      : `${borderColor} ${textColor} hover:border-[#D5B36A]`
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* Certificates */}
          <div
            className={`${cardBg} rounded-xl border ${borderColor} p-8 shadow-lg mb-6`}
          >
            <h2
              className={`text-xl font-bold ${textColor} mb-6 flex items-center gap-2`}
            >
              <FaFileAlt className="text-[#D5B36A]" />
              {t("guide.certificates", "Certificates & Qualifications")}
            </h2>

            {/* Existing certificates */}
            {certificates.length > 0 && (
              <div className="space-y-3 mb-6">
                {certificates.map((cert) => (
                  <div
                    key={cert._id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${borderColor} ${inputBg}`}
                  >
                    <div className="flex items-center gap-3">
                      <FaFileAlt className="text-[#D5B36A]" />
                      <div>
                        <p className={textColor}>{cert.name}</p>
                        <p className={`text-sm ${secondaryText}`}>
                          {cert.issuer}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#D5B36A] hover:underline text-sm"
                      >
                        {t("common.view", "View")}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteCertificate(cert._id)}
                        className="text-red-500 hover:text-red-400 p-2"
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload new certificate */}
            <label
              className={`flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed ${borderColor} cursor-pointer hover:border-[#D5B36A] transition-all ${textColor}`}
            >
              <FaPlus />
              <span>{t("guide.uploadCertificate", "Upload Certificate")}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleCertificateUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
              {loading
                ? t("common.saving", "Saving...")
                : t("common.save", "Save Changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuideProfileSettings;
