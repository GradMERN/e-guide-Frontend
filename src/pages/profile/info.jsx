import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../store/hooks";

const ProfilePhoto = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
      <h3 className="text-xl font-semibold mb-4 sm:text-start text-center">
        {t("profilePhoto")}
      </h3>
      <div className="flex items-center space-x-4 space-y-5 flex-col sm:flex-row">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-black font-bold text-3xl border-2"
            style={{
              borderColor: "var(--primary)",
              background: "linear-gradient(to right, #C7A15C, #E2C784)",
            }}
          >
            {user?.firstName?.charAt(0) || "U"}
          </div>
          <div className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-1 cursor-pointer hover:bg-gray-600">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              style={{ color: "var(--text)" }}
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
          </div>
        </div>
        <div>
          <button
            type="button"
            className="py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
            style={{
              background: "var(--button-bg)",
              color: "var(--text-button)",
            }}
          >
            {t("uploadNewPhoto")}
          </button>
          <p
            className="text-xs text-center mt-2"
            style={{ color: "var(--text-muted)" }}
          >
            {t("photoConstraints")}
          </p>
        </div>
      </div>
    </div>
  );
};

const BasicDetails = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div
      className="p-6 rounded-lg shadow-md"
      style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
    >
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
            defaultValue={user?.firstName || ""}
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
            defaultValue={user?.lastName || ""}
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
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
          />
        </div>
        <div>
          <label htmlFor="number" className="block text-sm font-medium mb-2">
            {t("number")}
          </label>
          <input
            type="tel"
            id="number"
            name="number"
            defaultValue={user?.phone || ""}
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
          />
        </div>
      </form>
    </div>
  );
};

///////////

const countryCities = {
  USA: ["New York", "Los Angeles", "Chicago", "Houston"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  Egypt: ["Cairo", "Alexandria", "Giza", "Luxor"],
  UK: ["London", "Manchester", "Birmingham", "Liverpool"],
};

const LocationInfo = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [country, setCountry] = useState(user?.country || "");
  const [city, setCity] = useState(user?.city || "");
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (user?.country) {
      setCountry(user.country);
      setAvailableCities(countryCities[user.country] || []);
    }
    if (user?.city) {
      setCity(user.city);
    }
  }, [user]);

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setCountry(selectedCountry);
    setCity(""); // Reset city when country changes
    setAvailableCities(countryCities[selectedCountry] || []);
  };
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
            value={country}
            onChange={handleCountryChange}
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
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className=" border-2 w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{
              backgroundColor: "var(--surface)",
              color: "var(--text)",
              "--tw-ring-color": "var(--primary)",
            }}
            disabled={!country}
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

function Address() {
  return (
    // <div className="p-4 sm:p-6 md:p-8  rounded-2xl min-h-screen">
    <div className="space-y-8">
      <LocationInfo />
    </div>
    // </div>
  );
}

export default function Info() {
  const { t } = useTranslation();
  return (
    <div
      className="p-4 sm:p-6 md:p-8  rounded-2xl min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {t("personalInformation")}
      </h2>
      <div className="space-y-8">
        <ProfilePhoto />
        <BasicDetails />
        <Address />
      </div>

      <div className="mt-8">
        <button
          type="button"
          className="w-full py-2 px-4 rounded-md focus:outline-none focus:ring-2 transition duration-150 ease-in-out"
          style={{
            background: "var(--button-bg)",
            color: "var(--text-button)",
          }}
        >
          {t("saveChanges")}
        </button>
      </div>
    </div>
  );
}
