import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const countryCities = {
  USA: ["New York", "Los Angeles", "Chicago", "Houston"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  Egypt: ["Cairo", "Alexandria", "Giza", "Luxor"],
  UK: ["London", "Manchester", "Birmingham", "Liverpool"],
};

const LocationInfo = () => {
  const { t } = useTranslation();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [availableCities, setAvailableCities] = useState([]);

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
            className="w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: "var(--border)",
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
            className="w-full px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 disabled:opacity-50"
            style={{
              borderColor: "var(--border)",
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

export default function Address() {
  const { t } = useTranslation();
  return (
    <div
      className="p-4 sm:p-6 md:p-8  rounded-2xl min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">{t("address")}</h2>
      <div className="space-y-8">
        <LocationInfo />
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
