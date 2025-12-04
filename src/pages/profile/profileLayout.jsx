import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import Switch from "../../components/ui/SwitchLanguages";

const ProfileLayout = () => {
  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--background)", color: "var(--text)" }}
    >
      <SideBar />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-4 items-center gap-3">
          <ThemeToggle />
          <Switch />
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;
