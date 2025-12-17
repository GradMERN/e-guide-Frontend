import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";
import userService from "../../apis/userService";
import { toast } from "react-toastify";
import { useAuth as useAuthContext } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";

const EmailUpdate = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { updateUser } = useAuthContext();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Assuming updateProfile handles email update
      const updatedUser = await userService.updateProfile({ email });

      updateUser(updatedUser.data || updatedUser);
      const token = localStorage.getItem("token");
      dispatch(loginSuccess({ user: updatedUser.data || updatedUser, token }));

      toast.success(
        t("emailUpdatedSuccessfully") || "Email updated successfully"
      );
    } catch (error) {
      console.error("Failed to update email:", error);
      toast.error(error.response?.data?.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4">{t("updateEmail")}</h3>
      <form onSubmit={handleEmailUpdate}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium  mb-2">
            {t("newEmailAddress")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
            placeholder="you@example.com"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full border-2 py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50"
          style={{
            background: "var(--button-bg)",
            color: "var(--text-button)",
          }}
        >
          {loading ? "Updating..." : t("updateEmail")}
        </button>
      </form>
    </div>
  );
};

const PasswordChange = () => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error(t("passwordsDoNotMatch") || "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await userService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      toast.success(
        t("passwordChangedSuccessfully") || "Password changed successfully"
      );
      setIsCollapsed(true);
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4">{t("password")}</h3>

      {isCollapsed ? (
        <div className="flex justify-between items-center">
          <div
            className=" text-sm hidden sm:block"
            style={{ color: "var(--text-muted)" }}
          >
            <p>{t("lastChanged")}</p>
            <p>{t("passwordAdvice")}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="flex sm:w-auto w-full justify-center items-center border-2 p-3 rounded-md text-sm font-semibold transition-colors duration-200"
            style={{ borderColor: "var(--border)", color: "var(--primary)" }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12.3212 10.6852L4 19L6 21M7 16L9 18M20 7.5C20 9.98528 17.9853 12 15.5 12C13.0147 12 11 9.98528 11 7.5C11 5.01472 13.0147 3 15.5 3C17.9853 3 20 5.01472 20 7.5Z"
              ></path>
            </svg>
            <span>{t("changePassword")}</span>
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium mb-2"
              >
                {t("currentPassword")}
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleChange}
                className="w-full border-2 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text)",
                  "--tw-ring-color": "var(--primary)",
                }}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-2"
              >
                {t("newPassword")}
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full border-2 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text)",
                  "--tw-ring-color": "var(--primary)",
                }}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                {t("confirmNewPassword")}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full border-2 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text)",
                  "--tw-ring-color": "var(--primary)",
                }}
                required
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50"
                style={{
                  background: "var(--button-bg)",
                  color: "var(--text-button)",
                }}
              >
                {loading ? "Changing..." : t("changePassword")}
              </button>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--text-button)",
                }}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        </>
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
      <div className="space-y-8 text-white-500">
        <EmailUpdate />
        <PasswordChange />
      </div>
    </div>
  );
}