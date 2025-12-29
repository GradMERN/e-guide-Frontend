import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import { placeService } from "../../apis/placeService";
import { FaPlus, FaTrash, FaEdit, FaTimes, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const AdminPlaces = () => {
  const { t } = useTranslation();
  const { isDarkMode } = useAuth();
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [form, setForm] = useState({
    name: "",
    country: "",
    city: "",
    category: "historical",
  });
  const [error, setError] = useState(null);

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const inputBg = isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50";
  const hoverBg = isDarkMode ? "hover:bg-[#2c1b0f]" : "hover:bg-gray-100";

  const categoryOptions = [
    { value: "historical", label: t("guide.places.category.historical") || "Historical", color: "#8B4513" },
    { value: "cultural", label: t("guide.places.category.cultural") || "Cultural", color: "#9333EA" },
    { value: "religious", label: t("guide.places.category.religious") || "Religious", color: "#3B82F6" },
    { value: "modern", label: t("guide.places.category.modern") || "Modern", color: "#10B981" },
    { value: "natural", label: t("guide.places.category.natural") || "Natural", color: "#059669" },
  ];

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const data = await placeService.getAllPlaces();
      setPlaces(data || []);
      setFilteredPlaces(data || []);
    } catch (err) {
      console.error("Error fetching places:", err);
      toast.error(t("admin.places.fetchError") || "Failed to load places");
      setPlaces([]);
      setFilteredPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    let filtered = places;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredPlaces(filtered);
  }, [searchTerm, selectedCategory, places]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openCreateModal = () => {
    setEditingPlace(null);
    setForm({ name: "", country: "", city: "", category: "historical" });
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (place) => {
    setEditingPlace(place);
    setForm({
      name: place.name,
      country: place.country,
      city: place.city,
      category: place.category,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlace(null);
    setForm({ name: "", country: "", city: "", category: "historical" });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.country || !form.city) {
      setError(t("admin.places.fillAllFields") || "Please fill all fields");
      return;
    }

    try {
      if (editingPlace) {
        await placeService.updatePlace(editingPlace._id, form);
        toast.success(t("admin.places.updateSuccess") || "Place updated successfully");
      } else {
        await placeService.createPlace(form);
        toast.success(t("admin.places.createSuccess") || "Place created successfully");
      }
      fetchPlaces();
      closeModal();
    } catch (err) {
      console.error("Save place error:", err);
      setError(err.response?.data?.message || t("admin.places.saveError") || "Failed to save place");
      toast.error(err.response?.data?.message || t("admin.places.saveError") || "Failed to save place");
    }
  };

  const handleDelete = async (placeId) => {
    if (!window.confirm(t("admin.places.confirmDelete") || "Are you sure you want to delete this place?")) {
      return;
    }

    try {
      await placeService.deletePlace(placeId);
      toast.success(t("admin.places.deleteSuccess") || "Place deleted successfully");
      fetchPlaces();
    } catch (err) {
      console.error("Delete place error:", err);
      toast.error(err.response?.data?.message || t("admin.places.deleteError") || "Failed to delete place");
    }
  };

  const getCategoryColor = (category) => {
    const cat = categoryOptions.find((c) => c.value === category);
    return cat?.color || "#6B7280";
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl font-bold ${textColor} mb-2`}>
            {t("admin.places.title") || "Places Management"}
          </h1>
          <p className={secondaryText}>
            {t("admin.places.description") || "Manage tourist destinations and locations"}
          </p>
        </div>

        {/* Filters and Create Button */}
        <div className={`${cardBg} rounded-xl border ${borderColor} p-4 sm:p-6 mb-6 shadow-lg`}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${secondaryText}`} />
              <input
                type="text"
                placeholder={t("admin.places.search") || "Search places..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] transition-colors`}
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  selectedCategory === "all"
                    ? "bg-[#D5B36A] text-black"
                    : `${inputBg} ${secondaryText} ${hoverBg}`
                }`}
              >
                {t("admin.places.all") || "All"}
              </button>
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedCategory === cat.value
                      ? "bg-[#D5B36A] text-black"
                      : `${inputBg} ${secondaryText} ${hoverBg}`
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Create Button */}
            <button
              onClick={openCreateModal}
              className="w-full lg:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FaPlus /> {t("admin.places.create") || "Create Place"}
            </button>
          </div>
        </div>

        {/* Places Grid */}
        <div className={`${cardBg} rounded-xl border ${borderColor} p-4 sm:p-6 shadow-lg`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg sm:text-xl font-semibold ${textColor}`}>
              {t("admin.places.list") || "Places"} ({filteredPlaces.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D5B36A]"></div>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-12">
              <FaMapMarkerAlt className={`mx-auto text-4xl sm:text-5xl ${secondaryText} mb-4`} />
              <p className={`${secondaryText} text-sm sm:text-base`}>
                {searchTerm || selectedCategory !== "all"
                  ? t("admin.places.noResults") || "No places found matching your filters"
                  : t("admin.places.noPlaces") || "No places added yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredPlaces.map((place) => (
                <div
                  key={place._id}
                  className={`${inputBg} border ${borderColor} rounded-xl p-4 sm:p-5 transition-all ${hoverBg} hover:shadow-lg hover:border-[#D5B36A]/40`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`${textColor} font-semibold text-base sm:text-lg mb-1 truncate`}>
                        {place.name}
                      </h3>
                      <p className={`${secondaryText} text-xs sm:text-sm flex items-center gap-1`}>
                        <FaMapMarkerAlt className="shrink-0" />
                        <span className="truncate">
                          {place.city}, {place.country}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/30">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getCategoryColor(place.category)}20`,
                        color: getCategoryColor(place.category),
                      }}
                    >
                      {categoryOptions.find((c) => c.value === place.category)?.label || place.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(place)}
                        className="p-2 rounded-lg text-blue-500 hover:bg-blue-500/10 transition-colors"
                        title={t("admin.places.edit") || "Edit"}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(place._id)}
                        className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                        title={t("admin.places.delete") || "Delete"}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <p className={`${secondaryText} text-xs mt-3`}>
                    {t("admin.places.added") || "Added"}: {new Date(place.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className={`${cardBg} rounded-xl border ${borderColor} w-full max-w-md shadow-2xl`}>
            <div className={`flex items-center justify-between p-4 sm:p-6 border-b ${borderColor}`}>
              <h2 className={`${textColor} text-lg sm:text-xl font-bold`}>
                {editingPlace
                  ? t("admin.places.editPlace") || "Edit Place"
                  : t("admin.places.createPlace") || "Create Place"}
              </h2>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg ${hoverBg} ${secondaryText} transition-colors`}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className={`block ${secondaryText} text-sm font-medium mb-2`}>
                  {t("admin.places.placeName") || "Place Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("admin.places.placeNamePlaceholder") || "e.g., Pyramids of Giza"}
                  className={`w-full px-4 py-2 sm:py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] transition-colors`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block ${secondaryText} text-sm font-medium mb-2`}>
                    {t("admin.places.country") || "Country"}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder={t("admin.places.countryPlaceholder") || "e.g., Egypt"}
                    className={`w-full px-4 py-2 sm:py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] transition-colors`}
                    required
                  />
                </div>

                <div>
                  <label className={`block ${secondaryText} text-sm font-medium mb-2`}>
                    {t("admin.places.city") || "City"}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder={t("admin.places.cityPlaceholder") || "e.g., Cairo"}
                    className={`w-full px-4 py-2 sm:py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] transition-colors`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block ${secondaryText} text-sm font-medium mb-2`}>
                  {t("admin.places.category") || "Category"}
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 sm:py-3 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] transition-colors`}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 sm:py-3 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium"
                >
                  {editingPlace
                    ? t("admin.places.update") || "Update"
                    : t("admin.places.create") || "Create"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex-1 px-4 py-2 sm:py-3 ${inputBg} ${textColor} rounded-lg border ${borderColor} hover:bg-opacity-80 transition-all font-medium`}
                >
                  {t("common.cancel") || "Cancel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlaces;