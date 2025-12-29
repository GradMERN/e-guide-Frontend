import { useState, useEffect } from "react";
import { FaTimes, FaMapMarkerAlt, FaGlobe, FaCity, FaTag, FaSpinner, FaLandmark, FaTheaterMasks, FaPrayingHands, FaBuilding, FaTree, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { placeService } from "../../../apis/placeService";
import { locationService } from "../../../apis/locationService";

const AddPlaceForm = ({
  onClose,
  onCreated,
  isDarkMode,
  prefillCountry,
  prefillCity,
}) => {
  const [form, setForm] = useState({ country: "", city: "" });
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("historical");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const cardBg = "bg-[var(--surface)]";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";
  const inputBg = "bg-[var(--surface)]";
  const secondaryText = "text-[var(--text-secondary)]";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const list = await locationService.getAllCountries();
      if (!mounted) return;
      setCountries(list);
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (prefillCountry) setForm((p) => ({ ...p, country: prefillCountry }));
    if (prefillCity) setForm((p) => ({ ...p, city: prefillCity }));
  }, [prefillCountry, prefillCity]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!form.country) return setCities([]);
      const list = await locationService.getCitiesForCountry(form.country);
      if (!mounted) return;
      setCities(list || []);
    };
    load();
    return () => (mounted = false);
  }, [form.country]);

  const validate = () => {
    if (!name || name.trim().length < 2) {
      toast.error("Please enter a valid place name");
      return false;
    }
    if (!form.country || form.country.trim().length < 2) {
      toast.error("Please enter a valid country name");
      return false;
    }
    if (!form.city || form.city.trim().length < 2) {
      toast.error("Please enter a valid city name");
      return false;
    }
    if (!category) {
      toast.error("Please choose a category");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e && e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        country: form.country.trim(),
        city: form.city.trim(),
        category,
      };
      await placeService.createPlace(payload);
      toast.success("Place added successfully!");
      setForm({ country: "", city: "" });
      setName("");
      setCategory("historical");
      onCreated && onCreated();
      onClose && onClose();
    } catch (err) {
      console.error("Failed to create place", err);
      const msg = err?.response?.data?.message || "Failed to add place";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: "historical", label: "Historical", Icon: FaLandmark },
    { value: "cultural", label: "Cultural", Icon: FaTheaterMasks },
    { value: "religious", label: "Religious", Icon: FaPrayingHands },
    { value: "modern", label: "Modern", Icon: FaBuilding },
    { value: "natural", label: "Natural", Icon: FaTree },
  ];

  return (
    <div className={`space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-[#C7A15C] to-[#E2C784] flex items-center justify-center shadow-lg flex-shrink-0">
            <FaMapMarkerAlt className="text-white w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className={`text-base sm:text-lg md:text-xl lg:text-2xl font-bold ${textColor} truncate`}>
              Add New Place
            </h3>
            <p className={`text-xs sm:text-sm ${secondaryText} truncate`}>
              Create a new location for tours
            </p>
          </div>
        </div>
        <button  onClick={onClose}  className="p-1.5 sm:p-2 hover:bg-[#D5B36A]/20 rounded-lg transition-all duration-200 shrink-0" aria-label="Close form">
          <FaTimes className={`${textColor} w-4 h-4 sm:w-5 sm:h-5`} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
        <div>
          <label className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold ${textColor} mb-1.5 sm:mb-2`}>
            <FaMapMarkerAlt className="text-[#D5B36A] w-3 h-3 sm:w-4 sm:h-4" />
            Place Name
            <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="lg:col-span-2">
              <input name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Khan el-Khalili Market" className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg sm:rounded-xl border ${borderColor} ${inputBg} ${textColor}  focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20  text-sm sm:text-base transition-all duration-200`}/>
              <p className={`text-xs ${secondaryText} mt-1`}>
                {name.length}/100 characters
              </p>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 pr-10 rounded-lg sm:rounded-xl border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20  text-sm sm:text-base transition-all duration-200 cursor-pointer appearance-none`}>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FaChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${secondaryText} w-3 h-3`} />
              </div>
              <p className={`text-xs ${secondaryText} mt-1`}>
                Category
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold ${textColor} mb-1.5 sm:mb-2`}>
              <FaGlobe className="text-[#D5B36A] w-3 h-3 sm:w-4 sm:h-4" />
              Country
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select name="country" value={form.country} onChange={handleChange} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 pr-10 rounded-lg sm:rounded-xl border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20  text-sm sm:text-base transition-all duration-200 cursor-pointer appearance-none`}>
                <option value="">Select a country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <FaChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${secondaryText} w-3 h-3`} />
            </div>
          </div>

          <div>
            <label className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold ${textColor} mb-1.5 sm:mb-2`}>
              <FaCity className="text-[#D5B36A] w-3 h-3 sm:w-4 sm:h-4" />
              City
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select name="city" value={form.city} onChange={handleChange} disabled={!form.country} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 pr-10 rounded-lg sm:rounded-xl border ${borderColor} ${inputBg} ${textColor}  focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20  text-sm sm:text-base transition-all duration-200 cursor-pointer appearance-none ${!form.country ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <option value="">
                  {!form.country ? "Select country first" : "Select a city"}
                </option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <FaChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${secondaryText} w-3 h-3 ${!form.country ? 'opacity-50' : ''}`} />
            </div>
            {!form.country && (
              <p className={`text-xs ${secondaryText} mt-1`}>
                Please select a country first
              </p>
            )}
          </div>
        </div>

        <div className="lg:hidden">
          <label className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm md:text-base font-semibold ${textColor} mb-1.5 sm:mb-2`}>
            <FaTag className="text-[#D5B36A] w-3 h-3 sm:w-4 sm:h-4" />
            Category
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select name="category" value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 pr-10 rounded-lg sm:rounded-xl border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/20 text-sm sm:text-base transition-all duration-200 cursor-pointer appearance-none`}>
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FaChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${secondaryText} w-3 h-3`} />
          </div>
          <p className={`text-xs ${secondaryText} mt-1`}>
            Choose the type that best describes this place
          </p>
        </div>

        <div>
          <label className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${textColor} mb-2 lg:hidden`}>
            Selected Category
          </label>
          <div className="mt-2 lg:mt-0 flex items-center gap-2 flex-wrap">
            {categoryOptions.map((opt) => {
              const Icon = opt.Icon;
              return (
                <button key={opt.value} type="button" onClick={() => setCategory(opt.value)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all cursor-pointer hover:scale-105 ${ category === opt.value ? 'bg-[#D5B36A]/20 border-2 border-[#D5B36A]/60 shadow-md' : 'bg-gray-100/50 dark:bg-gray-800/50 border border-transparent hover:border-[#D5B36A]/30'}`}>
                  <Icon className={`w-4 h-4 ${category === opt.value ? 'text-[#D5B36A]' : secondaryText}`} />
                  <span className={`text-sm ${category === opt.value ? 'text-[#D5B36A] font-semibold' : secondaryText}`}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className={`text-xs ${secondaryText} mt-2 lg:hidden`}>
            Choose the type that best describes this place
          </p>
        </div>

        <div className={`flex flex-col sm:flex-row gap-3 pt-4 sm:pt-5 md:pt-6 border-t ${borderColor}`}>
          <button type="button" onClick={onClose} className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 ${borderColor} ${textColor}  hover:bg-[#D5B36A]/10 transition-all duration-200 font-semibold text-sm sm:text-base`}>
            Cancel
          </button>
          <button type="submit" disabled={submitting}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-[#C7A15C] to-[#E2C784] text-black rounded-lg sm:rounded-xl hover:from-[#D5B36A] hover:to-[#F0D9A0] transition-all duration-200 font-semibold text-sm sm:text-base shadow-lg shadow-[#C7A15C]/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <FaSpinner className="w-4 h-4 animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <FaMapMarkerAlt className="w-4 h-4" />
                <span>Create Place</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className={`p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-start gap-3`}>
        <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-blue-500 text-xs font-bold">!</span>
        </div>
        <p className={`text-xs sm:text-sm ${secondaryText} leading-relaxed`}>
          <strong className={textColor}>Tip:</strong> Make sure to enter accurate location details. This information will be used to organize tours and help travelers find destinations.
        </p>
      </div>
    </div>
  );
};

export default AddPlaceForm;