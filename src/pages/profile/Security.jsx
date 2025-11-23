import React, { useState } from "react";

const EmailUpdate = () => {
  return (
    <div className="bg-blue-950 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Update Email</h3>
      <form>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium  mb-2">
            New Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Update Email
        </button>
      </form>
    </div>
  );
};

const PasswordChange = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="bg-blue-950 text-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Password</h3>

      {isCollapsed ? (
        <div className="flex justify-between items-center">
          <div className=" text-sm text-gray-400 hidden sm:block">
            <p>Last changed: 1 month ago</p>
            <p>Choose a strong, unique password.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="flex sm:w-auto w-full justify-center items-center  border-2 border-gray-600 p-3 rounded-md text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
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
                // d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                d="M12.3212 10.6852L4 19L6 21M7 16L9 18M20 7.5C20 9.98528 17.9853 12 15.5 12C13.0147 12 11 9.98528 11 7.5C11 5.01472 13.0147 3 15.5 3C17.9853 3 20 5.01472 20 7.5Z"
              ></path>
            </svg>
            <span>Change Password</span>
          </button>
        </div>
      ) : (
        <>
          <form>
            <div className="mb-4">
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium mb-2"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default function Security() {
  return (
    <div className="p-4 sm:p-6 md:p-8 rounded-2xl min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
        Security Settings
      </h2>
      <div className="space-y-8 text-white-500">
        <EmailUpdate />
        <PasswordChange />
      </div>
    </div>
  );
}
