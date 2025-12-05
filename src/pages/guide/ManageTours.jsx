import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaTimes,
  FaImages,
  FaList,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UpdateGalleryModal from "../../components/guide/UpdateTourGalleryModal";
import AddPlaceForm from "../../components/guide/Place/AddPlaceForm";
import { toast } from "react-toastify";
import { guideService } from "../../apis/guideService";
import { placeService } from "../../apis/placeService";
// TourItemsManager is available as a full-page at /guide/tours/:id/items

const ManageTours = () => {
  const { isDarkMode } = useAuth();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [tours, setTours] = useState([]);
  const [places, setPlaces] = useState([]);

  const [showTourModal, setShowTourModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const navigate = useNavigate();
  // Gallery editing state for the Tour modal
  const [galleryOldImages, setGalleryOldImages] = useState([]); // existing images from tour
  const [galleryNewFiles, setGalleryNewFiles] = useState([]); // newly selected files
  const [galleryNewPreviews, setGalleryNewPreviews] = useState([]);
  const [deletedGalleryIds, setDeletedGalleryIds] = useState([]); // public_ids marked for deletion
  const galleryPreviewsRef = React.useRef([]);

  const [newTourForm, setNewTourForm] = useState({
    name: "",
    description: "",
    price: "",
    place: "",
    categories: "",
    tags: "",
    languages: "",
    mainImage: null,
  });

  const [newPlaceForm, setNewPlaceForm] = useState({
    country: "",
    city: "",
  });

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const inputBg = isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50";

  // FETCH TOURS
  const fetchTours = async () => {
    try {
      const data = await guideService.getMyTours();
      setTours(data.data);
    } catch (err) {
      console.error("Error fetching tours:", err);
    }
  };

  // FETCH PLACES
  const fetchPlaces = async () => {
    try {
      const placesData = await placeService.getAllPlaces();
      setPlaces(placesData);
    } catch (err) {
      console.error("Error fetching places:", err);
      setPlaces([]);
    }
  };

  useEffect(() => {
    fetchTours();
    fetchPlaces();
  }, []);

  useEffect(() => {
    return () => {
      (galleryPreviewsRef.current || []).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
      galleryPreviewsRef.current = [];
    };
  }, []);

  // HANDLE LANGUAGE CHANGE
  useEffect(() => {
    const handleLanguageChange = () => {
      const currentLanguage = i18n.language;
      const direction = currentLanguage === "ar" ? "rtl" : "ltr";
      document.documentElement.dir = direction;
      document.documentElement.lang = currentLanguage;
    };
    handleLanguageChange();
    i18n.on("languageChanged", handleLanguageChange);
    return () => i18n.off("languageChanged", handleLanguageChange);
  }, []);

  const filteredTours = tours?.filter(
    (tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.place.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetTourForm = () => {
    setEditingTour(null);
    setNewTourForm({
      name: "",
      description: "",
      price: "",
      place: "",
      categories: "",
      tags: "",
      languages: "",
      mainImage: null,
    });
    setGalleryOldImages([]);
    // revoke previews
    (galleryPreviewsRef.current || []).forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    galleryPreviewsRef.current = [];
    setGalleryNewPreviews([]);
    setGalleryNewFiles([]);
    setDeletedGalleryIds([]);
  };

  // HANDLE TOUR FORM CHANGE
  const handleTourChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "mainImage") {
      setNewTourForm((prev) => ({ ...prev, mainImage: files[0] }));
      return;
    }
    setNewTourForm((prev) => ({ ...prev, [name]: value }));
  };

  // Gallery handlers inside Tour modal
  const handleAddGalleryFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const previews = files.map((f) => {
      try {
        const u = URL.createObjectURL(f);
        galleryPreviewsRef.current.push(u);
        return u;
      } catch (err) {
        return null;
      }
    });
    setGalleryNewFiles((prev) => [...prev, ...files]);
    setGalleryNewPreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveOldGalleryImage = (publicId) => {
    // mark for deletion
    setDeletedGalleryIds((prev) => [...prev, publicId]);
  };

  const handleUnremoveOldGalleryImage = (publicId) => {
    setDeletedGalleryIds((prev) => prev.filter((id) => id !== publicId));
  };

  const handleRemoveNewGalleryFile = (index) => {
    const toRemove = galleryNewPreviews?.[index];
    if (toRemove) {
      try {
        URL.revokeObjectURL(toRemove);
      } catch (e) {}
      galleryPreviewsRef.current = (galleryPreviewsRef.current || []).filter(
        (u) => u !== toRemove
      );
    }
    setGalleryNewFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // HANDLE PLACE FORM CHANGE
  const handlePlaceChange = (e) => {
    const { name, value } = e.target;
    setNewPlaceForm((prev) => ({ ...prev, [name]: value }));
  };

  // HANDLE TOUR SUBMIT

  const handleTourSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate inputs before submitting
      if (
        !newTourForm.name ||
        newTourForm.name.length < 3 ||
        newTourForm.name.length > 100
      ) {
        toast.error("Tour name must be between 3 and 100 characters");
        return;
      }

      if (
        !newTourForm.description ||
        newTourForm.description.length < 10 ||
        newTourForm.description.length > 2000
      ) {
        toast.error("Description must be between 10 and 2000 characters");
        return;
      }

      if (!newTourForm.price || parseFloat(newTourForm.price) < 0.99) {
        toast.error("Price must be at least 0.99");
        return;
      }

      if (!newTourForm.place) {
        toast.error("Please select a place/location");
        return;
      }

      // Call API to add tour
      const tourData = {
        name: newTourForm.name,
        description: newTourForm.description,
        price: parseFloat(newTourForm.price),
        place: newTourForm.place,
        categories: newTourForm.categories
          ? newTourForm.categories
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c)
          : [],
        tags: newTourForm.tags
          ? newTourForm.tags
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t)
          : [],
        languages: newTourForm.languages
          ? newTourForm.languages
              .split(",")
              .map((l) => l.trim())
              .filter((l) => l)
          : [],
        mainImage: newTourForm.mainImage,
        // include newly added gallery files and deleted ids when editing
        galleryImages: galleryNewFiles,
        deletedGallaryImages: deletedGalleryIds,
      };

      console.log("Submitting tour data:", tourData);
      if (editingTour) {
        await guideService.updateTour(editingTour._id, tourData);
      } else {
        await guideService.createTour(tourData);
      }

      // Reset form and close modal
      setNewTourForm({
        name: "",
        description: "",
        price: "",
        place: "",
        categories: "",
        tags: "",
        languages: "",
      });
      // clear gallery edit state
      setGalleryOldImages([]);
      setGalleryNewFiles([]);
      setDeletedGalleryIds([]);
      setShowTourModal(false);

      // Refresh dashboard data
      fetchTours();
      toast.success(`Tour ${editingTour ? "updated" : "added"} successfully!`);
    } catch (err) {
      console.error("Error creating tour:", err);
      console.error("Full error response:", err.response?.data);

      // Extract detailed error message
      let errorMessage = "Failed to create tour. ";

      if (
        err.response?.data?.errors &&
        Array.isArray(err.response.data.errors)
      ) {
        // Format validation errors
        const fieldErrors = err.response.data.errors
          .map((e) => `${e.field}: ${e.message}`)
          .join("\n");
        errorMessage += "\n" + fieldErrors;
      } else if (err.response?.data?.message) {
        errorMessage += err.response.data.message;
      } else {
        errorMessage += "Please check all required fields.";
      }

      toast.error(errorMessage);
    }
  };
  // HANDLE PLACE SUBMIT
  const handlePlaceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newPlaceForm.country || !newPlaceForm.city) {
        toast.error("Please provide both country and city");
        return;
      }

      await placeService.createPlace(newPlaceForm);
      toast.success("Place added successfully!");
      setShowPlaceModal(false);
      setNewPlaceForm({ country: "", city: "" });
      await fetchPlaces(); // REFRESH PLACE LIST
    } catch (err) {
      console.error("Error adding place:", err);
      toast.error("Failed to add place. Check console for details.");
    }
  };

  // HANDLE EDIT TOUR
  const handleEditTour = (tour) => {
    setEditingTour(tour);
    setNewTourForm({
      name: tour.name,
      description: tour.description,
      price: tour.price,
      place: tour.place._id,
      categories: tour.categories.join(","),
      tags: tour.tags.join(","),
      languages: tour.languages.join(","),
      mainImage: null,
    });
    // Initialize gallery editing state when opening edit modal
    setGalleryOldImages(tour.galleryImages || []);
    setGalleryNewFiles([]);
    setDeletedGalleryIds([]);
    setShowTourModal(true);
  };

  // HANDLE UPDATE GALLERY IMAGES
  const handleOpenGalleryModal = (tour) => {
    setEditingTour(tour);
    setGalleryImages(tour.galleryImages || []);
    setShowGalleryModal(true);
  };

  const handleOpenItems = (tour) => {
    navigate(`/guide/tours/${tour._id}/items`);
  };

  const handleCloseItems = () => {
    setShowItemsModal(false);
    setItemsTour(null);
  };

  const handleSaveGalleryImages = async (newImages, deletedIds) => {
    try {
      await guideService.updateTourGalleryImages(
        editingTour._id,
        newImages,
        deletedIds
      );
      setShowGalleryModal(false);
      fetchTours();
      toast.success("Gallery images updated successfully!");
    } catch (err) {
      toast.error("Failed to update gallery images.");
    }
  };

  // HANDLE DELETE TOUR
  const handleDeleteTour = async (id) => {
    if (!window.confirm(t("admin.tours.confirmDelete"))) return;
    try {
      await guideService.deleteTour(id);
      await fetchTours();
    } catch (err) {
      console.error("Error deleting tour:", err);
      toast.error("Failed to delete tour");
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>
            {t("guide.tours.title") || "Manage Tours"}
          </h1>
          <p className={`${secondaryText} mt-1`}>
            Manage and track all your tours
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              resetTourForm();
              setShowTourModal(true);
            }}
            className="flex items-center gap-2 bg-[#D5B36A] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#C7A15C] transition-all"
          >
            <FaPlus /> {t("guide.tours.add") || "Add Tour"}
          </button>
          <button
            onClick={() => setShowPlaceModal(true)}
            className="flex items-center gap-2 bg-[#D5B36A] text-black px-6 py-2 rounded-lg font-semibold hover:bg-[#C7A15C] transition-all"
          >
            <FaPlus /> Add Place
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`${cardBg} rounded-xl border ${borderColor} p-4`}>
        <div className="flex items-center gap-3">
          <FaSearch className={secondaryText} />
          <input
            type="text"
            placeholder={t("guide.tours.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent ${textColor} placeholder-${secondaryText} border-0 outline-none`}
          />
        </div>
      </div>

      {/* Tours Table */}
      <div
        className={`${cardBg} rounded-xl border ${borderColor} overflow-x-auto`}
      >
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className={`border-b ${borderColor} bg-opacity-50`}>
              <th
                className={`text-left py-4 px-6 font-semibold ${secondaryText}`}
              >
                {t("guide.tours.name")}
              </th>
              <th
                className={`text-left py-4 px-6 font-semibold ${secondaryText}`}
              >
                {t("guide.tours.city")}
              </th>
              <th
                className={`text-left py-4 px-6 font-semibold ${secondaryText}`}
              >
                {t("guide.tours.price")}
              </th>
              <th
                className={`text-left py-4 px-6 font-semibold ${secondaryText}`}
              >
                {t("guide.tours.rating")}
              </th>
              <th
                className={`text-left py-4 px-6 font-semibold ${secondaryText}`}
              >
                {t("guide.tours.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTours.length > 0 ? (
              filteredTours.map((tour) => (
                <tr
                  key={tour._id}
                  className={`border-b ${borderColor} hover:${
                    isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50"
                  } transition-colors`}
                >
                  <td className={`py-4 px-6 ${textColor} font-medium`}>
                    {tour.name}
                  </td>
                  <td className={`py-4 px-6 ${secondaryText}`}>
                    {tour.place.city}
                  </td>
                  <td className={`py-4 px-6 ${textColor}`}>{tour.price} EGP</td>
                  <td className={`py-4 px-6`}>
                    <span className="text-yellow-400">★ {tour.rating}</span>
                  </td>
                  <td className={`py-4 px-6`}>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTour(tour)}
                        className="p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-all"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteTour(tour._id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-green-500/20 text-green-400 transition-all"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleOpenItems(tour)}
                        className="p-2 rounded-lg hover:bg-indigo-500/20 text-indigo-400 transition-all"
                        title="Manage Waypoints"
                      >
                        <FaList />
                      </button>
                      <button
                        onClick={() => handleOpenGalleryModal(tour)}
                        className="p-2 rounded-lg hover:bg-yellow-500/20 text-yellow-500 transition-all"
                        title="Update Gallery Images"
                      >
                        <FaImages />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className={`py-8 text-center ${secondaryText}`}>
                  {t("guide.tours.notFound") || "No tours found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* TOUR MODAL */}
      {showTourModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onMouseDown={() => {
            setShowTourModal(false);
            resetTourForm();
          }}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className={`${cardBg} rounded-xl border ${borderColor} p-6 max-w-md w-full`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${textColor}`}>
                {editingTour
                  ? t("guide.tours.editTour") || "Edit Tour"
                  : t("guide.tours.addNew") || "Add New Tour"}
              </h3>
              <button
                onClick={() => {
                  setShowTourModal(false);
                  resetTourForm();
                }}
                className="p-2 hover:bg-[#D5B36A]/20 rounded-lg transition"
              >
                <FaTimes className={textColor} />
              </button>
            </div>
            <form onSubmit={handleTourSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {t("guide.tours.name") || "Tour Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={newTourForm.name}
                  onChange={handleTourChange}
                  placeholder="Enter tour name"
                  required
                  maxLength={100}
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
                <span className={`text-xs ${secondaryText}`}>
                  {newTourForm.name.length}/100 characters
                </span>
              </div>
              {/* Description */}
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  {t("guide.tours.description") || "Description"}
                </label>
                <textarea
                  name="description"
                  value={newTourForm.description}
                  onChange={handleTourChange}
                  placeholder="Enter tour description (min 10 characters)"
                  required
                  rows="3"
                  maxLength={2000}
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
                <span className={`text-xs ${secondaryText}`}>
                  {newTourForm.description.length}/2000 characters (min 10)
                </span>
              </div>
              {/* Price & Place */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-2`}
                  >
                    {t("guide.tours.price") || "Price (EGP)"}
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newTourForm.price}
                    onChange={handleTourChange}
                    placeholder="0.99"
                    step="0.01"
                    min="0.99"
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-2`}
                  >
                    {t("guide.tours.place") || "Place/Location"}
                  </label>
                  <select
                    name="place"
                    value={newTourForm.place}
                    onChange={handleTourChange}
                    required
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                  >
                    <option value="">Select a place</option>
                    {places.map((place) => (
                      <option key={place._id} value={place._id}>
                        {place.name} ({place.city}, {place.country})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Categories */}
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  Categories (comma-separated)
                </label>
                <input
                  type="text"
                  name="categories"
                  value={newTourForm.categories}
                  onChange={handleTourChange}
                  placeholder="e.g., Adventure, Cultural"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>
              {/* Tags */}
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={newTourForm.tags}
                  onChange={handleTourChange}
                  placeholder="e.g., outdoor, guided"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>
              {/* Languages */}
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  value={newTourForm.languages}
                  onChange={handleTourChange}
                  placeholder="e.g., English, Arabic"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>
              {/* Main Image */}
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  Image
                </label>
                <input
                  type="file"
                  name="mainImage"
                  onChange={handleTourChange}
                  accept="image/*"
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}
                />
              </div>

              {/* Gallery Images (edit & create) */}
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-2`}
                >
                  Gallery Images
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* existing images (not marked deleted) */}
                  {galleryOldImages
                    .filter((img) => !deletedGalleryIds.includes(img.public_id))
                    .map((img) => (
                      <div key={img.public_id} className="relative group">
                        <img
                          src={img.url}
                          alt="gallery"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 group-hover:opacity-100"
                          onClick={() =>
                            handleRemoveOldGalleryImage(img.public_id)
                          }
                          title="Remove"
                        >
                          <FaTimes size={14} />
                        </button>
                      </div>
                    ))}

                  {/* newly selected files previews */}
                  {galleryNewFiles.map((file, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={galleryNewPreviews?.[idx]}
                        alt={file.name}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 group-hover:opacity-100"
                        onClick={() => handleRemoveNewGalleryFile(idx)}
                        title="Remove"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ))}

                  {/* add box */}
                  <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer h-24">
                    <FaPlus size={20} className="text-[#D5B36A]" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleAddGalleryFiles}
                    />
                  </label>
                </div>
                <p className={`text-xs mt-2 ${secondaryText}`}>
                  You can remove existing images or add new ones. Changes will
                  be saved on submit.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setShowTourModal(false);
                    resetTourForm();
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${textColor} hover:bg-[#D5B36A]/10 transition-all font-medium`}
                >
                  {t("admin.cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium"
                >
                  {editingTour
                    ? t("admin.tours.update") || "Update"
                    : t("admin.tours.create") || "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PLACE MODAL */}
      {showPlaceModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onMouseDown={() => setShowPlaceModal(false)}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className={`${cardBg} rounded-xl border ${borderColor} p-6 max-w-md w-full`}
          >
            <AddPlaceForm
              onClose={() => setShowPlaceModal(false)}
              onCreated={() => {
                setShowPlaceModal(false);
                setNewPlaceForm({ country: "", city: "" });
                fetchPlaces();
              }}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}
      {/* UPDATE GALLERY MODAL */}
      {showGalleryModal && (
        <UpdateGalleryModal
          images={galleryImages}
          onClose={() => setShowGalleryModal(false)}
          onSave={handleSaveGalleryImages}
          isDarkMode={isDarkMode}
        />
      )}
      {/* Tour items are managed on a dedicated page: /guide/tours/:id/items */}
    </div>
  );
};

export default ManageTours;
