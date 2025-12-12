import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import { userService } from "../../apis/userService";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slices/authSlice";
import {
  FaCamera,
  FaTrash,
  FaSpinner,
  FaCheck,
  FaExclamationCircle,
} from "react-icons/fa";
import api from "../../apis/axiosClient";

const ProfilePhoto = ({ user, onUpdate }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError(
        t("invalidFileType") ||
          "Please select a valid image file (JPEG, PNG, GIF, WEBP)"
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t("fileTooLarge") || "File size must be less than 5MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await api.post("/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data?.success) {
        onUpdate(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("uploadFailed") ||
          "Failed to upload avatar"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user?.avatar?.url) return;

    setUploading(true);
    setError("");

    try {
      const response = await api.delete("/user/avatar");
      if (response.data?.success) {
        onUpdate(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("deleteFailed") ||
          "Failed to delete avatar"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4 sm:text-start text-center">
        {t("profilePhoto")}
      </h3>
      <div className="flex items-center gap-6 flex-col sm:flex-row">
        <div className="relative">
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-2"
              style={{ borderColor: "var(--primary)" }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-black font-bold text-3xl border-2"
              style={{
                borderColor: "var(--primary)",
                background: "linear-gradient(to right, #C7A15C, #E2C784)",
              }}
            >
              {user?.firstName?.charAt(0) || "U"}
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <FaSpinner className="animate-spin text-white text-xl" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50"
            style={{
              background: "var(--button-bg)",
              color: "var(--text-button)",
            }}
          >
            <FaCamera />
            {t("uploadNewPhoto") || "Upload Photo"}
          </button>
          {user?.avatar?.url && (
            <button
              type="button"
              onClick={handleDeleteAvatar}
              disabled={uploading}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-md border transition duration-150 ease-in-out disabled:opacity-50"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <FaTrash />
              {t("removePhoto") || "Remove"}
            </button>
          )}
          <p
            className="text-xs text-center"
            style={{ color: "var(--text-muted)" }}
          >
            {t("photoConstraints") || "Max 5MB, JPEG/PNG/GIF/WEBP"}
          </p>
          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <FaExclamationCircle /> {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileForm = ({ user, onUpdate }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    country: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        age: user.age || "",
        phone: user.phone || "",
        country: user.country || "",
        city: user.city || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const dataToSend = {};

      // Only include non-empty fields to avoid validation errors
      if (formData.firstName?.trim())
        dataToSend.firstName = formData.firstName.trim();
      if (formData.lastName?.trim())
        dataToSend.lastName = formData.lastName.trim();
      if (formData.age) dataToSend.age = parseInt(formData.age, 10);
      if (formData.phone?.trim()) dataToSend.phone = formData.phone.trim();
      if (formData.country?.trim())
        dataToSend.country = formData.country.trim();
      if (formData.city?.trim()) dataToSend.city = formData.city.trim();

      const response = await userService.updateProfile(dataToSend);
      if (response?.success) {
        onUpdate(response.data);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("updateFailed") ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    backgroundColor: "var(--surface)",
    color: "var(--text)",
    borderColor: "var(--border)",
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4">
        {t("personalDetails") || "Personal Details"}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium mb-2"
            >
              {t("firstName")}
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={inputStyle}
              minLength={3}
              maxLength={20}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium mb-2"
            >
              {t("lastName")}
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={inputStyle}
              minLength={3}
              maxLength={20}
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium mb-2">
              {t("age")}
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={inputStyle}
              min={13}
              max={100}
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              {t("phone") || "Phone"}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+201234567890"
              className="border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-2">
              {t("country")}
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium mb-2">
              {t("city")}
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={inputStyle}
            />
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <FaExclamationCircle /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 text-green-500 text-sm">
            <FaCheck /> {t("profileUpdated") || "Profile updated successfully!"}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center gap-2"
          style={{
            background: "var(--button-bg)",
            color: "var(--text-button)",
          }}
        >
          {saving ? (
            <>
              <FaSpinner className="animate-spin" />
              {t("saving") || "Saving..."}
            </>
          ) : (
            t("saveChanges")
          )}
        </button>
      </form>
    </div>
  );
};

export default function Info() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleUserUpdate = (updatedUser) => {
    dispatch(setUser(updatedUser));
  };

  return (
    <div
      className="p-4 sm:p-6 md:p-8 rounded-2xl min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {t("personalInformation")}
      </h2>
      <div className="space-y-8">
        <ProfilePhoto user={user} onUpdate={handleUserUpdate} />
        <ProfileForm user={user} onUpdate={handleUserUpdate} />
      </div>
    </div>
  );
}
