import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, BarChart3, Wallet, Target, Settings, LogOut, Bot, FlameIcon 
} from "lucide-react";
import PulseFiLogo from "./PulseFiLogo";
import { API_URL } from "../api";

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link to={to} className="no-underline">
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden
      ${active ? 'bg-gradient-to-r from-[#5A12DE]/10 to-transparent' : 'hover:bg-gray-50 hover:translate-x-2'}`}>
      {active && <div className="absolute left-0 top-0 h-full w-1 bg-[#5A12DE] rounded-r-md shadow-[0_0_15px_#5A12DE]" />}
      <Icon size={20} className={`transition-colors duration-300 ${active ? 'text-[#5A12DE]' : 'text-gray-400 group-hover:text-[#5A12DE]'}`} />
      <span className={`text-sm font-bold transition-colors duration-300 ${active ? 'text-[#5A12DE]' : 'text-gray-500 group-hover:text-gray-900'}`}>
        {label}
      </span>
    </div>
  </Link>
);

export const Sidebar = () => {
  const location = useLocation();
  const [user, setUser] = useState({ 
    name: localStorage.getItem('pulsefi_user') || 'User',
    image_url: "" 
  });

  const fetchSidebarProfile = async () => {
    const token = localStorage.getItem('pulsefi_token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ name: data.name, image_url: data.image_url });
      }
    } catch (err) {
      console.error("Sidebar sync error");
    }
  };

  useEffect(() => {
    fetchSidebarProfile();
    const handleStorage = () => fetchSidebarProfile();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Yakin mau logout dari PulseFi?")) {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  const menuItems = [
    { icon: Home, label: "Dashboard", to: "/" },
    { icon: Wallet, label: "Transaksi", to: "/transaksi" },
    { icon: Target, label: "Goals", to: "/goals" },
    { icon: BarChart3, label: "Insight", to: "/insight" },
    { icon: FlameIcon, label: "Simulasi", to: "/simulasi" },
    { icon: Bot, label: "Mentor AI", to: "/mentor" },
  ];

  return (
    <div className="w-72 m-6 p-6 rounded-[2.5rem] backdrop-blur-3xl bg-white/80 border border-white shadow-[0_20px_50px_rgba(90,18,222,0.05)] flex flex-col z-10 relative h-[calc(100vh-3rem)] text-left">
      
      <div className="flex items-center gap-3 mb-10 pl-2 group">
        <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-[#5A12DE]/20 rotate-3 transition-transform group-hover:rotate-0 duration-500 bg-white flex items-center justify-center">
          <PulseFiLogo />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">
            Pulse<span className="text-[#5A12DE]">Fi</span>
          </h1>
          <span className="text-[10px] font-black text-[#5A12DE] uppercase tracking-[0.2em]">Eco-System v1.0</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-4">Menu Utama</p>
        {menuItems.map((item) => (
          <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
        ))}
      </div>
      
      <div className="mt-auto space-y-2 pt-6 border-t border-gray-100">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 pl-4">Akun Saya</p>
        
        <Link to="/profile" className="no-underline">
          <div className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group
            ${location.pathname === "/profile" ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' : 'hover:bg-gray-50'}`}>
            
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
              {user.image_url ? (
                <img src={user.image_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center font-black text-sm
                  ${location.pathname === "/profile" ? 'bg-[#5A12DE] text-white' : 'bg-gray-100 text-gray-400'}`}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden">
              <p className={`text-xs font-bold truncate ${location.pathname === "/profile" ? 'text-white' : 'text-gray-900'}`}>
                {user.name}
              </p>
              <p className={`text-[9px] font-medium ${location.pathname === "/profile" ? 'text-white/60' : 'text-gray-400'}`}>
                Settings
              </p>
            </div>
            <Settings size={14} className={location.pathname === "/profile" ? 'text-white/40' : 'text-gray-300'} />
          </div>
        </Link>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-300 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </div>
    </div>
  );
};