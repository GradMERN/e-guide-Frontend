import React, { useEffect, useState, useRef } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaImage,
  FaImages,
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
  galleryImages: [],
  audio: null,
  deletedGallaryImages: [],
  existingMainImage: null,
  existingGallery: [],
  existingAudio: null,
});

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
  const [formMode, setFormMode] = useState("create"); // 'create' | 'edit' | 'gallery'
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultItemForm());
  const [taken, setTaken] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState(null);
  const [mainImagePreviewUrl, setMainImagePreviewUrl] = useState(null);
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

  // sync controlled open/initial props
  useEffect(() => {
    if (open) {
      if (initialEditing) {
        handleEdit(initialEditing);
      } else {
        setEditing(null);
        setForm(defaultItemForm());
        setFormMode(initialFormMode || "create");
        setShowForm(true);
      }
    } else {
      setShowForm(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialEditing, initialFormMode]);

  // Cleanup audio preview URL on unmount
  useEffect(() => {
    return () => {
      if (audioPreviewUrl) {
        URL.revokeObjectURL(audioPreviewUrl);
      }
      if (mainImagePreviewUrl) {
        URL.revokeObjectURL(mainImagePreviewUrl);
      }
    };
  }, [audioPreviewUrl, mainImagePreviewUrl]);

  const fetchItems = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await tourItemService.getTourItems(tour._id || tour);
      setItems(data || []);
    } catch (err) {
      if (!silent) toast.error("Failed to load waypoints");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const resetForm = () => {
    setEditing(null);
    setForm(defaultItemForm());
    setShowForm(false);
    // Clean up audio preview
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
      setAudioPreviewUrl(null);
    }
    if (mainImagePreviewUrl) {
      URL.revokeObjectURL(mainImagePreviewUrl);
      setMainImagePreviewUrl(null);
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title || "",
      location: item.location || { type: "Point", coordinates: [0, 0] },
      script: item.script || "",
      contentType: item.contentType || "informational",
      mainImage: null,
      galleryImages: [],
      audio: null,
      deletedGallaryImages: [],
      existingMainImage: item.mainImage || null,
      existingGallery: item.galleryImages || [],
      existingAudio: item.audio || null,
    });
    setShowForm(true);
    setFormMode("edit");
  };

  const handleOpenGallery = (item) => {
    setEditing(item);
    setForm({
      ...defaultItemForm(),
      existingGallery: item.galleryImages || [],
      deletedGallaryImages: [],
    });
    setShowForm(true);
    setFormMode("gallery");
  };

  const handleDelete = (item) => {
    setConfirmModal({ open: true, item });
  };

  const confirmDelete = async () => {
    const item = confirmModal.item;
    setConfirmModal({ open: false, item: null });
    try {
      setDeletingIds((p) => [...p, item._id]);
      await tourItemService.deleteTourItem(tour._id || tour, item._id);
      toast.success("Waypoint deleted");
      // refresh silently to avoid visible flicker
      await fetchItems(true);
      onUpdated && onUpdated();
    } catch (err) {
      toast.error("Failed to delete waypoint");
    } finally {
      setDeletingIds((p) => p.filter((id) => id !== item._id));
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ open: false, item: null });
  };

  const handleFileChange = (e, key, multiple = false) => {
    const files = Array.from(e.target.files || []);
    if (multiple) {
      setForm((p) => ({
        ...p,
        [key]: [...(p[key] || []), ...files],
      }));
    } else {
      const file = files[0] || null;
      setForm((p) => ({ ...p, [key]: file }));
      // Handle audio preview
      if (key === "audio") {
        if (audioPreviewUrl) {
          URL.revokeObjectURL(audioPreviewUrl);
        }
        if (file) {
          const url = URL.createObjectURL(file);
          setAudioPreviewUrl(url);
        } else {
          setAudioPreviewUrl(null);
        }
      }
      // Handle main image preview
      if (key === "mainImage") {
        if (mainImagePreviewUrl) {
          URL.revokeObjectURL(mainImagePreviewUrl);
        }
        if (file) {
          const url = URL.createObjectURL(file);
          setMainImagePreviewUrl(url);
        } else {
          setMainImagePreviewUrl(null);
        }
      }
    }
  };

  const detectLocation = () => {
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
        // create a few quick sparks to simulate the key-reflection (only if not taken)
        if (!taken) {
          try {
            spawnSpark();
            setTimeout(spawnSpark, 120);
            setTimeout(spawnSpark, 260);
          } catch (e) {}
        }
      },
      (err) => {
        console.error("Geolocation error", err);
        toast.error("Unable to detect location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const spawnSpark = (opts = {}) => {
    const container = pinRef.current;
    if (!container) return;
    const spark = document.createElement("span");
    spark.className = "desert-key-spark";
    // random offset within the button area
    const px = Math.round(Math.random() * 60 + 20); // percent-ish
    const py = Math.round(Math.random() * 60 + 20);
    spark.style.position = "absolute";
    spark.style.left = `${px}%`;
    spark.style.top = `${py}%`;
    spark.style.pointerEvents = "none";
    // slight random size
    const size = Math.max(4, Math.round(Math.random() * 8));
    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.borderRadius = "50%";
    spark.style.opacity = "0";
    container.appendChild(spark);
    // remove after animation
    const remove = () => {
      try {
        spark.removeEventListener("animationend", remove);
        container.removeChild(spark);
      } catch (e) {}
    };
    spark.addEventListener("animationend", remove);
    // force browser to pick up element before adding class
    // start the animation via class
    requestAnimationFrame(() => {
      spark.style.opacity = "1";
      spark.classList.add("desert-key-spark-anim");
    });
  };

  useEffect(() => {
    // start periodic subtle sparks when form is shown and key not taken
    if (showForm && !taken) {
      sparkIntervalRef.current = setInterval(() => {
        spawnSpark();
      }, 4200 + Math.floor(Math.random() * 3000));
    }
    return () => {
      if (sparkIntervalRef.current) clearInterval(sparkIntervalRef.current);
      sparkIntervalRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForm, taken]);

  const handleRemoveNewGallery = (index) => {
    setForm((p) => ({
      ...p,
      galleryImages: p.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveOldGallery = (publicId) => {
    setForm((p) => ({
      ...p,
      deletedGallaryImages: [...(p.deletedGallaryImages || []), publicId],
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.title || form.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    // Script is required
    if (!form.script || form.script.trim().length === 0) {
      toast.error("Script is required for a waypoint");
      return;
    }
    setSubmitting(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("tour", tour._id || tour);
    fd.append("location", JSON.stringify(form.location));
    fd.append("script", form.script || "");
    fd.append("contentType", form.contentType || "informational");
    if (form.mainImage) fd.append("mainImage", form.mainImage);
    if (form.audio) fd.append("audio", form.audio);
    (form.galleryImages || []).forEach((f) => fd.append("galleryImages", f));
    if (form.deletedGallaryImages && form.deletedGallaryImages.length) {
      fd.append(
        "deletedGallaryImages",
        JSON.stringify(form.deletedGallaryImages)
      );
    }

    //read fd data
    for (let pair of fd.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    try {
      // Debug: log FormData entries (helps verify keys sent to backend)
      try {
        for (let pair of fd.entries()) {
          // printing files will show File objects
          // eslint-disable-next-line no-console
          console.debug("FormData:", pair[0], pair[1]);
        }
      } catch (e) {}
      if (editing) {
        await tourItemService.updateTourItem(tour._id || tour, editing._id, fd);
        toast.success("Waypoint updated");
      } else {
        await tourItemService.createTourItem(tour._id || tour, fd);
        toast.success("Waypoint created");
      }
      resetForm();
      fetchItems();
      onUpdated && onUpdated();
    } catch (err) {
      console.error("Failed to save waypoint:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save waypoint";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // fullPage rendering is handled earlier; default modal rendering here
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50">
      <style>{`
        /* bigger, more powerful pulse */
        @keyframes mapPinPulse {
          0% { text-shadow: 0 0 2px rgba(255,223,120,0.95); transform: scale(1); }
          40% { text-shadow: 0 0 22px rgba(255,223,120,0.98); transform: scale(1.18); }
          60% { text-shadow: 0 0 14px rgba(255,223,120,0.96); transform: scale(1.12); }
          100% { text-shadow: 0 0 2px rgba(255,223,120,0.95); transform: scale(1); }
        }
        .map-pin-pulse {
          animation: mapPinPulse 1.2s cubic-bezier(.2,.9,.2,1) infinite;
          will-change: transform, text-shadow;
        }

        /* halo around the pin to make it look like a shining key in the sand */
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

        /* spark animation (unchanged but slightly brighter) */
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
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${textColor}`}>
            Waypoints for {tour.name || tour}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose && onClose();
              }}
              className="p-2 hover:bg-[#D5B36A]/20 rounded"
            >
              <FaTimes className={textColor} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className={secondaryText}>Loading...</div>
          ) : showForm ? null : (
            <div className="text-center py-8">
              <p className={secondaryText}>
                No waypoint form is currently open.
              </p>
            </div>
          )}
        </div>

        {showForm && (
          <div className="mt-4 border-t pt-4">
            {/* form same as before */}
            <form onSubmit={submitForm} className="space-y-3">
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
                />
              </div>
              <div
                className="grid gap-3 items-end"
                style={{ gridTemplateColumns: "45% 45% 10%" }}
              >
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
                  />
                </div>
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
                  />
                </div>
                <div>
                  <button
                    ref={pinRef}
                    type="button"
                    onClick={() => {
                      // user takes the key: stop pulsing and sparks
                      try {
                        setTaken(true);
                        if (sparkIntervalRef.current) {
                          clearInterval(sparkIntervalRef.current);
                          sparkIntervalRef.current = null;
                        }
                        // remove existing sparks
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
                    className={`h-12 w-full bg-transparent text-[var(--text)] transition-all justify-self-end flex items-center justify-center p-0 border-0 cursor-pointer`}
                    style={{
                      background: "transparent",
                    }}
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
                    />
                  </button>
                </div>
              </div>
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
                />
              </div>
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
                  <option value="informational">Informational</option>
                  <option value="interactive">Interactive</option>
                  <option value="activity">Activity</option>
                  <option value="photo-spot">Photo spot</option>
                </select>
              </div>
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
                  <div className="absolute inset-0 bg-[#D5B36A]/0 group-hover:bg-[#D5B36A]/10 transition-colors duration-300"></div>
                  <FaImage className="text-[#D5B36A] group-hover:text-[#F5E6A3] transition-colors duration-300 z-10" />
                  <span className="z-10">Select Main Image</span>
                </button>
                <input
                  ref={mainImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "mainImage", false)}
                  className="hidden"
                />
                {form.mainImage ? (
                  <div className="mt-2">
                    <div className={`text-xs ${secondaryText} mb-1`}>
                      New main image
                    </div>
                    <img
                      src={mainImagePreviewUrl}
                      alt="new"
                      className="w-48 h-28 object-cover rounded"
                    />
                  </div>
                ) : form.existingMainImage?.url ? (
                  <div className="mt-2">
                    <div className={`text-xs ${secondaryText} mb-1`}>
                      Existing main image
                    </div>
                    <img
                      src={form.existingMainImage.url}
                      alt="existing"
                      className="w-48 h-28 object-cover rounded"
                    />
                  </div>
                ) : null}
              </div>
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
                />

                {/* Gallery Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {/* Existing Gallery Images */}
                  {(form.existingGallery || [])
                    .filter(
                      (img) =>
                        !form.deletedGallaryImages?.includes(img.public_id)
                    )
                    .map((img) => (
                      <div key={img.public_id} className="relative group">
                        <div className="aspect-square bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#D5B36A] rounded-lg overflow-hidden shadow-lg hover:shadow-[#D5B36A]/30 transition-all duration-300">
                          <img
                            src={img.url}
                            alt={img.public_id}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveOldGallery(img.public_id)
                              }
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                            >
                              <FaTimes size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* New Gallery Images */}
                  {(form.galleryImages || []).map((file, idx) => (
                    <div key={`new-${idx}`} className="relative group">
                      <div className="aspect-square bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-[#4ade80] rounded-lg overflow-hidden shadow-lg hover:shadow-[#4ade80]/30 transition-all duration-300">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleRemoveNewGallery(idx)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors duration-200"
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add More Images Box */}
                  <div
                    onClick={() => galleryRef.current?.click()}
                    className="aspect-square bg-gradient-to-b from-[#2c1810] to-[#1a0f08] border-2 border-dashed border-[#D5B36A] rounded-lg cursor-pointer hover:border-[#F5E6A3] hover:shadow-lg hover:shadow-[#D5B36A]/30 transition-all duration-300 flex flex-col items-center justify-center group"
                  >
                    <div className="text-3xl text-[#D5B36A] group-hover:text-[#F5E6A3] transition-colors duration-300 mb-2">
                      <FaPlus />
                    </div>
                    <div
                      className={`text-xs font-medium ${secondaryText} group-hover:text-[#D5B36A] transition-colors duration-300 text-center`}
                    >
                      Add Images
                    </div>
                  </div>
                </div>

                {/* Image Count Display */}
                {((form.existingGallery || []).filter(
                  (img) => !form.deletedGallaryImages?.includes(img.public_id)
                ).length > 0 ||
                  (form.galleryImages || []).length > 0) && (
                  <div className={`text-xs ${secondaryText} mt-3 text-center`}>
                    {(form.existingGallery || []).filter(
                      (img) =>
                        !form.deletedGallaryImages?.includes(img.public_id)
                    ).length + (form.galleryImages || []).length}{" "}
                    images in gallery
                  </div>
                )}
              </div>
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
                  <div className="absolute inset-0 bg-[#D5B36A]/0 group-hover:bg-[#D5B36A]/10 transition-colors duration-300"></div>
                  <FaMusic className="text-[#D5B36A] group-hover:text-[#F5E6A3] transition-colors duration-300 z-10" />
                  <span className="z-10">Select Audio</span>
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
                    </div>
                    <audio
                      controls
                      src={form.existingAudio.url}
                      className="w-full"
                    />
                  </div>
                )}
                {audioPreviewUrl && (
                  <div className="mt-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-sm">
                    <div
                      className={`text-sm font-medium ${secondaryText} mb-2 flex items-center gap-2`}
                    >
                      <FaMusic className="text-[var(--primary)]" />
                      Audio Preview
                    </div>
                    <div className="relative">
                      <audio
                        controls
                        src={audioPreviewUrl}
                        className="w-full h-10 rounded-md bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        style={{
                          filter: "hue-rotate(25deg) saturate(1.2)",
                        }}
                      />
                      <div className="absolute inset-0 pointer-events-none rounded-md bg-gradient-to-r from-[var(--primary)]/10 to-transparent opacity-50"></div>
                    </div>
                    <div
                      className={`text-xs ${secondaryText} mt-2 text-center`}
                    >
                      Preview of uploaded audio file
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    // prefer closing the whole modal when parent provided onClose
                    try {
                      resetForm();
                    } catch (e) {}
                    if (onClose) onClose();
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${textColor} hover:bg-[#D5B36A]/10`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting && <FaSpinner className="animate-spin" />}
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CONFIRMATION MODAL */}
        <ConfirmModal
          isOpen={confirmModal.open}
          title="Confirm Delete"
          message={`Are you sure you want to delete the waypoint "${confirmModal.item?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          type="danger"
        />
      </div>
    </div>
  );
};

export default TourItemsManager;
