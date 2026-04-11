import React, { useState, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { TrendingDown, TrendingUp, Wallet, User, Activity, Zap } from "lucide-react";

export default function PulseFiDashboard() {
  const [pulse, setPulse] = useState({ score: 50, status: 'Syncing', identity: 'Strategist' });

  useEffect(() => {
    const getPulseData = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/profile/pulse');
        const data = await res.json();
        setPulse({
          score: data.pulseScore,
          status: data.pulseScore >= 80 ? "Stable" : data.pulseScore >= 50 ? "Fluctuating" : "Critical",
          identity: data.identity
        });
      } catch (err) {
        console.log("Backend not active, using vibe defaults");
      }
    };
    getPulseData();
    const interval = setInterval(getPulseData, 30000);
    return () => clearInterval(interval);
  }, []);

  const pulseSpeed = pulse.score > 70 ? '3s' : pulse.score > 40 ? '1.5s' : '0.6s';

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Financial Pulse Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">Welcome back, here is your financial summary today.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8F79FF] to-[#5A12DE] p-[2px] cursor-pointer hover:scale-105 transition-transform shadow-md">
           <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" className="w-full h-full rounded-full bg-white object-cover" />
        </div>
      </header>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Pengeluaran */}
        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(90,18,222,0.04)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(90,18,222,0.1)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
            <TrendingDown size={100} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-sm font-semibold text-gray-500">Total Pengeluaran</p>
            <div className="w-8 h-8 rounded-full bg-[#8F79FF]/10 flex items-center justify-center text-[#5A12DE]">
              <TrendingDown size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900 relative z-10">
            Rp 2.500<span className="text-gray-400">.000</span>
          </h3>
        </div>

        {/* Card 2: Total Tabungan */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#5A12DE] to-[#8F79FF] text-white shadow-lg shadow-[#5A12DE]/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5A12DE]/40 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
            <TrendingUp size={100} color="white" />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-sm font-medium text-white/80">Total Tabungan</p>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Wallet size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold relative z-10">
            Rp 1.200<span className="text-white/60">.000</span>
          </h3>
        </div>

        {/* Card 3: Profil Finansial */}
        <div className="p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(90,18,222,0.04)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgb(90,18,222,0.1)] transition-all duration-300 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-all duration-500">
            <User size={100} />
          </div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <p className="text-sm font-semibold text-gray-500">Profil Finansial</p>
            <div className="px-3 py-1 rounded-full bg-[#8F79FF]/10 text-[#5A12DE] text-xs font-bold uppercase tracking-wider">Level 4</div>
          </div>
          <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#5A12DE] to-[#8F79FF] mt-2 relative z-10">
            Strategist
          </h3>
        </div>
      </div>

      {/* Middle Section: Charts & Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Chart */}
        <div className="h-64 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(90,18,222,0.04)] p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Grafik Pengeluaran</h3>
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">Minggu ini</span>
          </div>
          <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50/50">
             <div className="flex items-end gap-2 h-24">
                {[40, 70, 45, 90, 60, 30, 80].map((h, i) => (
                   <div key={i} className="w-8 bg-gradient-to-t from-[#5A12DE] to-[#8F79FF] rounded-t-sm opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                ))}
             </div>
          </div>
        </div>

        {/* Pulse Monitor (FULL ANIMATIONS RESTORED) */}
        <div className="h-64 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(90,18,222,0.04)] p-6 flex flex-col relative overflow-hidden transition-all duration-500">
          <div className="flex justify-between items-center mb-4 relative z-20">
            <div>
              <h3 className="font-bold text-gray-800">Financial Pulse</h3>
              <p className="text-[10px] text-[#5A12DE] font-bold uppercase tracking-widest">{pulse.identity}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-md animate-pulse ${pulse.score < 40 ? 'bg-red-100 text-red-600' : 'bg-[#5A12DE]/10 text-[#5A12DE]'}`}>
              {pulse.score < 40 ? 'CRITICAL' : 'LIVE'}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="absolute w-32 h-32 border-2 border-[#8F79FF]/30 rounded-full" style={{ animation: `ping ${pulseSpeed} linear infinite` }}></div>
            <div className="absolute w-24 h-24 border-2 border-[#5A12DE]/40 rounded-full" style={{ animation: `ping ${parseFloat(pulseSpeed) * 0.7}s linear infinite` }}></div>

            <div className={`w-16 h-16 rounded-full shadow-[0_0_30px_#8F79FF] flex flex-col items-center justify-center z-10 transition-all duration-500 ${pulse.score < 40 ? 'bg-red-500 shadow-red-500/50' : 'bg-gradient-to-br from-[#5A12DE] to-[#8F79FF]'}`}>
              <Activity color="white" size={20} />
              <span className="text-[10px] font-black text-white mt-0.5">{pulse.score}</span>
            </div>

            <div className="mt-6 text-center z-20">
              <span className={`text-sm font-extrabold tracking-tight transition-colors ${pulse.score < 40 ? 'text-red-600' : 'text-gray-700'}`}>
                {pulse.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Insights */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#8F79FF] blur-[40px] rounded-full opacity-50"></div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-[#5A12DE]/40 flex items-center justify-center border border-white/10">
              <Zap size={18} className="text-[#8F79FF]" />
            </div>
            <h3 className="font-bold text-lg">Behavior Insights</h3>
          </div>
          <p className="text-gray-300 font-medium leading-relaxed relative z-10">
            Pengeluaran <span className="text-[#8F79FF] font-bold">impulsif</span> meningkat minggu ini. Waktunya mengerem pengeluaran tersier Anda!
          </p>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(90,18,222,0.04)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Transaksi Terbaru</h3>
            <button className="text-sm text-[#5A12DE] font-semibold hover:underline">Lihat Semua</button>
          </div>
          <ul className="space-y-3">
            {[
              { icon: '☕', label: 'Kopi', time: 'Hari ini, 09:00', amount: '- Rp 25.000', color: 'bg-orange-50' },
              { icon: '🎮', label: 'Game', time: 'Kemarin, 20:30', amount: '- Rp 150.000', color: 'bg-blue-50' },
              { icon: '📚', label: 'Buku', time: '2 Hari yang lalu', amount: '- Rp 80.000', color: 'bg-green-50' }
            ].map((t, i) => (
              <li key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white hover:shadow-sm transition border border-transparent hover:border-gray-100 group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${t.color} flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition`}>{t.icon}</div>
                  <div>
                    <p className="font-bold text-gray-800">{t.label}</p>
                    <p className="text-xs text-gray-500 font-medium">{t.time}</p>
                  </div>
                </div>
                <span className="font-extrabold text-gray-800">{t.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}