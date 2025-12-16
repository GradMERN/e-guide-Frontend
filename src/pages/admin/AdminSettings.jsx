import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import { placeService } from "../../apis/placeService";
import { FaPlus, FaTrash } from "react-icons/fa";

const AdminSettings = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    category: "historical",
  });
  const [error, setError] = useState(null);

  // Theme colors
  const cardBg = "bg-[var(--surface)]";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";
  const secondaryText = "text-[var(--text-secondary)]";
  const inputBg = "bg-[var(--input-bg)]";
  const inputBorder = "border-[var(--input-border)]";
  const primaryBg = "bg-[var(--primary)]";
  const primaryHover = "hover:bg-[var(--primary-hover)]";

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const data = await placeService.getAllPlaces();
      setPlaces(data || []);
    } catch (err) {
      console.error("Error fetching places:", err);
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await placeService.createPlace(form);
      setForm({ name: "", country: "", city: "", category: "historical" });
      fetchPlaces();
    } catch (err) {
      console.error("Create place error:", err);
      setError(err.response?.data?.message || "Failed to create place");
    }
  };

  const categoryOptions = [
    {
      value: "historical",
      label: t("guide.places.category.historical") || "Historical",
    },
    {
      value: "cultural",
      label: t("guide.places.category.cultural") || "Cultural",
    },
    {
      value: "religious",
      label: t("guide.places.category.religious") || "Religious",
    },
    { value: "modern", label: t("guide.places.category.modern") || "Modern" },
    {
      value: "natural",
      label: t("guide.places.category.natural") || "Natural",
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-[var(--background)]" : "bg-[var(--background)]"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-2xl font-bold mb-4 ${textColor}`}>
          {t("admin.settings") || "Admin Settings"}
        </h1>

        {/* Create Place Form */}
        <div className={`mb-6 p-6 rounded-lg border ${cardBg} ${borderColor}`}>
          <h2 className={`font-semibold mb-3 ${textColor}`}>
            {t("admin.createPlace") || "Create Place"}
          </h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t("guide.places.name") || "Place name"}
              className={`p-2 border rounded ${inputBg} ${inputBorder} ${textColor}`}
            />
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder={t("guide.places.country") || "Country"}
              className={`p-2 border rounded ${inputBg} ${inputBorder} ${textColor}`}
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder={t("guide.places.city") || "City"}
              className={`p-2 border rounded ${inputBg} ${inputBorder} ${textColor}`}
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`p-2 border rounded ${inputBg} ${inputBorder} ${textColor}`}
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="md:col-span-2 flex gap-2">
              <button
                className={`px-4 py-2 ${primaryBg} text-white rounded flex items-center gap-2 ${primaryHover} transition-colors`}
                type="submit"
              >
                <FaPlus /> {t("admin.create") || "Create"}
              </button>
            </div>
          </form>
        </div>

        {/* Places List */}
        <div className={`p-6 rounded-lg border ${cardBg} ${borderColor}`}>
          <h2 className={`font-semibold mb-3 ${textColor}`}>
            {t("admin.placesList") || "Places"}
          </h2>
          {loading ? (
            <p className={secondaryText}>
              {t("common.loading") || "Loading..."}
            </p>
          ) : places.length === 0 ? (
            <p className={secondaryText}>
              {t("common.noData") || "No places found."}
            </p>
          ) : (
            <ul className="space-y-2">
              {places.map((p) => (
                <li
                  key={p._id}
                  className={`flex justify-between items-center p-2 border rounded ${borderColor}`}
                >
                  <div>
                    <div className={`font-medium ${textColor}`}>{p.name}</div>
                    <div className={`text-sm ${secondaryText}`}>
                      {p.city}, {p.country} — {p.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${secondaryText}`}>
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
