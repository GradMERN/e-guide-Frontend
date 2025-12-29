import { useState, useEffect } from "react";
import { useAuth } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { guideApplicationService } from "../../apis/guideApplicationService";
import LoadingScreen from "../../components/common/LoadingScreen"; 
import {FaGlobe, FaStar, FaFileAlt, FaSave, FaSpinner,FaPlus, FaTrash, FaEye, FaAward,} from "react-icons/fa";

const GuideProfileSettings = () => {
  const { isDarkMode } = useAuth();
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

  const languageOptions = ["English", "Arabic", "French", "Spanish", "German", "Italian", "Chinese", "Japanese", "Russian", "Portuguese"];
  const specialtyOptions = ["Archaeology", "History", "Culture", "Architecture", "Art", "Nature", "Religion", "Food", "Adventure", "Photography"];

  useEffect(() => { loadGuideProfile(); }, []);

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
      console.log("No profile found");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleItem = (listName, item) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].includes(item)
        ? prev[listName].filter(i => i !== item)
        : [...prev[listName], item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await guideApplicationService.updateGuideProfile(formData);
      toast.success(t("guide.profileUpdated", "Profile updated successfully"));
    } catch (error) {
      toast.error(t("common.error", "Update failed"));
    } finally {
      setLoading(false);
    }
  };

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const inputBg = isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50";

  if (fetchLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6 md:space-y-8 p-2 sm:p-4 md:p-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col gap-1">
        <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${textColor} tracking-tight`}>
          {t("guide.profileTitle", "Guide Profile Settings")}
        </h1>
        <p className={`${secondaryText} text-xs sm:text-sm md:text-base`}>
          {t("guide.profileDescription", "Manage your professional expertise and qualifications")}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
        
        <div className="space-y-4">
          <h2 className={`text-base sm:text-lg font-bold ${textColor} flex items-center gap-2`}>
            <span className="w-1 h-5 md:h-6 bg-[#D5B36A] rounded-full"></span>
            {t("guide.experience", "Professional Background")}
          </h2>
          <div className={`${cardBg} p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl border ${borderColor} shadow-sm`}>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider ${secondaryText} mb-2`}>
                  {t("guide.yearsExperience", "Experience Summary")}
                </label>
                <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} placeholder="e.g., 5 years specializing in Ancient History" className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}/>
              </div>
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider ${secondaryText} mb-2`}>
                  {t("guide.bio", "Professional Bio")}
                </label>
                <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} className={`w-full px-4 py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] resize-none`}/>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className={`${cardBg} p-4 sm:p-6 rounded-xl md:rounded-2xl border ${borderColor}`}>
            <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
              <FaGlobe className="text-[#D5B36A]" /> {t("guide.languages", "Languages")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {languageOptions.map(lang => (
                <button key={lang} type="button"
                  onClick={() => toggleItem('languages', lang)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-sm transition-all active:scale-95 ${
                    formData.languages.includes(lang)
                      ? "bg-[#D5B36A] text-black border-[#D5B36A] font-bold"
                      : `${borderColor} ${textColor} hover:border-[#D5B36A]`
                  }`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className={`${cardBg} p-4 sm:p-6 rounded-xl md:rounded-2xl border ${borderColor}`}>
            <h3 className={`text-lg font-bold ${textColor} mb-4 flex items-center gap-2`}>
              <FaStar className="text-[#D5B36A]" /> {t("guide.specialties", "Specialties")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map(spec => (
                <button key={spec} type="button" onClick={() => toggleItem('specialties', spec)} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full border text-sm transition-all active:scale-95 ${ formData.specialties.includes(spec) ? "bg-[#D5B36A] text-black border-[#D5B36A] font-bold" : `${borderColor} ${textColor} hover:border-[#D5B36A]`}`}>
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className={`text-base sm:text-lg font-bold ${textColor} flex items-center gap-2`}>
              <span className="w-1 h-5 md:h-6 bg-[#D5B36A] rounded-full"></span>
              {t("guide.certificates", "Certificates & Qualifications")}
            </h2>
            <label className="cursor-pointer bg-[#D5B36A] hover:bg-[#E2C784] text-black px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 active:scale-95">
              <FaPlus /> {t("common.add", "Add")}
              <input type="file" className="hidden" onChange={() => {}} />
            </label>
          </div>

          <div className={`${cardBg} rounded-xl md:rounded-2xl border ${borderColor} overflow-hidden`}>
            {certificates.length === 0 ? (
              <div className="p-12 text-center opacity-40">
                <FaAward className="mx-auto text-4xl mb-2" />
                <p>{t("guide.noCertificates", "No certificates uploaded yet")}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-500/10">
                {certificates.map(cert => (
                  <div key={cert._id} className="p-4 flex items-center justify-between hover:bg-gray-500/5 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <FaFileAlt className="text-[#D5B36A] shrink-0" />
                      <div className="min-w-0">
                        <p className={`font-bold ${textColor} truncate`}>{cert.name}</p>
                        <p className={`text-xs ${secondaryText}`}>{cert.issuer}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button type="button" className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg"><FaEye /></button>
                      <button type="button" className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><FaTrash /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="w-full sm:w-auto px-10 py-4 bg-[#D5B36A] text-black rounded-xl font-black text-lg hover:bg-[#E2C784] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 disabled:opacity-50">
            {loading ? <FaSpinner className="animate-spin" /> : <FaSave />}
            {loading ? t("common.saving", "Saving...") : t("common.save", "Save Profile")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GuideProfileSettings;