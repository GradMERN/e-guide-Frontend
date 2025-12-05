import React, { useState, useEffect } from "react";
import { useAuth as useTheme } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaTimes,
  FaImages,
  FaList,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UpdateGalleryModal from "../../components/guide/UpdateTourGalleryModal";
import AddPlaceForm from "../../components/guide/Place/AddPlaceForm";
import { toast } from "react-toastify";
import { guideService } from "../../apis/guideService";
import { placeService } from "../../apis/placeService";
// TourItemsManager is available as a full-page at /guide/tours/:id/items

const ManageTours = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();

  const [visualizedTourIds, setVisualizedTourIds] = useState([]);
  const [publishingTourIds, setPublishingTourIds] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [tours, setTours] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loadingTourSubmit, setLoadingTourSubmit] = useState(false);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    item: null,
    action: null,
  });

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
  const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState(null);

  const [newTourForm, setNewTourForm] = useState({
    name: "",
    description: "",
    price: "",
    place: "",
    categories: "",
    tags: "",
    languages: "",
    mainImage: null,
    existingMainImage: null,
  });

  const [newPlaceForm, setNewPlaceForm] = useState({
    country: "",
    city: "",
  });

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";
  const secondaryText = "text-[var(--text-secondary)]";
  const inputBg = "bg-[var(--surface)]";

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

  // Tour states: published (tour.isPublished === true), not published (isPublished === false), empty (no tourItems)
  const isTourPublished = (tour) => {
    if (!tour) return false;
    if (Object.prototype.hasOwnProperty.call(tour, "isPublished")) {
      return !!tour.isPublished;
    }
    return false;
  };

  const getTourItemsCount = (tour) => {
    // prefer backend provided counts, fall back to legacy fields
    if (typeof tour.itemsCount === "number") return tour.itemsCount;
    if (Array.isArray(tour.tourItems)) return tour.tourItems.length;
    if (Array.isArray(tour.items)) return tour.items.length;
    if (Array.isArray(tour.waypoints)) return tour.waypoints.length;
    return 0;
  };

  const getTourPublishedItemsCount = (tour) => {
    if (typeof tour.publishedItemsCount === "number")
      return tour.publishedItemsCount;
    // heuristic: if items array has isPublished flags
    const arr = tour.tourItems || tour.items || tour.waypoints || [];
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.filter((it) => it && it.isPublished).length;
    }
    return 0;
  };

  const toggleVisualizedTour = (id) => {
    setVisualizedTourIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

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
      existingMainImage: null,
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
    if (mainImagePreviewUrl) {
      URL.revokeObjectURL(mainImagePreviewUrl);
      setMainImagePreviewUrl(null);
    }
  };

  // HANDLE TOUR FORM CHANGE
  const handleTourChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "mainImage") {
      const file = files[0] || null;
      setNewTourForm((prev) => ({ ...prev, mainImage: file }));
      // Handle preview
      if (mainImagePreviewUrl) {
        URL.revokeObjectURL(mainImagePreviewUrl);
      }
      if (file) {
        const url = URL.createObjectURL(file);
        setMainImagePreviewUrl(url);
      } else {
        setMainImagePreviewUrl(null);
      }
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
    setLoadingTourSubmit(true);
    try {
      // Validate inputs before submitting
      if (
        !newTourForm.name ||
        newTourForm.name.length < 3 ||
        newTourForm.name.length > 100
      ) {
        toast.error(
          t("guide.tours.validation.nameLength") ||
            "Tour name must be between 3 and 100 characters"
        );
        return;
      }

      if (
        !newTourForm.description ||
        newTourForm.description.length < 10 ||
        newTourForm.description.length > 2000
      ) {
        toast.error(
          t("guide.tours.validation.descriptionLength") ||
            "Description must be between 10 and 2000 characters"
        );
        return;
      }

      if (!newTourForm.price || parseFloat(newTourForm.price) < 0.99) {
        toast.error(
          t("guide.tours.validation.priceMin") || "Price must be at least 0.99"
        );
        return;
      }

      if (!newTourForm.place) {
        toast.error(
          t("guide.tours.validation.selectPlace") ||
            "Please select a place/location"
        );
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
      toast.success(
        editingTour
          ? t("guide.tours.messages.updated") || "Tour updated successfully!"
          : t("guide.tours.messages.added") || "Tour added successfully!"
      );
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
    } finally {
      setLoadingTourSubmit(false);
    }
  };
  // HANDLE PLACE SUBMIT
  const handlePlaceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!newPlaceForm.country || !newPlaceForm.city) {
        toast.error(
          t("guide.places.validation.missingCountryCity") ||
            "Please provide both country and city"
        );
        return;
      }

      await placeService.createPlace(newPlaceForm);
      toast.success(t("guide.places.added") || "Place added successfully!");
      setShowPlaceModal(false);
      setNewPlaceForm({ country: "", city: "" });
      await fetchPlaces(); // REFRESH PLACE LIST
    } catch (err) {
      console.error("Error adding place:", err);
      toast.error(
        t("guide.places.addFailed") ||
          "Failed to add place. Check console for details."
      );
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
      existingMainImage: tour.mainImage || null,
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
      toast.success(
        t("guide.tours.messages.galleryUpdated") ||
          "Gallery images updated successfully!"
      );
    } catch (err) {
      toast.error(
        t("guide.tours.errors.galleryUpdateFailed") ||
          "Failed to update gallery images."
      );
    }
  };

  // HANDLE DELETE TOUR
  const handleDeleteTour = (tour) => {
    setConfirmModal({ open: true, item: tour, action: "delete" });
  };

  const confirmDeleteTour = async () => {
    const tour = confirmModal.item;
    setConfirmModal({ open: false, item: null, action: null });
    try {
      await guideService.deleteTour(tour._id);
      await fetchTours();
      toast.success(
        t("guide.tours.messages.deleted") || "Tour deleted successfully!"
      );
    } catch (err) {
      console.error("Error deleting tour:", err);
      toast.error(
        t("guide.tours.errors.deleteFailed") || "Failed to delete tour"
      );
    }
  };

  const cancelDeleteTour = () => {
    setConfirmModal({ open: false, item: null, action: null });
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1
            className={`text-4xl font-bold ${
              isDarkMode ? "text-[#D5B36A]" : "text-[#8B4513]"
            } mb-2`}
          >
            {t("guide.tours.title") || "Manage Tours"}
          </h1>
          <p
            className={
              isDarkMode ? "text-gray-300 text-lg" : "text-gray-600 text-lg"
            }
          >
            {t("guide.tours.manageAndTrack") ||
              "Manage and track all your tours"}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowPlaceModal(true)}
            className={`flex items-center gap-3 px-6 py-3 ${
              isDarkMode
                ? "bg-gradient-to-b from-[#2c1810] to-[#1a0f08]"
                : "bg-white"
            } border-2 border-[#D5B36A] text-[#D5B36A] rounded-lg shadow-lg hover:shadow-[#D5B36A]/30 hover:shadow-xl transition-all duration-300 font-semibold relative overflow-hidden group cursor-pointer`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D5B36A' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
              boxShadow:
                "0 4px 15px rgba(213, 179, 106, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="absolute inset-0 bg-[#D5B36A]/0 group-hover:bg-[#D5B36A]/10 transition-colors duration-300"></div>
            <FaPlus className="text-[#D5B36A] group-hover:text-[#F5E6A3] transition-colors duration-300 z-10" />
            <span className="z-10">
              {t("guide.tours.addPlace") || "Add Place"}
            </span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div
        className={`${
          isDarkMode
            ? "bg-gradient-to-br from-[#1a0f08] to-[#2c1810]"
            : "bg-white"
        } rounded-xl border border-[#D5B36A]/30 p-4 shadow-lg`}
      >
        <div className="flex items-center gap-3">
          <FaSearch className="text-[#D5B36A]" />
          <input
            type="text"
            placeholder={t("guide.tours.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent ${
              isDarkMode ? "text-white" : "text-black"
            } placeholder-[#D5B36A]/60 border-0 outline-none focus:ring-2 focus:ring-[#D5B36A]/50 rounded-lg px-3 py-2 transition-all`}
          />
        </div>
      </div>

      {/* Tours Table */}
      <div
        className={`${cardBg} rounded-xl border ${borderColor} overflow-x-auto`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead
              className={`border-b ${borderColor} ${
                isDarkMode ? "bg-opacity-50" : ""
              }`}
            >
              <tr>
                <th
                  className={`text-left py-4 px-6 font-semibold ${secondaryText}`}
                >
                  {t("guide.tours.name")}
                </th>
                <th className="px-6 py-4 text-left text-[#D5B36A] font-bold text-sm uppercase tracking-wider border-r border-[#D5B36A]/20">
                  {t("guide.tours.city")}
                </th>
                <th className="px-6 py-4 text-left text-[#D5B36A] font-bold text-sm uppercase tracking-wider border-r border-[#D5B36A]/20">
                  {t("guide.tours.price")}
                </th>
                <th className="px-6 py-4 text-left text-[#D5B36A] font-bold text-sm uppercase tracking-wider border-r border-[#D5B36A]/20">
                  {t("guide.tours.rating")}
                </th>
                <th className="px-6 py-4 text-center text-[#D5B36A] font-bold text-sm uppercase tracking-wider">
                  {t("guide.tours.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5B36A]/20">
              {filteredTours.length > 0 ? (
                filteredTours.map((tour, index) => (
                  <tr
                    key={tour._id}
                    className="hover:bg-[#D5B36A]/5 transition-colors duration-200 group"
                    style={{
                      backgroundImage:
                        index % 2 === 0
                          ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D5B36A' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`
                          : "none",
                    }}
                  >
                    <td className="px-6 py-4 text-[var(--text)] font-medium border-r border-[#D5B36A]/10">
                      <div className="flex items-center gap-3">
                        <span>{tour.name}</span>
                        {(() => {
                          const isPublished = isTourPublished(tour);
                          const itemsCount = getTourItemsCount(tour);
                          const publishedItemsCount =
                            getTourPublishedItemsCount(tour);
                          const statusLabel = isPublished
                            ? t("guide.tours.states.published") || "Published"
                            : itemsCount === 0
                            ? t("guide.tours.states.empty") || "Empty"
                            : t("guide.tours.states.notPublished") ||
                              "Not Published";
                          const statusClass = isPublished
                            ? "bg-green-600 text-white"
                            : itemsCount === 0
                            ? "bg-red-600 text-white"
                            : "bg-yellow-500 text-black";
                          return (
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded-full ${statusClass}`}
                            >
                              {statusLabel}
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[var(--text-secondary)] border-r border-[#D5B36A]/10">
                      {tour.place.city}
                    </td>
                    <td className="px-6 py-4 text-[var(--primary)] font-semibold border-r border-[#D5B36A]/10">
                      {tour.price} {t("guide.tours.currency") || "EGP"}
                    </td>
                    <td className="px-6 py-4 border-r border-[#D5B36A]/10">
                      <span className="text-[var(--secondary)]">
                        ★ {tour.rating}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditTour(tour)}
                          className={`p-3 rounded-lg ${
                            isDarkMode
                              ? "bg-gradient-to-b from-[#2c1810] to-[#1a0f08]"
                              : "bg-white"
                          } border border-[#D5B36A]/50 text-[#D5B36A] hover:bg-[#D5B36A]/10 hover:border-[#D5B36A] transition-all duration-200 cursor-pointer`}
                          title={t("guide.tours.edit") || "Edit"}
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour)}
                          className={`p-3 rounded-lg ${
                            isDarkMode
                              ? "bg-gradient-to-b from-[#8B0000] to-[#5a0000]"
                              : "bg-white"
                          } border border-red-600/50 text-red-300 hover:bg-red-900/20 hover:border-red-500 transition-all duration-200 cursor-pointer`}
                          title={t("guide.tours.delete") || "Delete"}
                        >
                          <FaTrash className="text-sm" />
                        </button>
                        {(() => {
                          const isPublished = isTourPublished(tour);
                          const itemsCount = getTourItemsCount(tour);
                          const publishedItemsCount =
                            getTourPublishedItemsCount(tour);
                          const active = visualizedTourIds.includes(tour._id);
                          // Enable button when there are items; only fully disabled when there are ZERO items
                          const disabled = itemsCount === 0;
                          const isPublishing = publishingTourIds.includes(
                            tour._id
                          );
                          const iconColorClass = disabled
                            ? isDarkMode
                              ? "text-white"
                              : "text-[#D5B36A]"
                            : isPublished
                            ? "text-green-600"
                            : "text-red-600";
                          return (
                            <button
                              onClick={async () => {
                                if (disabled) return;
                                // If there are items but none published, show a helpful toast and do not toggle visualization
                                if (
                                  itemsCount > 0 &&
                                  publishedItemsCount === 0
                                ) {
                                  toast.error(
                                    t("guide.tours.errors.noPublishedItems") ||
                                      "There is no published items"
                                  );
                                  return;
                                }
                                // Toggle publish state on backend (like tour items)
                                try {
                                  setPublishingTourIds((prev) => [
                                    ...prev,
                                    tour._id,
                                  ]);
                                  const body = { isPublished: !isPublished };
                                  await guideService.publishTour(
                                    tour._id,
                                    body
                                  );
                                  await fetchTours();
                                } catch (err) {
                                  const msg =
                                    err?.response?.data?.message ||
                                    err.message ||
                                    "Failed to change publish state";
                                  toast.error(msg);
                                } finally {
                                  setPublishingTourIds((prev) =>
                                    prev.filter((id) => id !== tour._id)
                                  );
                                }
                              }}
                              disabled={disabled || isPublishing}
                              className={`p-3 rounded-lg ${
                                isDarkMode
                                  ? "bg-gradient-to-b from-[#2c1810] to-[#1a0f08]"
                                  : "bg-white"
                              } border border-[#D5B36A]/50 hover:bg-opacity-90 transition-all duration-200 ${
                                disabled
                                  ? "opacity-60 cursor-not-allowed"
                                  : "cursor-pointer"
                              } ${iconColorClass}`}
                              title={
                                disabled
                                  ? t("guide.tours.titles.noItems") ||
                                    "No items yet"
                                  : itemsCount > 0 && publishedItemsCount === 0
                                  ? t("guide.tours.titles.noPublishedItems") ||
                                    "No published items"
                                  : isPublishing
                                  ? t("guide.tours.titles.updating") ||
                                    "Updating..."
                                  : isPublished
                                  ? t("guide.tours.titles.unpublish") ||
                                    "Unpublish tour"
                                  : t("guide.tours.titles.publish") ||
                                    "Publish tour"
                              }
                            >
                              {isPublishing ? (
                                <FaSpinner
                                  className={`animate-spin text-sm ${
                                    isDarkMode ? "text-white" : "text-[#8B4513]"
                                  }`}
                                />
                              ) : isPublished ? (
                                <FaEye className="text-sm" />
                              ) : (
                                <FaEyeSlash className="text-sm" />
                              )}
                            </button>
                          );
                        })()}
                        <button
                          onClick={() => handleOpenItems(tour)}
                          className={`p-3 rounded-lg ${
                            isDarkMode
                              ? "bg-gradient-to-b from-[#2c1810] to-[#1a0f08]"
                              : "bg-white"
                          } border border-[#D5B36A]/50 text-[#D5B36A] hover:bg-[#D5B36A]/10 hover:border-[#D5B36A] transition-all duration-200 cursor-pointer`}
                          title={
                            t("guide.tours.titles.manageWaypoints") ||
                            "Manage Waypoints"
                          }
                        >
                          <FaList className="text-sm" />
                        </button>
                        <button
                          onClick={() => handleOpenGalleryModal(tour)}
                          className={`p-3 rounded-lg ${
                            isDarkMode
                              ? "bg-gradient-to-b from-[#2c1810] to-[#1a0f08]"
                              : "bg-white"
                          } border border-[#D5B36A]/50 text-[#D5B36A] hover:bg-[#D5B36A]/10 hover:border-[#D5B36A] transition-all duration-200 cursor-pointer`}
                          title={
                            t("guide.tours.titles.updateGalleryImages") ||
                            "Update Gallery Images"
                          }
                        >
                          <FaImages className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="py-8 text-center text-[#D5B36A]/70"
                  >
                    {t("guide.tours.notFound") || "No tours found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOUR MODAL */}
      {showTourModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onMouseDown={() => {
            setShowTourModal(false);
            resetTourForm();
          }}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#1a0f08] to-[#2c1810] rounded-xl border-2 border-[#D5B36A]/50 p-6 max-w-md w-full shadow-2xl"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D5B36A' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
              boxShadow:
                "0 0 30px rgba(213, 179, 106, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#D5B36A]">
                {editingTour
                  ? t("guide.tours.editTour") || "Edit Tour"
                  : t("guide.tours.addNew") || "Add New Tour"}
              </h3>
              <button
                onClick={() => {
                  setShowTourModal(false);
                  resetTourForm();
                }}
                className="p-2 hover:bg-[#D5B36A]/20 rounded-lg transition-all duration-200 cursor-pointer"
              >
                <FaTimes className="text-[#D5B36A]" />
              </button>
            </div>
            <form onSubmit={handleTourSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#D5B36A] mb-2">
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
                  className="w-full px-3 py-2 rounded-lg border border-[#D5B36A]/50 bg-[#2c1810] text-white focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/30 transition-all"
                />
                <span className="text-xs text-[#D5B36A]/70">
                  {newTourForm.name.length}/100 characters
                </span>
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#D5B36A] mb-2">
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
                  className="w-full px-3 py-2 rounded-lg border border-[#D5B36A]/50 bg-[#2c1810] text-white focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/30 transition-all"
                />
                <span className="text-xs text-[#D5B36A]/70">
                  {newTourForm.description.length}/2000 characters (min 10)
                </span>
              </div>
              {/* Price & Place */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#D5B36A] mb-2">
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
                    className="w-full px-3 py-2 rounded-lg border border-[#D5B36A]/50 bg-[#2c1810] text-white focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#D5B36A] mb-2">
                    {t("guide.tours.place") || "Place/Location"}
                  </label>
                  <select
                    name="place"
                    value={newTourForm.place}
                    onChange={handleTourChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-[#D5B36A]/50 bg-[#2c1810] text-white focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/30 transition-all"
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
                <label className="block text-sm font-medium text-[#D5B36A] mb-2">
                  Categories (comma-separated)
                </label>
                <input
                  type="text"
                  name="categories"
                  value={newTourForm.categories}
                  onChange={handleTourChange}
                  placeholder="e.g., Adventure, Cultural"
                  className="w-full px-3 py-2 rounded-lg border border-[#D5B36A]/50 bg-[#2c1810] text-white focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/30 transition-all"
                />
              </div>
              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-[#D5B36A] mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={newTourForm.tags}
                  onChange={handleTourChange}
                  placeholder="e.g., outdoor, guided"
                  className="w-full px-3 py-2 rounded-lg border border-[#D5B36A]/50 bg-[#2c1810] text-white focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/30 transition-all"
                />
              </div>
              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-[#D5B36A] mb-2">
                  Languages (comma-separated)
                </label>
                <input
                  type="text"
                  name="languages"
                  value={newTourForm.languages}
                  onChange={handleTourChange}
                  placeholder="e.g., English, Arabic"
                  className="w-full px-3 py-2 rounded-lg border border-[#D5B36A]/50 bg-[#2c1810] text-white focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/30 transition-all"
                />
              </div>
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-[#D5B36A] mb-2">
                  Image
                </label>
                <input
                  type="file"
                  name="mainImage"
                  onChange={handleTourChange}
                  accept="image/*"
                  className="w-full px-3 py-2 rounded-lg border border-[#D5B36A]/50 bg-[#2c1810] text-white focus:outline-none focus:border-[#D5B36A] focus:ring-2 focus:ring-[#D5B36A]/30 transition-all file:bg-[#D5B36A] file:text-black file:border-none file:rounded file:px-3 file:py-1 file:mr-3 file:font-medium hover:file:bg-[#C7A15C]"
                />
              </div>

              {/* Gallery Images (edit & create) */}
              <div>
                <label className="block text-sm font-medium text-[#D5B36A] mb-2">
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

                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#D5B36A]/50 rounded-lg cursor-pointer h-24 bg-[#2c1810] hover:bg-[#D5B36A]/5 transition-all">
                    <FaPlus size={20} className="text-[#D5B36A] mb-2" />
                    <span className="text-[#D5B36A] text-sm font-medium">
                      Add Images
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleAddGalleryFiles}
                    />
                  </label>
                </div>
                <p className="text-xs text-[#D5B36A]/70 mt-2">
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
                  className="flex-1 px-4 py-3 bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#D5B36A]/50 text-[#D5B36A] rounded-lg hover:bg-[#D5B36A]/10 hover:border-[#D5B36A] transition-all duration-300 font-semibold cursor-pointer"
                >
                  {t("admin.cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={loadingTourSubmit}
                  className="flex-1 px-4 py-3 bg-gradient-to-b from-[#D5B36A] to-[#C7A15C] border-2 border-[#D5B36A] text-black rounded-lg hover:from-[#F5E6A3] hover:to-[#D5B36A] transition-all duration-300 font-semibold shadow-lg hover:shadow-[#D5B36A]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loadingTourSubmit && <FaSpinner className="animate-spin" />}
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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onMouseDown={() => setShowPlaceModal(false)}
        >
          <div
            onMouseDown={(e) => e.stopPropagation()}
            className={`${
              isDarkMode
                ? "bg-gradient-to-br from-[#1a0f08] to-[#2c1810]"
                : "bg-white"
            } rounded-xl border-2 border-[#D5B36A]/50 p-6 max-w-md w-full shadow-2xl`}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D5B36A' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
              boxShadow:
                "0 0 30px rgba(213, 179, 106, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
            }}
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

      {/* CONFIRMATION MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#1a0f08] to-[#2c1810] border border-[var(--border)] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[var(--text)] mb-4">
              {t("admin.tours.confirmDelete") || "Confirm Delete"}
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {t("guide.tours.confirmDeleteMessage", {
                name: confirmModal.item?.name || "",
              }) ||
                `Are you sure you want to delete the tour "${confirmModal.item?.name}"? This action cannot be undone.`}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteTour}
                className="px-4 py-2 bg-[var(--secondary)] text-[var(--text)] rounded-lg hover:bg-[var(--secondary-hover)] transition-colors"
              >
                {t("common.cancel") || "Cancel"}
              </button>
              <button
                onClick={confirmDeleteTour}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t("common.delete") || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tour items are managed on a dedicated page: /guide/tours/:id/items */}
    </div>
  );
};

export default ManageTours;
