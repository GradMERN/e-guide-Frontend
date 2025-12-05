import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

const UpdateGalleryModal = ({
  images = [],
  onClose,
  onSave,
  onRemoveImage,
  onAddImage,
  isDarkMode,
}) => {
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const previewsRef = useRef([]);

  useEffect(() => {
    return () => {
      (previewsRef.current || []).forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch (e) {}
      });
      previewsRef.current = [];
    };
  }, []);
  const [deletedIds, setDeletedIds] = useState([]);

  const handleRemove = (img) => {
    setDeletedIds((prev) => [...prev, img.public_id]);
    onRemoveImage && onRemoveImage(img.public_id);
  };

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((f) => {
      try {
        const u = URL.createObjectURL(f);
        previewsRef.current.push(u);
        return u;
      } catch (err) {
        return null;
      }
    });
    setNewImages((prev) => [...prev, ...files]);
    setNewPreviews((prev) => [...prev, ...previews]);
    onAddImage && onAddImage(files);
  };

  const handleSave = () => {
    onSave(newImages, deletedIds);
  };

  const cardBg = isDarkMode ? "bg-[#1B1A17]" : "bg-white";
  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";

  // Filter out deleted images
  const visibleOldImages = images.filter(
    (img) => !deletedIds.includes(img.public_id)
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div
        className={`${cardBg} rounded-xl border ${borderColor} p-6 max-w-lg w-full`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-bold ${textColor}`}>
            Update Gallery Images
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#D5B36A]/20 rounded-lg transition"
          >
            <FaTimes className={textColor} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Show only non-deleted old images */}
          {visibleOldImages.map((img) => (
            <div key={img.public_id} className="relative group">
              <img
                src={img.url}
                alt="Gallery"
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 group-hover:opacity-100"
                onClick={() => handleRemove(img)}
                title="Remove"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ))}
          {/* Show new images */}
          {newImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={newPreviews?.[idx]}
                alt="New"
                className="w-full h-24 object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 group-hover:opacity-100"
                onClick={() => {
                  const toRemove = newPreviews?.[idx];
                  if (toRemove) {
                    try {
                      URL.revokeObjectURL(toRemove);
                    } catch (e) {}
                    previewsRef.current = (previewsRef.current || []).filter(
                      (u) => u !== toRemove
                    );
                  }
                  setNewImages((prev) => prev.filter((_, i) => i !== idx));
                  setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
                }}
                title="Remove"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ))}
          {/* Add new image box */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer h-24">
            <FaPlus size={20} className="text-[#D5B36A]" />
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleAddImages}
            />
          </label>
        </div>
        <div className="flex gap-3 pt-2 flex-wrap">
          <button
            type="button"
            onClick={onClose}
            className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} ${textColor} hover:bg-[#D5B36A]/10 transition-all font-medium`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-[#D5B36A] text-black rounded-lg hover:bg-[#E2C784] transition-all font-medium"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateGalleryModal;
