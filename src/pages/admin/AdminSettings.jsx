import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { placeService } from "../../apis/placeService";
import { FaPlus, FaTrash } from "react-icons/fa";

const AdminSettings = () => {
  const { t } = useTranslation();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    category: "historical",
  });
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {t("admin.settings") || "Admin Settings"}
        </h1>

        <div className="mb-6 p-6 rounded-lg border bg-white">
          <h2 className="font-semibold mb-3">
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
              placeholder={t("place.name") || "Place name"}
              className="p-2 border rounded"
            />
            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder={t("place.country") || "Country"}
              className="p-2 border rounded"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder={t("place.city") || "City"}
              className="p-2 border rounded"
            />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              <option value="historical">Historical</option>
              <option value="cultural">Cultural</option>
              <option value="religious">Religious</option>
              <option value="modern">Modern</option>
              <option value="natural">Natural</option>
            </select>
            <div className="md:col-span-2 flex gap-2">
              <button
                className="px-4 py-2 bg-[#D5B36A] text-black rounded"
                type="submit"
              >
                <FaPlus />{" "}
                <span className="ml-2">{t("admin.create") || "Create"}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="p-6 rounded-lg border bg-white">
          <h2 className="font-semibold mb-3">
            {t("admin.placesList") || "Places"}
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : places.length === 0 ? (
            <p>No places found.</p>
          ) : (
            <ul className="space-y-2">
              {places.map((p) => (
                <li
                  key={p._id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-600">
                      {p.city}, {p.country} — {p.category}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
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
