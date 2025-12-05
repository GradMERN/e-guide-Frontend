import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
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

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const inputBg = isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  useEffect(() => {
    // load countries
    let mounted = true;
    (async () => {
      const list = await locationService.getAllCountries();
      if (!mounted) return;
      setCountries(list);
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    // prefill if provided
    if (prefillCountry) setForm((p) => ({ ...p, country: prefillCountry }));
    if (prefillCity) setForm((p) => ({ ...p, city: prefillCity }));
  }, [prefillCountry, prefillCity]);

  useEffect(() => {
    // when country changes, load cities
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

  return (
    <div className={`space-y-4 w-full`}>
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${textColor}`}>Add Place</h3>
        <button onClick={onClose} className="p-1 hover:bg-[#D5B36A]/20 rounded">
          <FaTimes className={textColor} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
            Name
          </label>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Place name (e.g., Khan el-Khalili market)"
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
            Country
          </label>
          <select
            name="country"
            value={form.country}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
          >
            <option value="">Select a country</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
            City
          </label>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
          >
            <option value="">Select a city</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${secondaryText} mb-1`}>
            Category
          </label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
          >
            <option value="historical">Historical</option>
            <option value="cultural">Cultural</option>
            <option value="religious">Religious</option>
            <option value="modern">Modern</option>
            <option value="natural">Natural</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${textColor} hover:bg-[#D5B36A]/10 transition-all font-medium`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPlaceForm;
