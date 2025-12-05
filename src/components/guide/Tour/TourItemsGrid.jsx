import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaImages } from "react-icons/fa";
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
  const navigate = useNavigate();

  const borderColor = isDarkMode ? "border-[#D5B36A]/20" : "border-gray-200";
  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const secondaryText = isDarkMode ? "text-gray-400" : "text-gray-600";

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
        <div className="grid grid-cols-4 gap-4">
          {/* add tile */}
          <div
            onClick={openCreate}
            className={`flex items-center justify-center h-44 rounded border-dashed border-2 ${borderColor} cursor-pointer`}
          >
            <div className="text-center text-3xl text-gray-400">+</div>
          </div>

          {items.map((it) => (
            <div
              key={it._id}
              className={`rounded overflow-hidden border ${borderColor} bg-white shadow-sm`}
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
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => openEdit(it)}
                    className="p-2 bg-white/80 rounded"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => openGallery(it)}
                    className="p-2 bg-white/80 rounded"
                  >
                    <FaImages />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className={`font-semibold ${textColor}`}>{it.title}</div>
                <div className={`text-sm ${secondaryText} line-clamp-2`}>
                  {it.script || it.content || "—"}
                </div>
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default TourItemsGrid;
