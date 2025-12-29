import { useState, useRef, useEffect } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

const UpdateGalleryModal = ({images = [],onClose,onSave,onRemoveImage,onAddImage,isDarkMode,}) => {
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const previewsRef = useRef([]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
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

  const cardBg = "bg-[var(--surface)]";
  const borderColor = "border-[var(--border)]";
  const textColor = "text-[var(--text)]";

  const visibleOldImages = images.filter(
    (img) => !deletedIds.includes(img.public_id)
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-4 overflow-hidden animate-fadeIn">
      <div className={`${cardBg} rounded-2xl border ${borderColor} shadow-2xl p-4 md:p-6 lg:p-8 max-w-sm md:max-w-2xl lg:max-w-4xl w-full my-4 animate-slideUp custom-scrollbar overflow-y-auto`} style={{ maxHeight: 'calc(100vh - 2rem)'}}>
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h3 className={`text-lg md:text-2xl font-bold ${textColor} mb-1`}>
              Update Gallery Images
            </h3>
            <p className={`text-xs md:text-sm text-(--text-secondary)`}>
              Add or remove images from your gallery
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#D5B36A]/20 rounded-lg transition shrink-0" aria-label="Close modal">
            <FaTimes className={`${textColor} text-lg md:text-xl`} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          {visibleOldImages.map((img) => (
            <div key={img.public_id} className="relative group aspect-square">
              <img src={img.url} alt="Gallery" className="w-full h-full object-cover rounded-lg shadow-md"/>
              <button type="button" className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 md:p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600" onClick={() => handleRemove(img)} title="Remove image" aria-label="Remove image">
                <FaTimes size={12} className="md:w-4 md:h-4" />
              </button>
            </div>
          ))}

          {newImages.map((img, idx) => (
            <div key={idx} className="relative group aspect-square">
              <img src={newPreviews?.[idx]} alt="New" className="w-full h-full object-cover rounded-lg shadow-md border-2 border-[#D5B36A]/50"/>
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-md">
                New
              </div>
              <button type="button" className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 md:p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
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
                title="Remove new image" aria-label="Remove new image">
                <FaTimes size={12} className="md:w-4 md:h-4" />
              </button>
            </div>
          ))}

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-(--border) hover:border-[#D5B36A] rounded-lg cursor-pointer aspect-square transition-all hover:bg-[#D5B36A]/5 group">
            <FaPlus size={20} className="text-[#D5B36A] mb-2 group-hover:scale-110 transition-transform md:w-6 md:h-6" />
            <span className="text-xs md:text-sm font-medium text-(--text-secondary) group-hover:text-[#D5B36A]">
              Add Images
            </span>
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleAddImages} aria-label="Upload images"/>
          </label>
        </div>

        {(visibleOldImages.length > 0 || newImages.length > 0) && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs md:text-sm text-(--text-secondary)">
              📸 <strong>{visibleOldImages.length + newImages.length}</strong> image(s) in gallery
              {newImages.length > 0 && (
                <span className="text-green-500 ml-1">
                  • <strong>{newImages.length}</strong> new
                </span>
              )}
              {deletedIds.length > 0 && (
                <span className="text-red-500 ml-1">
                  • <strong>{deletedIds.length}</strong> will be removed
                </span>
              )}
            </p>
          </div>
        )}

        <div className={`flex flex-col sm:flex-row gap-3 pt-4 md:pt-6 border-t ${borderColor}`}>
          <button type="button" onClick={onClose} className={`flex-1 px-4 md:px-6 py-2.5 md:py-3 rounded-lg border-2 ${borderColor} ${textColor} hover:bg-[#D5B36A]/10 transition-all font-semibold text-sm md:text-base`}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-linear-to-r from-[#C7A15C] to-[#E2C784] text-black rounded-lg hover:from-[#D5B36A] hover:to-[#F0D9A0] transition-all font-semibold text-sm md:text-base shadow-lg shadow-[#C7A15C]/30">
            Save Changes
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px); 
          }
          to { 
            opacity: 1;
            transform: translateY(0); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#2c1b0f' : '#f3f4f6'};
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D5B36A;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C7A15C;
        }
      `}</style>
    </div>
  );
};

export default UpdateGalleryModal;