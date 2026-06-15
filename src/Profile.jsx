import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { User, Lock, Camera, Check } from "lucide-react";
import { API_URL } from "./api";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", image_url: "", username: "" });
  const [passData, setPassData] = useState({ oldPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('pulsefi_token')}`,
    'Content-Type': 'application/json'
  });

  const fetchProfile = async () => {
    const res = await fetch(`${API_URL}/profile`, { headers: getAuthHeader() });
    const data = await res.json();
    setProfile(data);
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ name: profile.name, image_url: profile.image_url })
    });
    setLoading(false);
    alert("Profile updated!");
    localStorage.setItem('pulsefi_user', profile.name);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/profile/password`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(passData)
    });
    const data = await res.json();
    if (res.ok) {
      alert("Password updated!");
      setPassData({ oldPassword: "", newPassword: "" });
    } else {
      alert(data.error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-left">
          <h2 className="text-3xl font-black text-gray-900">Pengaturan Profil</h2>
          <p className="text-sm text-gray-500 font-medium">Kelola identitas dan keamanan akunmu.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm space-y-6 text-left">
            <h3 className="text-lg font-black flex items-center gap-2"><User size={20} className="text-[#5A12DE]"/> Identitas</h3>
            
            <div className="flex flex-col items-center gap-4 mb-6">
              <div className="relative group">
                <img 
                  src={profile.image_url || `https://ui-avatars.com/api/?name=${profile.name}&background=5A12DE&color=fff`} 
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-gray-50 shadow-md"
                  alt="Avatar"
                />
                <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer">
                  <Camera size={20} className="text-white" />
                </div>
              </div>
              <input 
                type="text" placeholder="URL Foto Profil"
                value={profile.image_url || ""}
                onChange={(e) => setProfile({...profile, image_url: e.target.value})}
                className="w-full px-4 py-2 text-xs rounded-xl bg-gray-50 border-none outline-none font-medium"
              />
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Username</label>
                <input type="text" disabled value={profile.username || ""} className="w-full px-5 py-3 rounded-xl bg-gray-100 text-gray-400 font-bold cursor-not-allowed" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nama Lengkap</label>
                <input 
                  type="text" value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-[#5A12DE]/10" 
                />
              </div>
              <button className="w-full py-4 rounded-2xl bg-[#5A12DE] text-white font-black shadow-lg shadow-[#5A12DE]/20">
                {loading ? "Saving..." : "Simpan Perubahan"}
              </button>
            </form>
          </section>

          <section className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm space-y-6 text-left">
            <h3 className="text-lg font-black flex items-center gap-2"><Lock size={20} className="text-red-500"/> Keamanan</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Password Lama</label>
                <input 
                  type="password" required
                  value={passData.oldPassword}
                  onChange={(e) => setPassData({...passData, oldPassword: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-red-100" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Password Baru</label>
                <input 
                  type="password" required
                  value={passData.newPassword}
                  onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 font-bold outline-none focus:ring-2 focus:ring-green-100" 
                />
              </div>
              <button className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black">
                Update Password
              </button>
            </form>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}