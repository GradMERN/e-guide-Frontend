import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import userService from "../../apis/userService";
import {FaCheck,FaExclamationCircle,FaEye,FaEyeSlash,FaLock,FaSignOutAlt,FaGoogle,FaEnvelope,} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../components/common/LoadingScreen";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";

const EmailUpdate = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await userService.updateProfile({ email });
      const updatedUser = response.data || response;
      const token = localStorage.getItem("token");
      dispatch(loginSuccess({ user: updatedUser, token }));
      toast.success(t("emailUpdatedSuccessfully") || "Email updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || t("emailUpdateFailed") || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    borderColor: "var(--border)",
    backgroundColor: "var(--surface)",
    color: "var(--text)",
  };

  return (
    <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaEnvelope style={{ color: "var(--primary)" }} />
        {t("updateEmail")}
      </h3>
      <form onSubmit={handleEmailUpdate}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">{t("newEmailAddress")}</label>
          <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-(--primary)" style={inputStyle} placeholder="you@example.com" required/>
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={loading || email === user?.email} className="w-full sm:w-auto py-2 px-6 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: "var(--button-bg)", color: "var(--text-button)" }}>
            {loading ? <><LoadingScreen size={16} />{t("saving") || "Saving..."}</> : t("updateEmail")}
          </button>
        </div>
      </form>
    </div>
  );
};

const PasswordChange = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const isGoogleUser = user?.provider === "google";
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (formData.newPassword !== formData.confirmPassword) {
      setError(t("passwordsMismatch") || "Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      if (isGoogleUser && !user?.hasPassword) {
        await userService.setPassword({ newPassword: formData.newPassword });
      } else {
        await userService.changePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword });
      }
      setSuccess(true);
      toast.success(t("passwordChanged") || "Password changed successfully!");
      setIsExpanded(false);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || t("passwordChangeFailed") || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--text)" };

  return (
    <div className="p-6 rounded-lg shadow-md" style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaLock style={{ color: "var(--primary)" }} />
        {t("password")}
      </h3>
      {isGoogleUser && user?.hasPassword && (
        <div className="flex items-center gap-3 p-3 rounded-lg mb-4" style={{ backgroundColor: "var(--background)" }}>
          <FaGoogle className="text-blue-500 shrink-0" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("googleAccountWithPassword") || "Google account with password enabled"}</p>
        </div>
      )}
      {isGoogleUser && !user?.hasPassword && (
        <div className="flex items-center gap-3 p-3 rounded-lg mb-4" style={{ backgroundColor: "var(--background)" }}>
          <FaGoogle className="text-blue-500 shrink-0" />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{t("googleSetPasswordNote") || "You signed in with Google. Setting a password allows you to also login with email and password."}</p>
        </div>
      )}
      {!isExpanded ? (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div style={{ color: "var(--text-muted)" }}>
            <p className="text-sm font-medium">{t("passwordAdvice") || "Choose a strong, unique password."}</p>
            <p className="text-xs mt-1 opacity-80">{t("passwordRequirements") || "Min 12 chars, 2 uppercase, 2 lowercase, 2 numbers, 2 special chars"}</p>
          </div>
          <button type="button" onClick={() => setIsExpanded(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 rounded-md border transition-colors duration-200 hover:bg-[var(--primary)]/10 whitespace-nowrap" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>
            <FaLock />
            {isGoogleUser && !user?.hasPassword ? t("setPassword") : t("changePassword")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {(!isGoogleUser || user?.hasPassword) && (
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">{t("currentPassword")}</label>
              <div className="relative">
                <input type={showPasswords.current ? "text" : "password"} id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} required className="border w-full px-4 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" style={inputStyle} />
                <button type="button" onClick={() => togglePasswordVisibility("current")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: "var(--text-muted)" }}>{showPasswords.current ? <FaEyeSlash /> : <FaEye />}</button>
              </div>
            </div>
          )}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium mb-2">{t("newPassword")}</label>
            <div className="relative">
              <input type={showPasswords.new ? "text" : "password"} id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} required className="border w-full px-4 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" style={inputStyle} />
              <button type="button" onClick={() => togglePasswordVisibility("new")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: "var(--text-muted)" }}>{showPasswords.new ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{t("passwordRequirements") || "Min 12 chars, 2 uppercase, 2 lowercase, 2 numbers, 2 special chars"}</p>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">{t("confirmNewPassword")}</label>
            <div className="relative">
              <input type={showPasswords.confirm ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="border w-full px-4 py-2 pr-10 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" style={inputStyle} />
              <button type="button" onClick={() => togglePasswordVisibility("confirm")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: "var(--text-muted)" }}>{showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          </div>
          {error && <div className="flex items-center gap-2 text-red-500 text-sm"><FaExclamationCircle /> {error}</div>}
          {success && <div className="flex items-center gap-2 text-green-500 text-sm"><FaCheck /> {t("passwordChanged") || "Password changed successfully!"}</div>}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button type="submit" disabled={loading} className="order-1 sm:order-2 w-full sm:w-auto px-6 py-2 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50 flex items-center justify-center gap-2" style={{ background: "var(--button-bg)", color: "var(--text-button)" }}>{loading ? <><LoadingScreen size={16} />{t("saving") || "Saving..."}</> : isGoogleUser && !user?.hasPassword ? t("setPassword") : t("changePassword")}</button>
            <button type="button" onClick={() => { setIsExpanded(false); setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" }); setError(""); setSuccess(false); }} className="order-2 sm:order-1 w-full sm:w-auto px-6 py-2 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out border" style={{ backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--text)" }}>{t("cancel")}</button>
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
        toast.success(t("accountDeactivated") || "Account deactivated successfully");
        logout();
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || t("deactivateFailed") || "Failed to deactivate account");
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md border" style={{ backgroundColor: "var(--surface)", color: "var(--text)", borderColor: "rgba(239, 68, 68, 0.3)" }}>
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-500"><FaSignOutAlt />{t("deactivateAccount") || "Deactivate Account"}</h3>
      <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{t("deactivateWarning") || "This action will deactivate your account. You can reactivate it by logging in again."}</p>
      {!showConfirm ? (
        <button type="button" onClick={() => setShowConfirm(true)} className="w-full sm:w-auto py-2 px-4 rounded-md border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors">{t("deactivateAccount") || "Deactivate Account"}</button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 font-medium">{t("areYouSure") || "Are you sure?"}</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{t("deactivateConfirmMessage") || "This action will deactivate your account immediately."}</p>
          </div>
          {error && <div className="flex items-center gap-2 text-red-500 text-sm"><FaExclamationCircle /> {error}</div>}
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={handleDeactivate} disabled={deactivating} className="w-full sm:w-auto py-2 px-4 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">{deactivating ? <><LoadingScreen size={16} />{t("deactivating") || "Deactivating..."}</> : t("confirmDeactivate") || "Yes, Deactivate"}</button>
            <button type="button" onClick={() => setShowConfirm(false)} className="w-full sm:w-auto py-2 px-4 rounded-md border transition-colors hover:bg-[var(--surface)]" style={{ borderColor: "var(--border)", color: "var(--text)" }}>{t("cancel")}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Security() {
  const { t } = useTranslation();
  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-2xl min-h-screen max-w-6xl mx-auto w-full" style={{ backgroundColor: "var(--background)", color: "var(--text)" }}>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t("securitySettings")}</h2>
      <div className="space-y-8">
        <EmailUpdate />
        <PasswordChange />
        <DeactivateAccount />
      </div>
    </div>
  );
}