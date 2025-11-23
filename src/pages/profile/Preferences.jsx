import React, { useState } from "react";

const TravelPreferences = () => {
  return (
    <div className="bg-blue-950 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Travel Preferences</h3>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="travelStyle"
            className="block text-sm font-medium mb-2"
          >
            Preferred Travel Style
          </label>
          <select
            id="travelStyle"
            name="travelStyle"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white-900"
          >
            <option className="bg-gray-900">Adventure</option>
            <option className="bg-gray-900">Relaxation</option>
            <option className="bg-gray-900">Cultural</option>
            <option className="bg-gray-900">Family</option>
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-sm font-medium mb-2">
            Preferred Language
          </label>
          <select
            id="language"
            name="language"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white-900"
          >
            <option className="bg-gray-900">English</option>
            <option className="bg-gray-900">Spanish</option>
            <option className="bg-gray-900">French</option>
            <option className="bg-gray-900">German</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const Communication = () => {
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className="bg-blue-950 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Communication</h3>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium w-7/12">
          Receive our newsletter{" "}
          <p className="text-xs text-gray-400">
            Receive updates about new tours and special offers
          </p>
        </span>
        <label
          htmlFor="newsletter-toggle"
          className="relative inline-flex items-center cursor-pointer"
        >
          <input
            type="checkbox"
            id="newsletter-toggle"
            className="sr-only peer "
            checked={newsletter}
            onChange={() => setNewsletter(!newsletter)}
          />
          <div className="w-11 h-6 bg-red-900 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
    </div>
  );
};

export default function Preferences() {
  return (
    <div className="p-4 sm:p-6 md:p-8  rounded-2xl min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
        Preferences
      </h2>
      <div className="space-y-8">
        <TravelPreferences />
        <Communication />
      </div>
      <div className="mt-8">
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
