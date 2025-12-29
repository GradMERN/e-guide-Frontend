import { useState, useEffect } from "react";
import { useAuth as useTheme } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import i18n from "../../i18n";
import {FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaEyeSlash,FaImages, FaList, FaSpinner, FaMapMarkerAlt, FaTimes,} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UpdateGalleryModal from "../../components/guide/UpdateTourGalleryModal";
import AddPlaceForm from "../../components/guide/Place/AddPlaceForm";
import ConfirmModal from "../../components/common/ConfirmModal";
import LoadingScreen from "../../components/common/LoadingScreen";
import { toast } from "react-toastify";
import { guideService } from "../../apis/guideService";
import { placeService } from "../../apis/placeService";

const ManageTours = () => {
  const { isDarkMode } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [tours, setTours] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishingTourIds, setPublishingTourIds] = useState([]);
  const [loadingTourSubmit, setLoadingTourSubmit] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showPlaceModal, setShowPlaceModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null, action: null });

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
  const [imagePreview, setImagePreview] = useState(null);

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const inputBg = isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50";

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchTours(), fetchPlaces()]);
      setLoading(false);
    };
    loadInitialData();
  }, []);

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

  const fetchTours = async () => {
    try {
      const data = await guideService.getMyTours();
      setTours(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchPlaces = async () => {
    try {
      const placesData = await placeService.getAllPlaces();
      setPlaces(placesData);
    } catch (err) { setPlaces([]); }
  };

  const filteredTours = tours?.filter(
    (tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.place.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isTourPublished = (tour) => tour?.isPublished || false;

  const getTourItemsCount = (tour) => {
    if (typeof tour.itemsCount === "number") return tour.itemsCount;
    return tour.tourItems?.length || tour.items?.length || 0;
  };

  const getTourPublishedItemsCount = (tour) => {
    if (typeof tour.publishedItemsCount === "number") return tour.publishedItemsCount;
    const arr = tour.tourItems || tour.items || [];
    return arr.filter((it) => it?.isPublished).length;
  };

  const handleTourChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "mainImage") {
      const file = files[0];
      setNewTourForm((prev) => ({ ...prev, mainImage: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
      return;
    }
    setNewTourForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTourSubmit = async (e) => {
    e.preventDefault();
    setLoadingTourSubmit(true);
    try {
      if (!newTourForm.name || newTourForm.name.length < 3) {
        toast.error("Tour name must be at least 3 characters");
        return;
      }
      if (!newTourForm.place) {
        toast.error("Please select a place");
        return;
      }

      const tourData = {
        ...newTourForm,
        price: parseFloat(newTourForm.price),
        categories: newTourForm.categories ? newTourForm.categories.split(",").map(c => c.trim()) : [],
        tags: newTourForm.tags ? newTourForm.tags.split(",").map(t => t.trim()) : [],
        languages: newTourForm.languages ? newTourForm.languages.split(",").map(l => l.trim()) : [],
      };

      if (editingTour) {
        await guideService.updateTour(editingTour._id, tourData);
        toast.success("Tour updated successfully!");
      } else {
        await guideService.createTour(tourData);
        toast.success("Tour created successfully!");
      }

      setShowTourModal(false);
      setNewTourForm({ name: "", description: "", price: "", place: "", categories: "", tags: "", languages: "", mainImage: null });
      setImagePreview(null);
      setEditingTour(null);
      fetchTours();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save tour");
    } finally {
      setLoadingTourSubmit(false);
    }
  };

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
    setImagePreview(tour.mainImage?.url || null);
    setShowTourModal(true);
  };

  const handleDeleteTour = (tour) => {
    setConfirmModal({ open: true, item: tour, action: "delete" });
  };

  const confirmDeleteTour = async () => {
    const tour = confirmModal.item;
    setConfirmModal({ open: false, item: null, action: null });
    try {
      await guideService.deleteTour(tour._id);
      toast.success("Tour deleted successfully!");
      fetchTours();
    } catch (err) {
      toast.error("Failed to delete tour");
    }
  };

  const handleOpenGalleryModal = (tour) => {
    setEditingTour(tour);
    setGalleryImages(tour.galleryImages || []);
    setShowGalleryModal(true);
  };

  const handleSaveGalleryImages = async (newImages, deletedIds) => {
    try {
      await guideService.updateTourGalleryImages(editingTour._id, newImages, deletedIds);
      setShowGalleryModal(false);
      fetchTours();
      toast.success("Gallery updated successfully!");
    } catch (err) {
      toast.error("Failed to update gallery");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-1">
          <h1 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${textColor} tracking-tight`}>
            {t("guide.tours.title") || "Manage Tours"}
          </h1>
          <p className={`${secondaryText} text-xs sm:text-sm md:text-base`}>
            {t("guide.tours.manageAndTrack") || "Manage and track all your tours"}
          </p>
        </div>
        
        <button onClick={() => setShowPlaceModal(true)} className="flex items-center justify-center gap-2 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 bg-[#D5B36A] hover:bg-[#E2C784] text-black rounded-lg sm:rounded-xl font-bold text-sm sm:text-base transition-all active:scale-95 shadow-lg whitespace-nowrap">
          <FaPlus size={12} className="sm:w-3.5 sm:h-3.5" />
          <span className="hidden xs:inline">{t("guide.tours.addPlace") || "Add Place"}</span>
          <span className="xs:hidden">Add Place</span>
        </button>
      </div>

      <div className={`${cardBg} p-2 sm:p-2.5 rounded-lg sm:rounded-xl border ${borderColor} shadow-sm`}>
        <div className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3">
          <FaSearch className="text-[#D5B36A] text-sm sm:text-base shrink-0" />
          <input type="text" placeholder={t("guide.tours.searchPlaceholder") || "Search tours..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full py-1.5 sm:py-2 bg-transparent border-none focus:ring-0 ${textColor} placeholder-gray-500 text-sm sm:text-base outline-none`}/>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className={`text-sm sm:text-base md:text-lg font-bold ${textColor} flex items-center gap-2`}>
            <span className="w-1 h-4 sm:h-5 md:h-6 bg-[#D5B36A] rounded-full"></span>
            <span className="truncate">{t("guide.tours.allTours") || "Your Tours"}</span>
          </h2>
          <button onClick={() => {setEditingTour(null); setNewTourForm({ name: "", description: "", price: "", place: "", categories: "", tags: "", languages: "", mainImage: null }); setImagePreview(null); setShowTourModal(true);}}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#D5B36A] hover:bg-[#E2C784] text-black rounded-lg font-bold text-xs sm:text-sm transition-all active:scale-95 whitespace-nowrap">
            <FaPlus size={10} className="sm:w-3 sm:h-3" />
            <span className="hidden xs:inline">{t("guide.tours.addNew") || "Add Tour"}</span>
            <span className="xs:hidden">Add Tour</span>
          </button>
        </div>
        
        <div className={`hidden md:block ${cardBg} rounded-xl lg:rounded-2xl border ${borderColor} shadow-sm overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm lg:text-base">
              <thead>
                <tr className={`bg-gray-500/5 ${secondaryText} text-xs uppercase tracking-wider text-left`}>
                  <th className="py-3 lg:py-4 px-4 lg:px-6 font-bold whitespace-nowrap">{t("guide.tours.name")}</th>
                  <th className="py-3 lg:py-4 px-4 lg:px-6 font-bold whitespace-nowrap">{t("guide.tours.city")}</th>
                  <th className="py-3 lg:py-4 px-4 lg:px-6 font-bold whitespace-nowrap">{t("guide.tours.price")}</th>
                  <th className="py-3 lg:py-4 px-4 lg:px-6 font-bold whitespace-nowrap">{t("guide.tours.rating")}</th>
                  <th className="py-3 lg:py-4 px-4 lg:px-6 font-bold whitespace-nowrap text-center">{t("guide.tours.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10">
                {filteredTours.length > 0 ? (
                  filteredTours.map((tour) => {
                    const isPublished = isTourPublished(tour);
                    const itemsCount = getTourItemsCount(tour);
                    const publishedItemsCount = getTourPublishedItemsCount(tour);
                    const isPublishing = publishingTourIds.includes(tour._id);

                    return (
                      <tr key={tour._id} className={`transition-colors hover:${isDarkMode ? "bg-white/5" : "bg-gray-50"}`}>
                        <td className="py-3 lg:py-4 px-4 lg:px-6">
                          <div className="flex flex-col gap-1">
                            <span className={`font-bold ${textColor}`}>{tour.name}</span>
                            <div className="flex items-center gap-2">
                              {isPublished ? (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 font-bold border border-green-500/20">
                                  {t("guide.tours.states.published")}
                                </span>
                              ) : (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                                  {itemsCount === 0 ? "EMPTY" : "DRAFT"}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className={`py-3 lg:py-4 px-4 lg:px-6 ${secondaryText}`}>
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt size={12} className="text-[#D5B36A]" />
                            {tour.place.city}
                          </div>
                        </td>
                        <td className="py-3 lg:py-4 px-4 lg:px-6">
                          <span className={`font-bold ${textColor}`}>
                            {tour.price.toLocaleString()} 
                            <span className="text-[10px] opacity-60 ml-1">EGP</span>
                          </span>
                        </td>
                        <td className="py-3 lg:py-4 px-4 lg:px-6">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            ★ {tour.rating || "0.0"}
                          </div>
                        </td>
                        <td className="py-3 lg:py-4 px-4 lg:px-6">
                          <div className="flex items-center justify-center gap-1.5 lg:gap-2 flex-wrap">
                            <button  onClick={() => handleEditTour(tour)} className={`p-1.5 lg:p-2 rounded-lg border ${borderColor} ${secondaryText} hover:text-[#D5B36A] hover:border-[#D5B36A] transition-all`} title="Edit">
                              <FaEdit size={14} />
                            </button>
                            <button onClick={() => navigate(`/guide/tours/${tour._id}/items`)} className={`p-1.5 lg:p-2 rounded-lg border ${borderColor} ${secondaryText} hover:text-[#D5B36A] hover:border-[#D5B36A] transition-all`} title="Manage Items">
                              <FaList size={14} />
                            </button>
                            <button  onClick={() => handleOpenGalleryModal(tour)} className={`p-1.5 lg:p-2 rounded-lg border ${borderColor} ${secondaryText} hover:text-[#D5B36A] hover:border-[#D5B36A] transition-all`} title="Gallery">
                              <FaImages size={14} />
                            </button>
                            <button 
                              onClick={async () => {
                                if (itemsCount === 0) return;
                                if (itemsCount > 0 && publishedItemsCount === 0) {
                                  toast.error("No published items");
                                  return;
                                }
                                try {
                                  setPublishingTourIds(prev => [...prev, tour._id]);
                                  await guideService.publishTour(tour._id, { isPublished: !isPublished });
                                  fetchTours();
                                } catch (err) {
                                  toast.error("Failed to update");
                                } finally {
                                  setPublishingTourIds(prev => prev.filter(id => id !== tour._id));
                                }
                              }} disabled={itemsCount === 0 || isPublishing} className={`p-1.5 lg:p-2 rounded-lg border ${borderColor} transition-all ${itemsCount === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-[#D5B36A]"} ${isPublished ? "text-green-600" : "text-red-600"}`} title={itemsCount === 0 ? "No items" : isPublished ? "Unpublish" : "Publish"}>
                              {isPublishing ? <FaSpinner className="animate-spin" size={14} /> : isPublished ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                            </button>
                            <button onClick={() => handleDeleteTour(tour)} className={`p-1.5 lg:p-2 rounded-lg border ${borderColor} text-red-400 hover:bg-red-500 hover:text-white transition-all`} title="Delete">
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className={`py-12 text-center ${secondaryText} italic text-sm`}>
                      {t("guide.tours.notFound") || "No tours found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="md:hidden space-y-3">
          {filteredTours.length > 0 ? (
            filteredTours.map((tour) => {
              const isPublished = isTourPublished(tour);
              const itemsCount = getTourItemsCount(tour);
              const publishedItemsCount = getTourPublishedItemsCount(tour);
              const isPublishing = publishingTourIds.includes(tour._id);

              return (
                <div key={tour._id} className={`${cardBg} rounded-lg border ${borderColor} p-3 sm:p-4 shadow-sm`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold ${textColor} text-sm sm:text-base truncate`}>{tour.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <FaMapMarkerAlt size={10} className="text-[#D5B36A] shrink-0" />
                        <span className={`${secondaryText} text-xs truncate`}>{tour.place.city}</span>
                      </div>
                    </div>
                    {isPublished ? (
                      <span className="text-[9px] px-2 py-1 rounded bg-green-500/10 text-green-500 font-bold border border-green-500/20 whitespace-nowrap">
                        {t("guide.tours.states.published")}
                      </span>
                    ) : (
                      <span className="text-[9px] px-2 py-1 rounded bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 whitespace-nowrap">
                        {itemsCount === 0 ? "EMPTY" : "DRAFT"}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-xs sm:text-sm">
                    <div>
                      <span className={`${secondaryText}`}>Price: </span>
                      <span className={`font-bold ${textColor}`}>
                        {tour.price.toLocaleString()} <span className="text-[10px] opacity-60">EGP</span>
                      </span>
                    </div>
                    <div>
                      <span className={`${secondaryText}`}>Rating: </span>
                      <span className="text-amber-500 font-bold">★ {tour.rating || "0.0"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                    <button  onClick={() => handleEditTour(tour)} className={`p-2 sm:p-2.5 rounded-lg border ${borderColor} ${secondaryText} hover:text-[#D5B36A] hover:border-[#D5B36A] transition-all flex items-center justify-center`} title="Edit">
                      <FaEdit size={14} />
                    </button>
                    <button  onClick={() => navigate(`/guide/tours/${tour._id}/items`)} className={`p-2 sm:p-2.5 rounded-lg border ${borderColor} ${secondaryText} hover:text-[#D5B36A] hover:border-[#D5B36A] transition-all flex items-center justify-center`} title="Items">
                      <FaList size={14} />
                    </button>
                    <button  onClick={() => handleOpenGalleryModal(tour)} className={`p-2 sm:p-2.5 rounded-lg border ${borderColor} ${secondaryText} hover:text-[#D5B36A] hover:border-[#D5B36A] transition-all flex items-center justify-center`} title="Gallery">
                      <FaImages size={14} />
                    </button>
                    <button 
                      onClick={async () => {
                        if (itemsCount === 0) return;
                        if (itemsCount > 0 && publishedItemsCount === 0) {
                          toast.error("No published items");
                          return;
                        }
                        try {
                          setPublishingTourIds(prev => [...prev, tour._id]);
                          await guideService.publishTour(tour._id, { isPublished: !isPublished });
                          fetchTours();
                        } catch (err) {
                          toast.error("Failed to update");
                        } finally {
                          setPublishingTourIds(prev => prev.filter(id => id !== tour._id));
                        }
                      }}
                      disabled={itemsCount === 0 || isPublishing} className={`p-2 sm:p-2.5 rounded-lg border ${borderColor} transition-all flex items-center justify-center ${ itemsCount === 0 ? "opacity-50 cursor-not-allowed" : "hover:border-[#D5B36A]"} ${isPublished ? "text-green-600" : "text-red-600"}`} title={itemsCount === 0 ? "No items" : isPublished ? "Unpublish" : "Publish"}>
                      {isPublishing ? <FaSpinner className="animate-spin" size={14} /> : isPublished ? <FaEye size={14} /> : <FaEyeSlash size={14} />}
                    </button>
                    <button  onClick={() => handleDeleteTour(tour)} className={`p-2 sm:p-2.5 rounded-lg border ${borderColor} text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center`} title="Delete">
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={`${cardBg} rounded-lg border ${borderColor} p-8 text-center`}>
              <p className={`${secondaryText} italic text-sm`}>
                {t("guide.tours.notFound") || "No tours found"}
              </p>
            </div>
          )}
        </div>
      </div>

      {showTourModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`${cardBg} rounded-xl sm:rounded-2xl border ${borderColor} p-4 sm:p-5 md:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl my-auto`}>
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className={`text-base sm:text-lg md:text-xl font-bold ${textColor}`}>
                {editingTour ? "Edit Tour" : "Create New Tour"}
              </h3>
              <button onClick={() => setShowTourModal(false)} className="p-2 hover:bg-gray-500/10 rounded-lg transition-colors flex-shrink-0">
                <FaTimes className="text-[#D5B36A]" size={16} />
              </button>
            </div>
            
            <form onSubmit={handleTourSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="md:col-span-2">
                  <label className={`block text-xs sm:text-sm font-medium ${secondaryText} mb-1.5 sm:mb-2`}>Tour Name</label>
                  <input type="text" name="name" value={newTourForm.name} onChange={handleTourChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}/>
                </div>
                
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${secondaryText} mb-1.5 sm:mb-2`}>Location</label>
                  <select name="place" value={newTourForm.place} onChange={handleTourChange} required className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}>
                    <option value="">Select Place</option>
                    {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className={`block text-xs sm:text-sm font-medium ${secondaryText} mb-1.5 sm:mb-2`}>Description</label>
                  <textarea name="description" value={newTourForm.description} onChange={handleTourChange} rows="3" required className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A] resize-none`}/>
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${secondaryText} mb-1.5 sm:mb-2`}>Categories (comma separated)</label>
                  <input type="text" name="categories" value={newTourForm.categories} onChange={handleTourChange} className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}/>
                </div>

                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${secondaryText} mb-1.5 sm:mb-2`}>Tags (comma separated)</label>
                  <input type="text" name="tags" value={newTourForm.tags} onChange={handleTourChange} className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}/>
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-xs sm:text-sm font-medium ${secondaryText} mb-1.5 sm:mb-2`}>Main Image</label>
                  <input type="file" name="mainImage" onChange={handleTourChange} accept="image/*" className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-lg border ${borderColor} ${inputBg} ${textColor} focus:outline-none focus:border-[#D5B36A]`}/>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-2 w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg" />
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
                <button type="button" onClick={() => setShowTourModal(false)} className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border ${borderColor} ${textColor} font-bold hover:bg-gray-500/10 transition-colors`}>
                  Cancel
                </button>
                <button type="submit" disabled={loadingTourSubmit} className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[#D5B36A] text-black font-bold hover:bg-[#E2C784] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                  {loadingTourSubmit && <FaSpinner className="animate-spin" size={14} />}
                  {editingTour ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPlaceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`${cardBg} rounded-xl border ${borderColor} p-4 sm:p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl my-auto transition-all`}>
            <AddPlaceForm
              onClose={() => setShowPlaceModal(false)}
              onCreated={() => {
                setShowPlaceModal(false);
                fetchPlaces();
              }}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}

      {showGalleryModal && (
        <UpdateGalleryModal images={galleryImages} onClose={() => setShowGalleryModal(false)} onSave={handleSaveGalleryImages} isDarkMode={isDarkMode}/>
      )}

      <ConfirmModal isOpen={confirmModal.open} title="Confirm Delete" message={`Are you sure you want to delete "${confirmModal.item?.name}"?`} confirmText="Delete" cancelText="Cancel" onConfirm={confirmDeleteTour} onCancel={() => setConfirmModal({ open: false, item: null, action: null })} type="danger"/>
    </div>
  );
};

export default ManageTours;