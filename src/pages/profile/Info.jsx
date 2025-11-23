// import React from "react";
import React, { useState } from "react";

const ProfilePhoto = () => {
  return (
    <div className="bg-blue-950 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 sm:text-left text-center">
        Profile Photo
      </h3>
      <div className="flex items-center space-x-4 space-y-5 flex-col sm:flex-row">
        <div className="relative">
          <img
            className="w-20 h-20 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1616197151166-93dc9b4528d8?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNxdWFyZXxlbnwwfHwwfHx8MA%3D%3D" // Placeholder image
            alt="Avatar"
          />
          <div className="absolute bottom-0 right-0 bg-gray-700 rounded-full p-1 cursor-pointer hover:bg-gray-600">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
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
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Upload new photo
          </button>
          <p className="text-xs text-center text-gray-400 mt-2">
            JPG or PNG, max size 2MB
          </p>
        </div>
      </div>
    </div>
  );
};

const BasicDetails = () => {
  return (
    <div className="bg-blue-950 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Basic Details</h3>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white-900"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white-900"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-2">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white-900"
          />
        </div>
        <div>
          <label htmlFor="number" className="block text-sm font-medium mb-2">
            Number
          </label>
          <input
            type="tel"
            id="number"
            name="number"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white-900"
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
  return (
    <div className="p-4 sm:p-6 md:p-8  rounded-2xl min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
        Personal Information
      </h2>
      <div className="space-y-8">
        <ProfilePhoto />
        <BasicDetails />
        <Address />
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
