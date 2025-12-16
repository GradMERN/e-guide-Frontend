import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TourItemsManager from "./TourItemsManager";
import { tourItemService } from "../../../apis/tourItemService";
import ConfirmModal from "../../common/ConfirmModal";

const TourItemsGrid = ({ tour, isDarkMode }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditing, setModalEditing] = useState(null);
  const [modalMode, setModalMode] = useState("create");
  const [confirmModal, setConfirmModal] = useState({ open: false, item: null });
  const [visualizedItemIds, setVisualizedItemIds] = useState([]);
  const [publishingIds, setPublishingIds] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const navigate = useNavigate();

  const borderColor = "border-[var(--border)]";
  const cardBg = "bg-[var(--surface)]";
  const textColor = "text-[var(--text)]";
  const secondaryText = "text-[var(--text-secondary)]";
  const hoverBg = "hover:bg-[var(--glass-bg-hover)]";

  const isItemPopulated = (it) => {
    if (!it) return false;
    if (Object.prototype.hasOwnProperty.call(it, "isPublished"))
      return !!it.isPublished;
    return Boolean(
      (it.script && it.script.length > 0) ||
        (it.content && it.content.length > 0) ||
        (it.mainImage && it.mainImage.url) ||
        (it.location && (it.location.lat || it.location.lng)) ||
        it.title
    );
  };

  useEffect(() => {
    if (!tour) return;
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tour]);

  const fetchItems = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await tourItemService.getTourItems(tour._id || tour);
      setItems(data || []);
    } catch (err) {
      if (!silent)
        toast.error(
          t("guide.tourItems.loadFailed") || "Failed to load waypoints"
        );
    } finally {
      if (!silent) setLoading(false);
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

  const handleDelete = (item) => setConfirmModal({ open: true, item });

  const confirmDelete = async () => {
    const item = confirmModal.item;
    setConfirmModal({ open: false, item: null });
    try {
      setDeletingIds((p) => [...p, item._id]);
      await tourItemService.deleteTourItem(tour._id || tour, item._id);
      toast.success(t("guide.tourItems.deleted") || "Waypoint deleted");
      // refresh silently to avoid flicker
      await fetchItems(true);
    } catch (err) {
      toast.error(
        t("guide.tourItems.deleteFailed") || "Failed to delete waypoint"
      );
    } finally {
      setDeletingIds((p) => p.filter((id) => id !== item._id));
    }
  };

  const cancelDelete = () => setConfirmModal({ open: false, item: null });

  const toggleVisualizedItem = (id) => {
    setVisualizedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleItemPublished = async (item) => {
    const tourId = tour._id || tour;
    setPublishingIds((prev) => [...prev, item._id]);
    try {
      const updated = await tourItemService.publishTourItem(tourId, item._id, {
        isPublished: !item.isPublished,
      });
      toast.success(
        updated.isPublished
          ? t("guide.tours.states.published") || "Published"
          : t("guide.tours.states.notPublished") || "Unpublished"
      );
      // refresh silently (keep showing old data until new arrives)
      await fetchItems(true);
    } catch (err) {
      console.error("Failed to toggle publish state", err);
      const serverMessage =
        err?.response?.data?.message ||
        err.message ||
        "Failed to change publish state";
      toast.error(serverMessage);
    } finally {
      setPublishingIds((prev) => prev.filter((id) => id !== item._id));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div />
      </div>

      {loading ? (
        <div className={`p-4 ${secondaryText}`}>
          {t("common.loading") || "Loading..."}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((it) => {
            const populated = isItemPopulated(it);
            const active = visualizedItemIds.includes(it._id);
            return (
              <div
                key={it._id}
                className={`rounded-lg overflow-hidden border ${borderColor} ${cardBg} shadow-md hover:shadow-xl transition-all duration-300 ${hoverBg} cursor-pointer group relative`}
              >
                <div className="relative h-40 w-full bg-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (publishingIds.includes(it._id)) return;
                      toggleItemPublished(it);
                    }}
                    disabled={publishingIds.includes(it._id)}
                    className={`absolute right-3 top-3 z-20 p-2 rounded-md transition-colors duration-150 ${
                      it.isPublished
                        ? "bg-green-600 text-white"
                        : "bg-white text-[#333]"
                    } shadow-lg ${
                      publishingIds.includes(it._id)
                        ? "opacity-80 cursor-wait"
                        : ""
                    }`}
                    title={
                      publishingIds.includes(it._id)
                        ? t("guide.tours.titles.updating") || "Publishing..."
                        : it.isPublished
                        ? t("guide.tours.titles.unpublish") ||
                          "Unpublish waypoint"
                        : t("guide.tours.titles.publish") || "Publish waypoint"
                    }
                  >
                    {publishingIds.includes(it._id) ? (
                      <FaSpinner
                        size={14}
                        className={`animate-spin ${
                          it.isPublished ? "text-white" : "text-[#333]"
                        }`}
                      />
                    ) : it.isPublished ? (
                      <FaEye size={14} />
                    ) : (
                      <FaEyeSlash size={14} />
                    )}
                  </button>

                  {it.mainImage?.url ? (
                    <img
                      src={it.mainImage.url}
                      alt={it.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      {t("guide.noImage") || "No image"}
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
                          if (deletingIds.includes(it._id)) return;
                          handleDelete(it);
                        }}
                        disabled={deletingIds.includes(it._id)}
                        className={`p-3 rounded-full transition-colors duration-200 shadow-lg ${
                          deletingIds.includes(it._id)
                            ? "bg-red-400 text-white cursor-wait"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                        title={
                          deletingIds.includes(it._id)
                            ? t("guide.tourItems.updating") || "Deleting..."
                            : t("guide.tours.delete") || "Delete"
                        }
                      >
                        {deletingIds.includes(it._id) ? (
                          <FaSpinner size={16} className="animate-spin" />
                        ) : (
                          <FaTrash size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className={`font-semibold ${textColor} mb-2`}>
                    <div className="flex items-center gap-3">
                      <span>{it.title}</span>
                      {(() => {
                        const hasPublished = !!it.isPublished;
                        const hasContent = Boolean(
                          (it.script && it.script.length > 0) ||
                            (it.content && it.content.length > 0) ||
                            (it.mainImage && it.mainImage.url) ||
                            (it.location &&
                              (it.location.lat || it.location.lng)) ||
                            it.title
                        );
                        const label = hasPublished
                          ? t("guide.tours.states.published") || "Published"
                          : hasContent
                          ? t("guide.tours.states.notPublished") ||
                            "Not Published"
                          : t("guide.tours.states.empty") || "Empty";
                        const cls = hasPublished
                          ? "bg-green-600 text-white"
                          : hasContent
                          ? "bg-yellow-500 text-black"
                          : "bg-red-600 text-white";
                        return (
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${cls}`}
                          >
                            {label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div
                    className={`text-sm ${secondaryText} line-clamp-2 leading-relaxed`}
                  >
                    {it.script || it.content || "—"}
                  </div>
                </div>
              </div>
            );
          })}

          <div
            onClick={openCreate}
            className={`rounded-lg overflow-hidden border ${borderColor} ${cardBg} shadow-md hover:shadow-xl transition-all duration-300 ${hoverBg} cursor-pointer group relative`}
          >
            <div className="relative h-40 w-full flex items-center justify-center bg-gray-100">
              <div className="text-4xl text-gray-400 group-hover:text-[#D5B36A] transition-colors duration-300">
                <FaPlus />
              </div>
            </div>
            <div className="p-4 flex items-center justify-center">
              <div
                className={`text-sm font-medium ${secondaryText} group-hover:${textColor} transition-colors duration-300`}
              >
                {t("guide.tours.addItem") || "Add Waypoint"}
              </div>
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

      {confirmModal.open && (
        <ConfirmModal
          isOpen={confirmModal.open}
          title={t("guide.tours.confirmDelete") || "Confirm Deletion"}
          message={
            t("guide.tourItems.confirmDelete") ||
            "Are you sure you want to delete this waypoint?"
          }
          confirmText={t("guide.tours.delete") || "Delete"}
          cancelText={t("common.cancel") || "Cancel"}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          type="danger"
        />
      )}
    </div>
  );
};

export default TourItemsGrid;
