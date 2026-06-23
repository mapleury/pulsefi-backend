import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { Flame, Trophy, Calendar, Zap } from "lucide-react";
import { API_URL } from "./api";

export default function Streak() {
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0, is_active_today: false });

  // PERBAIKAN: Membersihkan trailing slash dari environment
  const baseUrl = API_URL.replace(/\/$/, "");

  const fetchStreak = async () => {
    try {
      // PERBAIKAN: Menambahkan rute /api agar sesuai dengan backend
      const res = await fetch(`${baseUrl}/api/profile/streak`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('pulsefi_token')}` }
      });
      
      if (res.ok) {
        const d = await res.json();
        setStreak(d);
      }
    } catch (error) {
      console.error("Gagal mengambil data streak:", error);
    }
  };

  useEffect(() => { fetchStreak(); }, []);

  return (
    <DashboardLayout>
      <header className="mb-10 text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Financial Streak</h2>
        <p className="text-sm text-gray-500 font-medium">Konsistensi adalah kunci kebebasan finansial.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="p-10 rounded-[3rem] bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-2xl shadow-orange-200 flex flex-col items-center justify-center relative overflow-hidden group">
            <Flame size={120} className={`mb-4 transition-all duration-700 ${streak.is_active_today ? 'scale-110 fill-white animate-pulse' : 'opacity-50'}`} />
            <h3 className="text-6xl font-black mb-2">{streak.current_streak}</h3>
            <p className="text-lg font-bold uppercase tracking-[0.3em] opacity-80">Days Streak</p>
            
            {!streak.is_active_today && (
                <div className="mt-6 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs font-black animate-bounce">
                    CATAT TRANSAKSI HARI INI!
                </div>
            )}
            <Zap className="absolute -right-4 -bottom-4 text-white/10 w-40 h-40" />
        </section>

        <div className="space-y-6">
            <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-500">
                    <Trophy size={32} />
                </div>
                <div className="text-left">
                    <p className="text-xs font-black text-gray-400 uppercase">Longest Streak</p>
                    <h4 className="text-2xl font-black text-gray-900">{streak.longest_streak} Days</h4>
                </div>
            </div>

            <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center gap-6 text-left">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                    <Calendar size={32} />
                </div>
                <div>
                    <h4 className="font-bold text-gray-800">Status Hari Ini</h4>
                    <p className="text-sm text-gray-500">
                        {streak.is_active_today 
                            ? "Keren! Kamu sudah menjaga detak jantung PulseFi hari ini." 
                            : "Ayo catat satu transaksi hari ini supaya streak-mu tidak reset!"}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
}