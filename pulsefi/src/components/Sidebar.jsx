import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BarChart3, Wallet, Target, User, Lightbulb, Activity, FlameIcon } from "lucide-react";

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link to={to} className="no-underline">
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden
      ${active ? 'bg-gradient-to-r from-[#8F79FF]/20 to-transparent' : 'hover:bg-gray-50 hover:translate-x-2'}`}>
      {active && <div className="absolute left-0 top-0 h-full w-1 bg-[#5A12DE] rounded-r-md shadow-[0_0_10px_#5A12DE]" />}
      <Icon size={20} className={`transition-colors duration-300 ${active ? 'text-[#5A12DE]' : 'text-gray-400 group-hover:text-[#8F79FF]'}`} />
      <span className={`text-sm font-semibold transition-colors duration-300 ${active ? 'text-[#5A12DE]' : 'text-gray-500 group-hover:text-gray-800'}`}>
        {label}
      </span>
    </div>
  </Link>
);

export const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: Home, label: "Dashboard", to: "/" },
    { icon: Wallet, label: "Transaksi", to: "/transaksi" },
    { icon: BarChart3, label: "Insight", to: "/insight" },
    { icon: Target, label: "Goals", to: "/goals" },
    { icon: FlameIcon, label: "Streak", to: "/simulasi" },
  ];

  return (
    <div className="w-72 m-6 p-6 rounded-3xl backdrop-blur-2xl bg-white/70 border border-white/60 shadow-[0_8px_30px_rgb(90,18,222,0.06)] flex flex-col z-10 relative">
      <div className="flex items-center gap-3 mb-10 pl-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5A12DE] to-[#8F79FF] flex items-center justify-center shadow-lg shadow-[#5A12DE]/30">
          <Activity className="text-white" size={24} />
        </div>
        <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#5A12DE] to-[#8F79FF] tracking-tight">
          PulseFi
        </h1>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {menuItems.map((item) => (
          <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
        ))}
      </div>
      
      <div className="mt-auto border-t border-gray-100 pt-4">
        <SidebarItem icon={User} label="Profil" to="/profil" active={location.pathname === "/profil"} />
      </div>
    </div>
  );
};