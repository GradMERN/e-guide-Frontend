import React, { useState } from "react";

const countryCities = {
  USA: ["New York", "Los Angeles", "Chicago", "Houston"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  Egypt: ["Cairo", "Alexandria", "Giza", "Luxor"],
  UK: ["London", "Manchester", "Birmingham", "Liverpool"],
};

const LocationInfo = () => {
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
    <div className="bg-blue-950 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Location Information</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-2">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={country}
            onChange={handleCountryChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white-900"
          >
            <option value="" className="bg-gray-900">
              Select a country
            </option>
            {Object.keys(countryCities).map((c) => (
              <option key={c} value={c} className="bg-gray-900">
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-2">
            City
          </label>
          <select
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white-900 disabled:bg-gray-400"
            disabled={!country}
          >
            <option value="" className="bg-gray-900">
              Select a city
            </option>
            {availableCities.map((c) => (
              <option key={c} value={c} className="bg-gray-900">
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
  return (
    <div className="p-4 sm:p-6 md:p-8  rounded-2xl min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
        Address
      </h2>
      <div className="space-y-8">
        <LocationInfo />
      </div>
      <div className="mt-8">
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
