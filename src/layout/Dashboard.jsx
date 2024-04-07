import React from "react";
import { useAuth } from "../context/authentication";
import { Outlet } from "react-router-dom";
import bg_dark from "./../assets/bg.jpg";
import Navbar from "@/components/Navbar";

export default function DashboardLayout() {
  return (
    <div
      className="w-screen h-screen flex flex-col bg-white/50 bg-blend-multiply "
      style={{ background: `url(${bg_dark})` }}
    >
      <div className="flex-1 flex-col bg-white bg-opacity-20 backdrop-blur-sm overflow-hidden flex">
        {/* navbar */}
        <Navbar />
        {/* content */}
        <div className="bg-white backdrop-blur-sm bg-opacity-40 flex flex-col flex-1">
          {/* outlet */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}
