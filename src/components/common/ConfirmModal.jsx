import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "danger", // danger, warning, info
  icon = null,
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          button: "bg-red-600 hover:bg-red-700 text-white",
          icon: <FaExclamationTriangle className="text-red-500" />,
        };
      case "warning":
        return {
          button: "bg-yellow-600 hover:bg-yellow-700 text-white",
          icon: <FaExclamationTriangle className="text-yellow-500" />,
        };
      case "info":
        return {
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          icon: null,
        };
      default:
        return {
          button: "bg-red-600 hover:bg-red-700 text-white",
          icon: <FaExclamationTriangle className="text-red-500" />,
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          {icon || styles.icon}
          <h3 className="text-xl font-bold text-[var(--text)]">{title}</h3>
        </div>
        <p className="text-[var(--text-secondary)] mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-[var(--secondary)] text-[var(--text)] rounded-lg hover:bg-[var(--secondary-hover)] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors ${styles.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
