import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth as useAuthContext } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import userService from "../../apis/userService";
import { toast } from "react-toastify";

const TravelPreferences = ({ preferences, handleChange }) => {
  const { t } = useTranslation();
  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4">{t("travelPreferences")}</h3>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="travelStyle"
            className="block text-sm font-medium mb-2"
          >
            {t("preferredTravelStyle")}
          </label>
          <select
            id="travelStyle"
            name="travelStyle"
            value={preferences.travelStyle || ""}
            onChange={handleChange}
            className="w-full border-2 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
          >
            <option value="" disabled>
              Select style
            </option>
            <option
              value="Adventure"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("adventure")}
            </option>
            <option
              value="Relaxation"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("relaxation")}
            </option>
            <option
              value="Cultural"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("cultural")}
            </option>
            <option
              value="Family"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("family")}
            </option>
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium mb-2">
            {t("preferredLanguage")}
          </label>
          <select
            id="language"
            name="language"
            value={preferences.language || ""}
            onChange={handleChange}
            className="w-full border-2 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
          >
            <option value="" disabled>
              Select language
            </option>
            <option
              value="English"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("english")}
            </option>
            <option
              value="Spanish"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("spanish")}
            </option>
            <option
              value="French"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("french")}
            </option>
            <option
              value="German"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
              }}
            >
              {t("german")}
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

const Communication = ({ preferences, handleChange }) => {
  const { t } = useTranslation();

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4">{t("communication")}</h3>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium w-7/12">
          {t("receiveNewsletter")}{" "}
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {t("newsletterDesc")}
          </p>
        </span>
        <label
          htmlFor="newsletter-toggle"
          className="relative inline-flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            id="newsletter-toggle"
            name="newsletter"
            className="sr-only peer"
            checked={preferences.newsletter || false}
            onChange={handleChange}
          />
          <div className="w-11 h-6 bg-red-900 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
};

export default function Preferences() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthContext();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    travelStyle: "",
    language: "",
    newsletter: false,
  });

  useEffect(() => {
    if (user) {
      setPreferences({
        travelStyle: user.travelStyle || "",
        language: user.language || "",
        newsletter: user.newsletter || false,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(preferences);

      updateUser(updatedUser.data || updatedUser);
      const token = localStorage.getItem("token");
      dispatch(loginSuccess({ user: updatedUser.data || updatedUser, token }));

      toast.success(
        t("preferencesSavedSuccessfully") || "Preferences saved successfully"
      );
    } catch (error) {
      console.error("Failed to save preferences:", error);
      toast.error(
        error.response?.data?.message || "Failed to save preferences"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 sm:p-6 md:p-8  rounded-2xl min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {t("preferences")}
      </h2>
      <div className="space-y-8">
        <TravelPreferences
          preferences={preferences}
          handleChange={handleChange}
        />
        <Communication preferences={preferences} handleChange={handleChange} />
      </div>
      <div className="mt-8">
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out disabled:opacity-50"
          style={{
            background: "var(--button-bg)",
            color: "var(--text-button)",
          }}
        >
          {loading ? "Saving..." : t("savePreferences")}
        </button>
      </div>
    </div>
  );
}
