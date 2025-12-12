import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import { userService } from "../../apis/userService";
import {
  FaSpinner,
  FaCheck,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaSignOutAlt,
  FaGoogle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PasswordChange = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Check if user logged in via Google
  const isGoogleUser = user?.loginMethod === "google";
  // Google users can set a password if they don't have one yet
  // hasPassword is explicitly returned from the backend
  const canSetPassword = isGoogleUser && user?.hasPassword === false;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 12)
      errors.push(t("passwordMinLength") || "At least 12 characters");
    if (!/(.*[a-z]){2,}/.test(password))
      errors.push(t("passwordLowercase") || "At least 2 lowercase letters");
    if (!/(.*[A-Z]){2,}/.test(password))
      errors.push(t("passwordUppercase") || "At least 2 uppercase letters");
    if (!/(.*[0-9]){2,}/.test(password))
      errors.push(t("passwordNumbers") || "At least 2 numbers");
    if (!/(.*[!@#$%^&*(),.?":{}|<>]){2,}/.test(password))
      errors.push(t("passwordSpecialChars") || "At least 2 special characters");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t("passwordsMismatch") || "Passwords do not match");
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(", "));
      return;
    }

    setSaving(true);

    try {
      let response;

      if (canSetPassword) {
        // Google user setting password for the first time
        response = await userService.setPassword({
          newPassword: formData.newPassword,
        });

        // Update user state to reflect they now have a password
        if (response?.success && setUser) {
          setUser({ ...user, hasPassword: true });
        }
      } else {
        // Regular password change
        response = await userService.changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        });
      }

      if (response?.success) {
        setSuccess(true);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setIsExpanded(false);
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("passwordChangeFailed") ||
          "Failed to change password"
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

  // Google user who already has a password - show that they need to use change password
  if (isGoogleUser && user?.hasPassword) {
    // They already set a password, show normal change password form
    // Fall through to the normal form below
  } else if (isGoogleUser && !canSetPassword && !user?.hasPassword) {
    // Edge case: We don't know if they have a password - show the set password option
  }

  // Google user who CAN set a password (doesn't have one yet)
  if (canSetPassword) {
    return (
      <div
        className="p-6 rounded-lg shadow-md"
        style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
      >
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FaLock style={{ color: "var(--primary)" }} />
          {t("setPassword") || "Set Password"}
        </h3>

        {/* Info about Google account */}
        <div
          className="flex items-center gap-3 p-4 rounded-lg mb-4"
          style={{ backgroundColor: "var(--background)" }}
        >
          <FaGoogle className="text-blue-500" />
          <p style={{ color: "var(--text-muted)" }}>
            {t("googleSetPasswordNote") ||
              "You signed in with Google. Setting a password allows you to also login with email and password."}
          </p>
        </div>

        {!isExpanded ? (
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 py-2 px-4 rounded-md border transition-colors duration-200"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            <FaLock />
            {t("setPassword") || "Set Password"}
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-2"
              >
                {t("newPassword")}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="border w-full px-4 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {t("passwordRequirements") ||
                  "Min 12 chars, 2 uppercase, 2 lowercase, 2 numbers, 2 special chars"}
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                {t("confirmNewPassword")}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="border w-full px-4 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <FaExclamationCircle /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <FaCheck />{" "}
                {t("passwordSet") ||
                  "Password set successfully! You can now login with email and password."}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center gap-2"
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
                  t("setPassword") || "Set Password"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                  setError("");
                }}
                className="flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text-button)",
                }}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaLock style={{ color: "var(--primary)" }} />
        {t("password")}
      </h3>

      {/* Show Google badge if user logged in with Google but has a password */}
      {isGoogleUser && user?.hasPassword && (
        <div
          className="flex items-center gap-3 p-3 rounded-lg mb-4"
          style={{ backgroundColor: "var(--background)" }}
        >
          <FaGoogle className="text-blue-500" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {t("googleAccountWithPassword") ||
              "Google account with password enabled"}
          </p>
        </div>
      )}

      {!isExpanded ? (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div style={{ color: "var(--text-muted)" }}>
            <p className="text-sm">
              {t("passwordAdvice") || "Use a strong, unique password"}
            </p>
            <p className="text-xs mt-1">
              {t("passwordLastChanged") ||
                "Change your password regularly for security"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 py-2 px-4 rounded-md border transition-colors duration-200"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
          >
            <FaLock />
            {t("changePassword")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium mb-2"
            >
              {t("currentPassword")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
                className="border w-full px-4 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium mb-2"
            >
              {t("newPassword")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="border w-full px-4 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              {t("passwordRequirements") ||
                "Min 12 chars, 2 uppercase, 2 lowercase, 2 numbers"}
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-2"
            >
              {t("confirmNewPassword")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="border w-full px-4 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-muted)" }}
              >
                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <FaExclamationCircle /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-green-500 text-sm">
              <FaCheck />{" "}
              {t("passwordChanged") || "Password changed successfully!"}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center gap-2"
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
                t("changePassword")
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setFormData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setError("");
              }}
              className="flex-1 py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
              style={{
                backgroundColor: "var(--secondary)",
                color: "var(--text-button)",
              }}
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const DeactivateAccount = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [error, setError] = useState("");

  const handleDeactivate = async () => {
    setDeactivating(true);
    setError("");

    try {
      const response = await userService.deactivateAccount();
      if (response?.success) {
        logout();
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("deactivateFailed") ||
          "Failed to deactivate account"
      );
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md border"
      style={{
        backgroundColor: "var(--surface)",
        color: "var(--text)",
        borderColor: "rgba(239, 68, 68, 0.3)",
      }}
    >
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-500">
        <FaSignOutAlt />
        {t("deactivateAccount") || "Deactivate Account"}
      </h3>

      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
        {t("deactivateWarning") ||
          "Deactivating your account will disable your profile and remove you from the platform. You can reactivate by clicking the link sent to your email."}
      </p>

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="py-2 px-4 rounded-md border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
        >
          {t("deactivateAccount") || "Deactivate Account"}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 font-medium">
              {t("areYouSure") || "Are you sure?"}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              {t("deactivateConfirmMessage") ||
                "This action will deactivate your account immediately."}
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <FaExclamationCircle /> {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={deactivating}
              className="py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {deactivating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {t("deactivating") || "Deactivating..."}
                </>
              ) : (
                t("confirmDeactivate") || "Yes, Deactivate"
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="py-2 px-4 rounded-md border transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text)" }}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Security() {
  const { t } = useTranslation();

  return (
    <div
      className="p-4 sm:p-6 md:p-8 rounded-2xl min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {t("securitySettings")}
      </h2>
      <div className="space-y-8">
        <PasswordChange />
        <DeactivateAccount />
      </div>
    </div>
  );
}
