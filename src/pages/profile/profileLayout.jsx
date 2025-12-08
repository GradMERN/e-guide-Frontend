import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";

const ProfileLayout = () => {
  const { user, isDarkMode } = useAuth();
  const { t } = useTranslation();

  const textColor = isDarkMode ? "text-white" : "text-gray-900";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <Navbar />

      <div className="flex pt-28">
        <SideBar />

        <div className="flex-1 flex flex-col transition-all duration-300 ms-20 md:ms-60">
          {/* Welcome Message */}
          <div className="px-8 py-6">
            <h1 className={`text-3xl font-bold ${textColor}`}>
              {t("welcome")},{" "}
              <span className="text-[#C7A15C]">
                {user?.firstName || "User"}
              </span>
            </h1>
          </div>

          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
