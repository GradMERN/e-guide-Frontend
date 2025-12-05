import React, { useEffect, useState, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { tourItemService } from "../../../apis/tourItemService";

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
  // previews for newly selected files
  galleryPreviews: [],
  mainImagePreview: null,
  audioPreview: null,
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
  const previewsRef = useRef([]);

  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const inputBg = isDarkMode ? "bg-[#2c1b0f]" : "bg-gray-50";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";
  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";

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

  // cleanup previews on unmount
  useEffect(() => {
    return () => {
      (previewsRef.current || []).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {
          // ignore
        }
      });
      previewsRef.current = [];
    };
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await tourItemService.getTourItems(tour._id || tour);
      setItems(data || []);
    } catch (err) {
      toast.error("Failed to load waypoints");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // revoke any generated previews
    (previewsRef.current || []).forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    previewsRef.current = [];
    setEditing(null);
    setForm(defaultItemForm());
    setShowForm(false);
  };

  const handleEdit = (item) => {
    // clear any previously generated previews
    (previewsRef.current || []).forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    previewsRef.current = [];
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
      galleryPreviews: [],
      mainImagePreview: null,
      audioPreview: null,
    });
    setShowForm(true);
    setFormMode("edit");
  };

  const handleOpenGallery = (item) => {
    // clear previews
    (previewsRef.current || []).forEach((u) => {
      try {
        URL.revokeObjectURL(u);
      } catch (e) {}
    });
    previewsRef.current = [];
    setEditing(item);
    setForm({
      ...defaultItemForm(),
      existingGallery: item.galleryImages || [],
      deletedGallaryImages: [],
      galleryPreviews: [],
    });
    setShowForm(true);
    setFormMode("gallery");
  };

  const handleDelete = async (item) => {
    if (!window.confirm("Delete waypoint?")) return;
    try {
      await tourItemService.deleteTourItem(tour._id || tour, item._id);
      toast.success("Waypoint deleted");
      fetchItems();
      onUpdated && onUpdated();
    } catch (err) {
      toast.error("Failed to delete waypoint");
    }
  };

  const handleFileChange = (e, key, multiple = false) => {
    const files = Array.from(e.target.files || []);
    if (multiple) {
      // create previews for each file
      const previews = files.map((f) => {
        try {
          const u = URL.createObjectURL(f);
          previewsRef.current.push(u);
          return u;
        } catch (err) {
          return null;
        }
      });
      setForm((p) => ({
        ...p,
        [key]: [...(p[key] || []), ...files],
        galleryPreviews: [...(p.galleryPreviews || []), ...previews],
      }));
    } else {
      const file = files[0] || null;
      let preview = null;
      if (file) {
        try {
          preview = URL.createObjectURL(file);
          previewsRef.current.push(preview);
        } catch (err) {
          preview = null;
        }
      }
      if (key === "mainImage") {
        setForm((p) => ({ ...p, mainImage: file, mainImagePreview: preview }));
      } else if (key === "audio") {
        setForm((p) => ({ ...p, audio: file, audioPreview: preview }));
      } else {
        setForm((p) => ({ ...p, [key]: file }));
      }
    }
  };

  const handleRemoveNewGallery = (index) => {
    setForm((p) => {
      const toRemove = p.galleryPreviews?.[index];
      if (toRemove) {
        try {
          URL.revokeObjectURL(toRemove);
        } catch (e) {}
        previewsRef.current = (previewsRef.current || []).filter(
          (u) => u !== toRemove
        );
      }
      return {
        ...p,
        galleryImages: p.galleryImages.filter((_, i) => i !== index),
        galleryPreviews: (p.galleryPreviews || []).filter(
          (_, i) => i !== index
        ),
      };
    });
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
    }
  };

  // fullPage rendering is handled earlier; default modal rendering here
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50">
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
          ) : (
            <div className="space-y-2">
              {items.map((it) => (
                <div
                  key={it._id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${borderColor}`}
                >
                  <div>
                    <div className={`font-medium ${textColor}`}>{it.title}</div>
                    <div className={`text-sm ${secondaryText}`}>
                      Type: {it.contentType}
                    </div>
                    {it.mainImage?.url && (
                      <img
                        src={it.mainImage.url}
                        alt="main"
                        className="w-36 h-20 object-cover rounded mt-2"
                      />
                    )}
                    {it.audio?.url && (
                      <div className="mt-2">
                        <audio controls src={it.audio.url} className="w-36" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(it)}
                      className="p-2 rounded hover:bg-blue-500/10"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(it)}
                      className="p-2 rounded hover:bg-red-500/10 text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
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
              <div className="grid grid-cols-2 gap-3">
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
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-1`}
                >
                  Script (optional)
                </label>
                <textarea
                  value={form.script}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, script: e.target.value }))
                  }
                  className={`w-full px-3 py-2 rounded-lg border ${borderColor} ${inputBg} ${textColor}`}
                  rows={3}
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "mainImage", false)}
                />
                {form.mainImagePreview ? (
                  <div className="mt-2">
                    <div className={`text-xs ${secondaryText} mb-1`}>
                      New main image
                    </div>
                    <img
                      src={form.mainImagePreview}
                      alt="preview"
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
                  className={`block text-sm font-medium ${secondaryText} mb-1`}
                >
                  Gallery Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileChange(e, "galleryImages", true)}
                />
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {(form.existingGallery || [])
                    .filter(
                      (img) =>
                        !form.deletedGallaryImages?.includes(img.public_id)
                    )
                    .map((img) => (
                      <div key={img.public_id} className="relative">
                        <img
                          src={img.url}
                          alt={img.public_id}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOldGallery(img.public_id)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <FaTimes size={12} />
                        </button>
                      </div>
                    ))}
                  {(form.galleryImages || []).map((f, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={form.galleryPreviews?.[idx]}
                        alt={f.name}
                        className="w-full h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewGallery(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${secondaryText} mb-1`}
                >
                  Audio
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileChange(e, "audio", false)}
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
                {form.audio && (
                  <div className="mt-2">
                    <div className={`text-xs ${secondaryText} mb-1`}>
                      New audio preview
                    </div>
                    <audio
                      controls
                      src={form.audioPreview}
                      className="w-full"
                    />
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
                  className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg"
                >
                  {editing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourItemsManager;
