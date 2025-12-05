import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TourItemsManager from "./TourItemsManager";
import { tourItemService } from "../../../apis/tourItemService";

const TourItemsGrid = ({ tour, isDarkMode }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditing, setModalEditing] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    item: null,
    action: null,
  });
  const navigate = useNavigate();

  const borderColor = "border-[var(--border)]";
  const cardBg = "bg-[var(--surface)]";
  const textColor = "text-[var(--text)]";
  const secondaryText = "text-[var(--text-secondary)]";
  const hoverBg = "hover:bg-[var(--glass-bg-hover)]";

  useEffect(() => {
    if (!tour) return;
    fetchItems();
  }, [tour]);

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

  const openCreate = () => {
    setModalEditing(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setModalEditing(item);
    setModalMode("edit");
    setModalOpen(true);
  };

  const openGallery = (item) => {
    setModalEditing(item);
    setModalMode("gallery");
    setModalOpen(true);
  };

  const handleDelete = (item) => {
    setConfirmModal({ open: true, item, action: "delete" });
  };

  const confirmDelete = async () => {
    const item = confirmModal.item;
    setConfirmModal({ open: false, item: null, action: null });
    try {
      await tourItemService.deleteTourItem(tour._id || tour, item._id);
      toast.success("Waypoint deleted");
      fetchItems();
    } catch (err) {
      toast.error("Failed to delete waypoint");
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ open: false, item: null, action: null });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          {/* <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 bg-[#D5B36A] rounded text-black"
          >
            Back
          </button> */}
        </div>
        {/* <div>
          <button
            onClick={openCreate}
            className="px-3 py-2 bg-[#D5B36A] rounded text-black"
          >
            <FaPlus /> Add
          </button>
        </div> */}
      </div>

      {loading ? (
        <div className={`p-4 ${secondaryText}`}>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <div
              key={it._id}
              className={`rounded-lg overflow-hidden border ${borderColor} ${cardBg} shadow-md hover:shadow-xl transition-all duration-300 ${hoverBg} cursor-pointer group`}
            >
              <div className="relative h-40 w-full bg-gray-100">
                {it.mainImage?.url ? (
                  <img
                    src={it.mainImage.url}
                    alt={it.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    No image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(it);
                      }}
                      className="p-3 bg-[#D5B36A] text-black rounded-full hover:bg-[#C4A55A] transition-colors duration-200 shadow-lg"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(it);
                      }}
                      className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className={`font-semibold ${textColor} mb-2`}>
                  {it.title}
                </div>
                <div
                  className={`text-sm ${secondaryText} line-clamp-2 leading-relaxed`}
                >
                  {it.script || it.content || "—"}
                </div>
              </div>
            </div>
          ))}

          {/* add tile */}
          <div
            onClick={openCreate}
            className={`flex flex-col items-center justify-center h-44 rounded-lg border-dashed border-2 ${borderColor} ${cardBg} cursor-pointer hover:shadow-lg transition-all duration-300 ${hoverBg} group`}
          >
            <div className="text-4xl text-gray-400 group-hover:text-[#D5B36A] transition-colors duration-300 mb-2">
              <FaPlus />
            </div>
            <div
              className={`text-sm font-medium ${secondaryText} group-hover:${textColor} transition-colors duration-300`}
            >
              Add Waypoint
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <TourItemsManager
          tour={tour}
          isDarkMode={isDarkMode}
          open={modalOpen}
          initialEditing={modalEditing}
          initialFormMode={modalMode}
          onClose={() => setModalOpen(false)}
          onUpdated={() => fetchItems()}
        />
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#1a0f08] to-[#2c1810] border border-[var(--border)] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-[var(--text)] mb-4">
              Confirm Delete
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete the waypoint "
              {confirmModal.item?.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-[var(--secondary)] text-[var(--text)] rounded-lg hover:bg-[var(--secondary-hover)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourItemsGrid;
