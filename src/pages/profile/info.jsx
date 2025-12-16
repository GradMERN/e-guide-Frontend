import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
<<<<<<< HEAD
import { useAuth as useAuthContext } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import userService from "../../apis/userService";
import { toast } from "react-toastify";
import { getImageUrl } from "../../utils/imageUtils";

const countryCities = {
  USA: ["New York", "Los Angeles", "Chicago", "Houston"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  Egypt: ["Cairo", "Alexandria", "Giza", "Luxor"],
  UK: ["London", "Manchester", "Birmingham", "Liverpool"],
};
=======
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
>>>>>>> origin/main

const ProfilePhoto = ({ user, onUpdate }) => {
  const { t } = useTranslation();
<<<<<<< HEAD
  const { user, updateUser } = useAuthContext();
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size (e.g., max 5MB, images only)
    if (!file.type.startsWith("image/")) {
      toast.error(t("invalidFileType") || "Please upload an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("fileTooLarge") || "File size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const response = await userService.uploadProfilePicture(formData);

      // Update user in context and redux
      // Assuming response.data contains the updated user object or the avatar url
      // Adjust based on actual API response structure.
      // If response is the user object:
      const updatedUser = response.data || response;

      updateUser(updatedUser);
      const token = localStorage.getItem("token");
      dispatch(loginSuccess({ user: updatedUser, token }));

      toast.success(
        t("photoUpdatedSuccessfully") || "Profile photo updated successfully"
      );
    } catch (error) {
      console.error("Failed to upload photo:", error);
      toast.error(error.response?.data?.message || "Failed to upload photo");
=======
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
>>>>>>> origin/main
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
<<<<<<< HEAD
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-black font-bold text-3xl border-2 overflow-hidden"
            style={{
              borderColor: "var(--primary)",
              background: getImageUrl(user?.avatar)
                ? "transparent"
                : "linear-gradient(to right, #C7A15C, #E2C784)",
            }}
          >
            {getImageUrl(user?.avatar) ? (
              <img
                src={getImageUrl(user.avatar)}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150?text=Error"; // Fallback
                }}
              />
            ) : (
              user?.firstName?.charAt(0) || "U"
            )}
          </div>
          {/* Edit Icon Overlay */}
          <label
            htmlFor="photo-upload"
            className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-1 cursor-pointer hover:bg-gray-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              style={{ color: "white" }}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </label>
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        <div>
          <label
            htmlFor="photo-upload"
            className={`py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out cursor-pointer inline-block ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
=======
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
>>>>>>> origin/main
            style={{
              background: "var(--button-bg)",
              color: "var(--text-button)",
            }}
          >
<<<<<<< HEAD
            {uploading ? "Uploading..." : t("uploadNewPhoto")}
          </label>
=======
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
>>>>>>> origin/main
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

<<<<<<< HEAD
const BasicDetails = ({ formData, handleChange }) => {
  const { t } = useTranslation();
=======
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
>>>>>>> origin/main

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
<<<<<<< HEAD
      <h3 className="text-xl font-semibold mb-4">{t("basicDetails")}</h3>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            {t("firstName")}
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName || ""}
            onChange={handleChange}
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            {t("lastName")}
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
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
            value={formData.age || ""}
            onChange={handleChange}
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            {t("number")}
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
          />
=======
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
>>>>>>> origin/main
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

<<<<<<< HEAD
const LocationInfo = ({ formData, handleChange }) => {
  const { t } = useTranslation();
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (formData.country) {
      setAvailableCities(countryCities[formData.country] || []);
    }
  }, [formData.country]);

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4">{t("locationInformation")}</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-2">
            {t("country")}
          </label>
          <select
            id="country"
            name="country"
            value={formData.country || ""}
            onChange={handleChange}
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
          >
            <option
              value=""
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("selectCountry")}
            </option>
            {Object.keys(countryCities).map((c) => (
              <option
                key={c}
                value={c}
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--text)",
                }}
              >
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-2">
            {t("city")}
          </label>
          <select
            id="city"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
            disabled={!formData.country}
          >
            <option
              value=""
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("selectCity")}
            </option>
            {availableCities.map((c) => (
              <option
                key={c}
                value={c}
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--text)",
                }}
              >
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

function Address({ formData, handleChange }) {
  return (
    <div className="space-y-8">
      <LocationInfo formData={formData} handleChange={handleChange} />
    </div>
  );
}

export default function Info() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthContext();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    phone: "",
    country: "",
    city: "",
  });

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
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "country") {
        newData.city = ""; // Reset city when country changes
      }
      return newData;
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(formData);

      // Update AuthContext
      updateUser(updatedUser.data || updatedUser);

      // Update Redux Store
      // Assuming we have the token stored or we can get it
      const token = localStorage.getItem("token");
      dispatch(loginSuccess({ user: updatedUser.data || updatedUser, token }));

      toast.success(
        t("profileUpdatedSuccessfully") || "Profile updated successfully"
      );
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
=======
export default function Info() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const dispatch = useDispatch();

  const handleUserUpdate = (updatedUser) => {
    dispatch(setUser(updatedUser));
>>>>>>> origin/main
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
<<<<<<< HEAD
        <ProfilePhoto user={user} />
        <BasicDetails formData={formData} handleChange={handleChange} />
        <Address formData={formData} handleChange={handleChange} />
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "var(--button-bg)",
            color: "var(--text-button)",
          }}
        >
          {loading ? "Saving..." : t("saveChanges")}
        </button>
=======
        <ProfilePhoto user={user} onUpdate={handleUserUpdate} />
        <ProfileForm user={user} onUpdate={handleUserUpdate} />
>>>>>>> origin/main
      </div>
    </div>
  );
}
