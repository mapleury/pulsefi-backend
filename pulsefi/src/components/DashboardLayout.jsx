import React from "react";
import { Sidebar } from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FE] flex relative overflow-hidden font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[#5A12DE] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-[#8F79FF] opacity-15 rounded-full blur-[120px] pointer-events-none"></div>

      <Sidebar />

      <div className="flex-1 py-8 pr-8 pl-2 space-y-8 z-10 h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;