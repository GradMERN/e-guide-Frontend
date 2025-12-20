import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useAuth } from "../../../../store/hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { guideApplicationService } from "../../../../apis/guideApplicationService";
import { FaUser, FaLanguage, FaStar, FaClipboardList } from "react-icons/fa";

import StepIndicator from "./StepIndicator";
import StepExperience from "./StepExperience";
import StepLanguages from "./StepLanguages";
import StepSpecialties from "./StepSpecialties";
import StepDocuments from "./StepDocuments";
import NavigationButtons from "./NavigationButtons";

const BecomeGuideForm = ({ isReapply = false, previousApplication = null }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [existingApp, setExistingApp] = useState(null);
  const [existingCertificates, setExistingCertificates] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [certificateFiles, setCertificateFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [formData, setFormData] = useState({
    experience: "",
    languages: [],
    specialties: [],
    bio: "",
  });

  const bgClass = "bg-[var(--surface)] border-[var(--border)]";
  const inputClass = `bg-[var(--background)] border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-secondary)] focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]`;
  const labelClass = "text-[var(--text)]";

  const languageOptions = ["English","العربية","Français","Español","Deutsch","Italiano","中文","日本語"];
  const specialtyOptions = ["Archaeology","History","Culture","Architecture","Art","Nature","Religion","Adventure",];

  const steps = [
    { number: 1, title: t("guide.step1", "Experience"), icon: FaUser },
    { number: 2, title: t("guide.step2", "Languages"), icon: FaLanguage },
    { number: 3, title: t("guide.step3", "Specialties"), icon: FaStar },
    { number: 4, title: t("guide.step4", "Documents"), icon: FaClipboardList },
  ];

  useEffect(() => {
    const loadApplication = async () => {
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
      }
    };

    if (user) {
      loadApplication();
    }
  }, [user, isReapply, previousApplication]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleLanguage = (lang) => {
    setFormData((prev) => ({...prev, languages: prev.languages.includes(lang) ? prev.languages.filter((l) => l !== lang) : [...prev.languages, lang],}));
  };

  const toggleSpecialty = (specialty) => {
    setFormData((prev) => ({...prev, specialties: prev.specialties.includes(specialty) ? prev.specialties.filter((s) => s !== specialty) : [...prev.specialties, specialty],}));
  };

  const handleCertificateSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    e.target.value = "";
    setCertificateFiles((prev) => [...prev, ...files]);
    toast.info(t("guide.filesAdded", `${files.length} certificate(s) added`));
  };

  const handleDocumentSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    e.target.value = "";
    setDocumentFiles((prev) => [...prev, ...files]);
    toast.info(t("guide.filesAdded", `${files.length} document(s) added`));
  };

  const handleRemoveCertificateFile = (index) => {
    setCertificateFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveDocumentFile = (index) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingCertificate = async (certificateId) => {
    if (!window.confirm(t("guide.confirmDelete", "Are you sure?"))) return;

    try {
      setLoading(true);
      await guideApplicationService.deleteCertificate(certificateId);
      setExistingCertificates((prev) => prev.filter((c) => c._id !== certificateId));
      toast.success(t("guide.certificateDeleted", "Certificate deleted"));
    } catch (error) {
      toast.error(t("guide.deleteError", "Failed to delete certificate"));
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.experience.trim()) {
          toast.warning(t("guide.experienceRequired", "Experience is required"));
          return false;
        }
        if (!formData.bio.trim()) {
          toast.warning(t("guide.bioRequired", "Bio is required"));
          return false;
        }
        return true;
      case 2:
        if (!formData.languages.length) {
          toast.warning(t("guide.selectLanguages", "Select at least one language"));
          return false;
        }
        return true;
      case 3:
        if (!formData.specialties.length) {
          toast.warning(t("guide.selectSpecialties", "Select at least one specialty"));
          return false;
        }
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentStep !== totalSteps) {
      return;
    }

    if (!validateStep(currentStep)) return;

    try {
      setLoading(true);
      const files = { certificates: certificateFiles, documents: documentFiles };
      await guideApplicationService.submitApplication(formData, files);
      toast.success(t("guide.applicationSubmitted","Application submitted successfully! Check your email for updates."));
      setCertificateFiles([]);
      setDocumentFiles([]);
      setTimeout(() => {window.location.reload();}, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || t("guide.submitError", "Failed to submit application"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0 pb-8 sm:pb-12">
      <div className={`${bgClass} rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 shadow-lg`}>
        {!isReapply && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 sm:mb-8 pb-4 sm:pb-6 text-center">
            <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 100 }} className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 sm:mb-3 bg-linear-to-r from-(--gradient-from) via-(--primary) to-(--gradient-to) bg-clip-text text-transparent px-2">
              {t("guide.applicationForm", "Guide Application")}
            </motion.h1>

            <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="h-1 w-20 sm:w-24 bg-linear-to-r from-(--gradient-from) to-(--gradient-to) rounded-full mb-3 sm:mb-4 mx-auto"/>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className={`${labelClass} text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-4`}>
              {t("guide.formIntro","Complete the form below to start your journey as a professional tour guide")}
            </motion.p>
          </motion.div>
        )}

        {existingApp && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg ${bgClass}`}>
            <p className="text-xs sm:text-sm text-(--text-secondary)">{t("guide.applicationStatus", `Status: ${existingApp.status}`)}</p>
          </div>
        )}

        <StepIndicator steps={steps} currentStep={currentStep} totalSteps={totalSteps}/>

        <form
          onKeyDown={(e) => {if (e.key === "Enter") e.preventDefault();}}>
          {currentStep === 1 && (
            <StepExperience formData={formData} handleInputChange={handleInputChange} t={t} inputClass={inputClass} labelClass={labelClass}/>
          )}

          {currentStep === 2 && (
            <StepLanguages formData={formData} toggleLanguage={toggleLanguage} languageOptions={languageOptions} t={t} labelClass={labelClass}/>
          )}

          {currentStep === 3 && (
            <StepSpecialties formData={formData} toggleSpecialty={toggleSpecialty} specialtyOptions={specialtyOptions} t={t} labelClass={labelClass}/>
          )}

          {currentStep === 4 && (
            <StepDocuments existingCertificates={existingCertificates} certificateFiles={certificateFiles} documentFiles={documentFiles} handleCertificateSelect={handleCertificateSelect} handleDocumentSelect={handleDocumentSelect} handleRemoveCertificateFile={handleRemoveCertificateFile} handleRemoveDocumentFile={handleRemoveDocumentFile} handleDeleteExistingCertificate={handleDeleteExistingCertificate} loading={loading} t={t} labelClass={labelClass} bgClass={bgClass}/>)}

          <NavigationButtons currentStep={currentStep} totalSteps={totalSteps} handleBack={handleBack} handleNext={handleNext} loading={loading} isReapply={isReapply} t={t} bgClass={bgClass} labelClass={labelClass} handleSubmit={handleSubmit}/>
        </form>
      </div>
    </div>
  );
};

export default BecomeGuideForm;