import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  FaPlus,
  FaTimes,
  FaImage,
  FaMusic,
  FaSpinner,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { tourItemService } from "../../../apis/tourItemService";
import ConfirmModal from "../../common/ConfirmModal";

const defaultItemForm = () => ({
  title: "",
  location: { type: "Point", coordinates: [0, 0] },
  script: "",
  contentType: "informational",
  mainImage: null,
  mainImagePreview: null,
  galleryImages: [],
  audio: null,
  audioPreview: null,
  deletedGalleryImages: [],
  existingMainImage: null,
  existingGallery: [],
  existingAudio: null,
});

const getTourId = (tour) => (typeof tour === "string" ? tour : tour?._id);

const TourItemsManager = ({
  tour,
  onClose,
  isDarkMode,
  onUpdated,
  open = false,
  initialEditing = null,
  initialFormMode = "create",
}) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultItemForm());
  const [taken, setTaken] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null });
  const mainImageRef = useRef(null);
  const galleryRef = useRef(null);
  const audioRef = useRef(null);
  const pinRef = useRef(null);
  const sparkIntervalRef = useRef(null);

  const borderColor = "border-[var(--border)]";
  const inputBg = "bg-[var(--surface)]";
  const textColor = "text-[var(--text)]";
  const secondaryText = "text-[var(--text-secondary)]";
  const cardBg = "bg-[var(--surface)]";

  useEffect(() => {
    if (!tour) return;
    fetchItems();
  }, [tour]);

  useEffect(() => {
    if (open) {
      if (initialEditing) handleEdit(initialEditing);
      else {
        setEditing(null);
        setForm(defaultItemForm());
        setFormMode(initialFormMode || "create");
        setShowForm(true);
      }
    } else {
      setShowForm(false);
    }
  }, [open, initialEditing, initialFormMode]);

  useEffect(() => {
    return () => {
      revokePreview(form.audioPreview);
      revokePreview(form.mainImagePreview);
      (form.galleryImages || []).forEach((g) => revokePreview(g.preview));
      if (sparkIntervalRef.current) {
        clearInterval(sparkIntervalRef.current);
        sparkIntervalRef.current = null;
      }
    };
  }, []);

  const revokePreview = (url) => {
    try {
      if (url) URL.revokeObjectURL(url);
    } catch (e) {}
  };

  const fetchItems = useCallback(
    async (silent = false) => {
      if (!getTourId(tour)) return;
      if (!silent) setLoading(true);
      try {
        const data = await tourItemService.getTourItems(getTourId(tour));
        setItems(data || []);
      } catch (err) {
        if (!silent) toast.error("Failed to load waypoints");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [tour]
  );

  const resetForm = useCallback(() => {
    setEditing(null);
    setForm((prev) => {
      revokePreview(prev.audioPreview);
      revokePreview(prev.mainImagePreview);
      (prev.galleryImages || []).forEach((g) => revokePreview(g.preview));
      return defaultItemForm();
    });
    setShowForm(false);
    setTaken(false);
    if (sparkIntervalRef.current) {
      clearInterval(sparkIntervalRef.current);
      sparkIntervalRef.current = null;
    }
  }, []);

  const handleEdit = useCallback((item) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      location: item.location || { type: "Point", coordinates: [0, 0] },
      script: item.script || "",
      contentType: item.contentType || "informational",
      mainImage: null,
      mainImagePreview: null,
      galleryImages: [],
      audio: null,
      audioPreview: null,
      deletedGalleryImages: [],
      existingMainImage: item.mainImage || null,
      existingGallery: item.galleryImages || [],
      existingAudio: item.audio || null,
    });
    setShowForm(true);
    setFormMode("edit");
    setTaken(
      Boolean(
        item.location &&
          item.location.coordinates &&
          item.location.coordinates[0] !== 0 &&
          item.location.coordinates[1] !== 0
      )
    );
  }, []);

  const handleOpenGallery = useCallback((item) => {
    setEditing(item);
    setForm({
      ...defaultItemForm(),
      existingGallery: item.galleryImages || [],
      deletedGalleryImages: [],
    });
    setShowForm(true);
    setFormMode("gallery");
  }, []);

  const handleDelete = useCallback((item) => {
    setConfirmModal({ open: true, item });
  }, []);

  const confirmDelete = useCallback(async () => {
    const item = confirmModal.item;
    setConfirmModal({ open: false, item: null });
    if (!item) return;
    try {
      setDeletingIds((p) => [...p, item._id]);
      await tourItemService.deleteTourItem(getTourId(tour), item._id);
      toast.success("Waypoint deleted");
      await fetchItems(true);
      onUpdated && onUpdated();
    } catch (err) {
      toast.error("Failed to delete waypoint");
    } finally {
      setDeletingIds((p) => p.filter((id) => id !== item._id));
    }
  }, [confirmModal, tour, fetchItems, onUpdated]);

  const cancelDelete = useCallback(() => {
    setConfirmModal({ open: false, item: null });
  }, []);

  const handleFileChange = useCallback((e, key, multiple = false) => {
    const files = Array.from(e.target.files || []);
    if (key === "mainImage" && !multiple) {
      const file = files[0] || null;
      setForm((p) => {
        revokePreview(p.mainImagePreview);
        return {
          ...p,
          mainImage: file,
          mainImagePreview: file ? URL.createObjectURL(file) : null,
        };
      });
    } else if (key === "audio" && !multiple) {
      const file = files[0] || null;
      setForm((p) => {
        revokePreview(p.audioPreview);
        return {
          ...p,
          audio: file,
          audioPreview: file ? URL.createObjectURL(file) : null,
        };
      });
    } else if (key === "galleryImages" && multiple) {
      const mapped = files.map((f) => ({
        file: f,
        preview: URL.createObjectURL(f),
      }));
      setForm((p) => ({
        ...p,
        galleryImages: [...(p.galleryImages || []), ...mapped],
      }));
    }
  }, []);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        setForm((p) => ({
          ...p,
          location: { type: "Point", coordinates: [lng, lat] },
        }));
        toast.success("Location detected");
        if (!taken) {
          setTaken(true);
          if (sparkIntervalRef.current) {
            clearInterval(sparkIntervalRef.current);
            sparkIntervalRef.current = null;
          }
        }
      },
      (err) => {
        toast.error("Unable to detect location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [taken]);

  const spawnSpark = useCallback(() => {
    const container = pinRef.current;
    if (!container) return;
    const spark = document.createElement("span");
    spark.className = "desert-key-spark";
    const px = Math.round(Math.random() * 60 + 20);
    const py = Math.round(Math.random() * 60 + 20);
    spark.style.position = "absolute";
    spark.style.left = `${px}%`;
    spark.style.top = `${py}%`;
    spark.style.pointerEvents = "none";
    const size = Math.max(4, Math.round(Math.random() * 8));
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.borderRadius = "50%";
    spark.style.opacity = "0";
    container.appendChild(spark);
    const remove = () => {
      try {
        spark.removeEventListener("animationend", remove);
        container.removeChild(spark);
      } catch (e) {}
    };
    spark.addEventListener("animationend", remove);
    requestAnimationFrame(() => {
      spark.style.opacity = "1";
      spark.classList.add("desert-key-spark-anim");
    });
  }, []);

  useEffect(() => {
    if (showForm && !taken) {
      if (sparkIntervalRef.current) {
        clearInterval(sparkIntervalRef.current);
        sparkIntervalRef.current = null;
      }
      spawnSpark();
      const interval = setInterval(() => {
        spawnSpark();
      }, 4200 + Math.floor(Math.random() * 3000));
      sparkIntervalRef.current = interval;
      return () => {
        if (sparkIntervalRef.current) {
          clearInterval(sparkIntervalRef.current);
          sparkIntervalRef.current = null;
        }
      };
    }
    return;
  }, [showForm, taken, spawnSpark]);

  const handleRemoveNewGallery = useCallback((index) => {
    setForm((p) => {
      const toRemove = p.galleryImages[index];
      const remaining = p.galleryImages.filter((_, i) => i !== index);
      try {
        if (toRemove && toRemove.preview) URL.revokeObjectURL(toRemove.preview);
      } catch (e) {}
      return { ...p, galleryImages: remaining };
    });
  }, []);

  const handleRemoveOldGallery = useCallback((publicId) => {
    setForm((p) => {
      const remaining = (p.existingGallery || []).filter(
        (img) => img.public_id !== publicId
      );
      return {
        ...p,
        existingGallery: remaining,
        deletedGalleryImages: [...(p.deletedGalleryImages || []), publicId],
      };
    });
  }, []);

  const submitForm = useCallback(
    async (e) => {
      e.preventDefault();
      const titleTrimmed = (form.title || "").trim();
      if (titleTrimmed.length < 3) {
        toast.error("Title must be at least 3 characters");
        return;
      }
      if (!form.script || form.script.trim().length === 0) {
        toast.error("Script is required for a waypoint");
        return;
      }
      setSubmitting(true);
      try {
        const fd = new FormData();
        fd.append("title", titleTrimmed);
        fd.append("tour", getTourId(tour));
        fd.append("location", JSON.stringify(form.location));
        fd.append("script", form.script || "");
        fd.append("contentType", form.contentType || "informational");
        if (form.mainImage) fd.append("mainImage", form.mainImage);
        if (form.audio) fd.append("audio", form.audio);
        (form.galleryImages || []).forEach((g) => {
          if (g && g.file) fd.append("galleryImages", g.file);
        });
        if (form.deletedGalleryImages && form.deletedGalleryImages.length) {
          fd.append(
            "deletedGalleryImages",
            JSON.stringify(form.deletedGalleryImages)
          );
        }
        if (editing) {
          await tourItemService.updateTourItem(
            getTourId(tour),
            editing._id,
            fd
          );
          toast.success("Waypoint updated");
        } else {
          await tourItemService.createTourItem(getTourId(tour), fd);
          toast.success("Waypoint created");
        }
        resetForm();
        await fetchItems();
        onUpdated && onUpdated();
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to save waypoint";
        toast.error(msg);
      } finally {
        setSubmitting(false);
      }
    },
    [form, editing, tour, resetForm, fetchItems, onUpdated]
  );

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50">
          {" "}
          <style>{`         @keyframes mapPinPulse {
          0% { text-shadow: 0 0 2px rgba(255,223,120,0.95); transform: scale(1); }
          40% { text-shadow: 0 0 22px rgba(255,223,120,0.98); transform: scale(1.18); }
          60% { text-shadow: 0 0 14px rgba(255,223,120,0.96); transform: scale(1.12); }
          100% { text-shadow: 0 0 2px rgba(255,223,120,0.95); transform: scale(1); }
        }
        .map-pin-pulse {
          animation: mapPinPulse 1.2s cubic-bezier(.2,.9,.2,1) infinite;
          will-change: transform, text-shadow;
        }
        .pin-with-halo {
          position: relative;
          isolation: isolate;
        }
        .pin-with-halo::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 120%;
          height: 120%;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle at 50% 40%, rgba(255,245,200,0.95) 0%, rgba(255,223,120,0.55) 20%, rgba(213,179,106,0.12) 45%, transparent 70%);
          filter: blur(10px) saturate(1.1);
          opacity: 0.9;
          animation: haloPulse 1.2s cubic-bezier(.2,.9,.2,1) infinite;
        }
        @keyframes haloPulse {
          0% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; filter: blur(6px) saturate(1); }
          45% { transform: translate(-50%,-50%) scale(1.18); opacity: 1; filter: blur(14px) saturate(1.15); }
          100% { transform: translate(-50%,-50%) scale(1); opacity: 0.6; filter: blur(6px) saturate(1); }
        }
        @keyframes desertSpark {
          0% { opacity: 0; transform: translate(0,0) scale(0.6); filter: blur(0px); }
          20% { opacity: 1; transform: translate(-8px,-8px) scale(1); filter: blur(0px); }
          100% { opacity: 0; transform: translate(-20px,-20px) scale(0.3); filter: blur(3px); }
        }
        .desert-key-spark {
          position: absolute;
          background: radial-gradient(circle, rgba(255,250,210,1) 0%, rgba(255,224,110,1) 40%, rgba(213,179,106,0.6) 70%, transparent 100%);
          pointer-events: none;
          transform-origin: center;
        }
        .desert-key-spark-anim {
          animation: desertSpark 900ms ease-out forwards;
        }
      `}</style>
          <div
            className={`max-w-3xl w-full mt-8 ${cardBg} rounded-xl border ${borderColor} p-6`}
          >
            {" "}
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${textColor}`}>
                Waypoints for {tour?.name || tour}
              </h3>{" "}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetForm();
                    onClose && onClose();
                  }}
                  className="p-2 hover:bg-[#D5B36A]/20 rounded"
                >
                  {" "}
                  <FaTimes className={textColor} />{" "}
                </button>{" "}
              </div>{" "}
            </div>{" "}
            <div className="space-y-4">
              {loading ? <div className={secondaryText}>Loading...</div> : null}{" "}
            </div>{" "}
            <div className="mt-4 border-t pt-4">
              {" "}
              <form onSubmit={submitForm} className="space-y-3">
                {" "}
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-1`}
                  >
                    Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                  />{" "}
                </div>
                <div
                  className="grid gap-3 items-end"
                  style={{ gridTemplateColumns: "45% 45% 10%" }}
                >
                  {" "}
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryText} mb-1`}
                    >
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.location.coordinates[0]}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          location: {
                            ...p.location,
                            coordinates: [
                              parseFloat(e.target.value || 0),
                              p.location.coordinates[1],
                            ],
                          },
                        }))
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                    />{" "}
                  </div>{" "}
                  <div>
                    <label
                      className={`block text-sm font-medium ${secondaryText} mb-1`}
                    >
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={form.location.coordinates[1]}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          location: {
                            ...p.location,
                            coordinates: [
                              p.location.coordinates[0],
                              parseFloat(e.target.value || 0),
                            ],
                          },
                        }))
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                    />{" "}
                  </div>{" "}
                  <div>
                    <button
                      ref={pinRef}
                      type="button"
                      onClick={() => {
                        try {
                          setTaken(true);
                          if (sparkIntervalRef.current) {
                            clearInterval(sparkIntervalRef.current);
                            sparkIntervalRef.current = null;
                          }
                          const container = pinRef.current;
                          if (container) {
                            Array.from(
                              container.querySelectorAll(".desert-key-spark")
                            ).forEach((s) => s.remove());
                          }
                        } catch (e) {}
                        detectLocation();
                      }}
                      title="Detect my location"
                      className="h-12 w-full bg-transparent text-[var(--text)] transition-all justify-self-end flex items-center justify-center p-0 border-0 cursor-pointer"
                      style={{ background: "transparent" }}
                    >
                      <FaMapMarkerAlt
                        className={`w-5 h-5 text-[#D5B36A] ${
                          !taken ? "map-pin-pulse" : ""
                        }`}
                        style={{
                          textShadow: taken
                            ? "none"
                            : "0 0 1px rgba(213,179,106,0.95)",
                        }}
                      />{" "}
                    </button>{" "}
                  </div>{" "}
                </div>{" "}
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-1`}
                  >
                    Script
                  </label>
                  <textarea
                    value={form.script}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, script: e.target.value }))
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                    rows={3}
                    required
                  />{" "}
                </div>{" "}
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-1`}
                  >
                    Content Type
                  </label>
                  <select
                    value={form.contentType}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, contentType: e.target.value }))
                    }
                    className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                  >
                    {" "}
                    <option value="informational">Informational</option>{" "}
                    <option value="interactive">Interactive</option>{" "}
                    <option value="activity">Activity</option>{" "}
                    <option value="photo-spot">Photo spot</option>{" "}
                  </select>{" "}
                </div>{" "}
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-1`}
                  >
                    Main Image
                  </label>
                  <button
                    type="button"
                    onClick={() => mainImageRef.current?.click()}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#D5B36A] text-[#D5B36A] rounded-lg shadow-lg hover:shadow-[#D5B36A]/30 hover:shadow-xl transition-all duration-300 font-semibold relative overflow-hidden group"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D5B36A' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      boxShadow:
                        "0 4px 15px rgba(213, 179, 106, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {" "}
                    <div className="absolute inset-0 bg-[#D5B36A]/0 group-hover:bg-[#D5B36A]/10 transition-colors duration-300"></div>{" "}
                    <FaImage className="text-[#D5B36A] group-hover:text-[#F5E6A3] transition-colors duration-300 z-10" />{" "}
                    <span className="z-10">Select Main Image</span>{" "}
                  </button>
                  <input
                    ref={mainImageRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "mainImage", false)}
                    className="hidden"
                  />
                  {form.mainImagePreview ? (
                    <div className="mt-2">
                      <div className={`text-xs ${secondaryText} mb-1`}>
                        New main image
                      </div>{" "}
                      <img
                        src={form.mainImagePreview}
                        alt="new"
                        className="w-48 h-28 object-cover rounded"
                      />{" "}
                    </div>
                  ) : form.existingMainImage?.url ? (
                    <div className="mt-2">
                      <div className={`text-xs ${secondaryText} mb-1`}>
                        Existing main image
                      </div>{" "}
                      <img
                        src={form.existingMainImage.url}
                        alt="existing"
                        className="w-48 h-28 object-cover rounded"
                      />{" "}
                    </div>
                  ) : null}{" "}
                </div>{" "}
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-3`}
                  >
                    Gallery Images
                  </label>
                  <input
                    ref={galleryRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, "galleryImages", true)}
                    className="hidden"
                  />{" "}
                  <div className="grid grid-cols-4 gap-3">
                    {(form.existingGallery || [])
                      .filter(
                        (img) =>
                          !form.deletedGalleryImages?.includes(img.public_id)
                      )
                      .map((img) => (
                        <div key={img.public_id} className="relative group">
                          {" "}
                          <div className="aspect-square bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#D5B36A] rounded-lg overflow-hidden shadow-lg hover:shadow-[#D5B36A]/30 transition-all duration-300">
                            {" "}
                            <img
                              src={img.url}
                              alt={img.public_id}
                              className="w-full h-full object-cover"
                            />{" "}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveOldGallery(img.public_id)
                                }
                                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                              >
                                {" "}
                                <FaTimes size={14} />{" "}
                              </button>{" "}
                            </div>{" "}
                          </div>{" "}
                        </div>
                      ))}
                    {(form.galleryImages || []).map((g, idx) => (
                      <div key={`new-${idx}`} className="relative group">
                        {" "}
                        <div className="aspect-square bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#4ade80] rounded-lg overflow-hidden shadow-lg hover:shadow-[#4ade80]/30 transition-all duration-300">
                          {" "}
                          <img
                            src={g.preview}
                            alt={g.file.name}
                            className="w-full h-full object-cover"
                          />{" "}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() => handleRemoveNewGallery(idx)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                            >
                              {" "}
                              <FaTimes size={14} />{" "}
                            </button>{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>
                    ))}
                    <div
                      onClick={() => galleryRef.current?.click()}
                      className="aspect-square bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-dashed border-[#D5B36A] rounded-lg cursor-pointer hover:border-[#F5E6A3] hover:shadow-lg hover:shadow-[#D5B36A]/30 transition-all duration-300 flex flex-col items-center justify-center group"
                    >
                      {" "}
                      <div className="text-3xl text-[#D5B36A] group-hover:text-[#F5E6A3] transition-colors duration-300 mb-2">
                        {" "}
                        <FaPlus />{" "}
                      </div>
                      <div
                        className={`text-xs font-medium ${secondaryText} group-hover:text-[#D5B36A] transition-colors duration-300 text-center`}
                      >
                        Add Images
                      </div>{" "}
                    </div>{" "}
                  </div>
                  {((form.existingGallery || []).filter(
                    (img) => !form.deletedGalleryImages?.includes(img.public_id)
                  ).length > 0 ||
                    (form.galleryImages || []).length > 0) && (
                    <div
                      className={`text-xs ${secondaryText} mt-3 text-center`}
                    >
                      {(form.existingGallery || []).filter(
                        (img) =>
                          !form.deletedGalleryImages?.includes(img.public_id)
                      ).length + (form.galleryImages || []).length}{" "}
                      images in gallery{" "}
                    </div>
                  )}{" "}
                </div>{" "}
                <div>
                  <label
                    className={`block text-sm font-medium ${secondaryText} mb-1`}
                  >
                    Audio
                  </label>
                  <button
                    type="button"
                    onClick={() => audioRef.current?.click()}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#D5B36A] text-[#D5B36A] rounded-lg shadow-lg hover:shadow-[#D5B36A]/30 hover:shadow-xl transition-all duration-300 font-semibold relative overflow-hidden group"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D5B36A' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      boxShadow:
                        "0 4px 15px rgba(213, 179, 106, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {" "}
                    <div className="absolute inset-0 bg-[#D5B36A]/0 group-hover:bg-[#D5B36A]/10 transition-colors duration-300"></div>{" "}
                    <FaMusic className="text-[#D5B36A] group-hover:text-[#F5E6A3] transition-colors duration-300 z-10" />{" "}
                    <span className="z-10">Select Audio</span>{" "}
                  </button>
                  <input
                    ref={audioRef}
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileChange(e, "audio", false)}
                    className="hidden"
                  />
                  {form.existingAudio?.url && (
                    <div className="mt-2">
                      <div className={`text-xs ${secondaryText} mb-1`}>
                        Existing audio
                      </div>{" "}
                      <audio
                        controls
                        src={form.existingAudio.url}
                        className="w-full"
                      />{" "}
                    </div>
                  )}
                  {form.audioPreview && (
                    <div className="mt-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm">
                      <div
                        className={`text-sm font-medium ${secondaryText} mb-2 flex items-center gap-2`}
                      >
                        {" "}
                        <FaMusic className="text-[var(--primary)]" />
                        Audio Preview{" "}
                      </div>{" "}
                      <div className="relative">
                        <audio
                          controls
                          src={form.audioPreview}
                          className="w-full h-10 rounded-md bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                          style={{ filter: "hue-rotate(25deg) saturate(1.2)" }}
                        />{" "}
                        <div className="absolute inset-0 pointer-events-none rounded-md bg-gradient-to-r from-[var(--primary)]/10 to-transparent opacity-50"></div>{" "}
                      </div>
                      <div
                        className={`text-xs ${secondaryText} mt-2 text-center`}
                      >
                        Preview of uploaded audio file
                      </div>{" "}
                    </div>
                  )}{" "}
                </div>{" "}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      if (onClose) onClose();
                    }}
                    className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${textColor} hover:bg-[#D5B36A]/10`}
                  >
                    Cancel{" "}
                  </button>{" "}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting && <FaSpinner className="animate-spin" />}
                    {editing ? "Update" : "Create"}{" "}
                  </button>{" "}
                </div>{" "}
              </form>{" "}
            </div>
            <ConfirmModal
              isOpen={confirmModal.open}
              title="Confirm Delete"
              message={`Are you sure you want to delete the waypoint "${confirmModal.item?.title}"? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
              type="danger"
            />{" "}
          </div>{" "}
        </div>
      )}
    </>
  );
};

export default TourItemsManager;
