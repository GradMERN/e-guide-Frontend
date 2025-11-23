import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 p-2 text-white bg-gray-800">
        <Outlet />
      </main>
    </div>
  );
};

export default ProfileLayout;
