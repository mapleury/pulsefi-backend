import React from "react";
import { Sidebar } from "./Sidebar"; 

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full bg-[#F8F9FD] overflow-hidden items-start"> 
      
      <Sidebar />

      <main className="flex-1 h-screen overflow-y-auto relative p-6 md:p-10 flex flex-col items-center">
        <div className="w-full max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;