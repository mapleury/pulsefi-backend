import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "./components/DashboardLayout";
import LifeSimulation from "./components/LifeSimulation"; 
import { 
  TrendingDown, TrendingUp, Wallet, User, Activity, Zap, LogOut, ChevronDown 
} from "lucide-react";
import { API_URL } from "./api";
import { Link } from "react-router-dom";

export default function PulseFiDashboard() {
  const [pulse, setPulse] = useState({ score: 0, status: 'Syncing', identity: 'User' });
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 });
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [userProfile, setUserProfile] = useState({ name: "User", image_url: "" });
  const [aiAdvice, setAiAdvice] = useState("Menganalisis pola pengeluaranmu...");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const formatIDR = (num) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(num || 0);
  };

  const getAIAdvice = useCallback(async () => {
    const token = localStorage.getItem('pulsefi_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/ai/advice`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAiAdvice(data.advice);
      }
    } catch (err) {
      console.error("AI Fetch Error");
      setAiAdvice("PulseAI sedang beristirahat sejenak.");
    }
  }, []);

  const getDashboardData = useCallback(async () => {
    const token = localStorage.getItem('pulsefi_token');
    if (!token || token === "undefined") { handleLogout(); return; }

    const requestOptions = {
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    };

    try {
      const [summaryRes, weeklyRes, recentRes, profileRes] = await Promise.allSettled([
        fetch(`${API_URL}/transactions/summary`, requestOptions),
        fetch(`${API_URL}/transactions/weekly`, requestOptions),
        fetch(`${API_URL}/transactions/recent`, requestOptions),
        fetch(`${API_URL}/profile`, requestOptions)
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.ok) {
        const pData = await profileRes.value.json();
        setUserProfile(pData);
        localStorage.setItem('pulsefi_user', pData.name);
      }

      if (summaryRes.status === 'fulfilled') {
        if (summaryRes.value.status === 401) { handleLogout(); return; }
        if (summaryRes.value.ok) {
          const sData = await summaryRes.value.json();
          setSummary(sData);
          
          let rank = "Survivor"; let sc = 45;
          if (sData.balance >= 10000000) { rank = "Financial Whale"; sc = 95; }
          else if (sData.balance >= 1000000) { rank = "Strategist"; sc = 75; }
          else if (sData.balance < 0) { rank = "Debt Alert"; sc = 15; }

          setPulse({ score: sc, identity: rank, status: sc >= 70 ? "Stable" : sc >= 40 ? "Fluctuating" : "Critical" });
        }
      }

      if (weeklyRes.status === 'fulfilled' && weeklyRes.value.ok) setWeeklyData(await weeklyRes.value.json());
      if (recentRes.status === 'fulfilled' && recentRes.value.ok) setRecentTransactions(await recentRes.value.json());

    } catch (err) { console.error("Dashboard Sync Error:", err); }
  }, []);

  useEffect(() => {
    getDashboardData();
    getAIAdvice(); 
    
    const interval = setInterval(() => {
        getDashboardData();
    }, 15000); 
    
    const aiInterval = setInterval(() => {
        getAIAdvice();
    }, 600000); 

    return () => {
      clearInterval(interval);
      clearInterval(aiInterval);
    };
  }, []); 

  const pulseSpeed = pulse.score > 70 ? '3s' : pulse.score > 40 ? '1.5s' : '0.6s';
  const getCategoryIcon = (cat) => {
    const icons = { "Food/Hustle": "☕", "Subscriptions": "💳", "Self-Care": "🧼", "Transport": "🚗", "Entertainment": "🎮", "Fixed Needs": "🏠" };
    return icons[cat] || "✨";
  };

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div className="text-left w-full md:w-auto">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight capitalize">Halo, {userProfile.name}!</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Sistem PulseFi memonitor aliran kasmu.</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-[2rem] border border-gray-100 shadow-sm self-end md:self-auto">
          <div className="hidden sm:block pl-4 border-r border-gray-100 pr-4 text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saldo Aktif</p>
            <p className="text-sm font-black text-[#5A12DE]">{formatIDR(summary.balance)}</p>
          </div>
          <Link to="/profile" className="flex items-center gap-3 group no-underline">
            <div className="relative">
              <img 
                src={userProfile.image_url || `https://ui-avatars.com/api/?name=${userProfile.name}&background=5A12DE&color=fff`} 
                className="w-11 h-11 rounded-2xl object-cover border-2 border-white shadow-md group-hover:scale-105 transition-transform"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-black text-gray-900 leading-none">{userProfile.name}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Verified Member</p>
            </div>
            <ChevronDown size={14} className="text-gray-300 group-hover:text-[#5A12DE] transition-colors" />
          </Link>
        </div>
      </header>

      <div className="mb-8 p-6 rounded-[2.5rem] bg-gray-900 text-white relative overflow-hidden group border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5A12DE] to-[#8F79FF] flex items-center justify-center shadow-lg shadow-[#5A12DE]/40">
            <Zap className="text-white animate-pulse" size={24} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8F79FF] mb-1">PulseAI Intelligence</p>
            <p className="text-sm md:text-base font-medium italic leading-relaxed">
              "{aiAdvice}"
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5A12DE]/20 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-[#5A12DE]/30 transition-all"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm transition-all hover:-translate-y-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg text-red-500"><TrendingDown size={16}/></div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Expenses</p>
          </div>
          <h3 className="text-2xl font-black text-red-500">{formatIDR(summary.totalExpense)}</h3>
        </div>
        
        <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#5A12DE] to-[#8F79FF] text-white shadow-xl shadow-[#5A12DE]/20 transition-all hover:-translate-y-1 relative overflow-hidden group text-left">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg text-white"><Wallet size={16}/></div>
              <p className="text-xs font-medium text-white/80 uppercase">Main Balance</p>
            </div>
            <h3 className="text-2xl font-black">{formatIDR(summary.balance)}</h3>
          </div>
          <Activity size={80} className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform" />
        </div>

        <div className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm transition-all hover:-translate-y-1 text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg text-[#5A12DE]"><Zap size={16}/></div>
            <p className="text-xs font-bold text-gray-400 uppercase">Personal Rank</p>
          </div>
          <h3 className="text-xl font-black text-[#5A12DE]">{pulse.identity}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 text-left">
        <div className="lg:col-span-8">
           <LifeSimulation monthlySaving={summary.balance > 0 ? summary.balance : 0} />
        </div>

        <div className="lg:col-span-4 p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <div className="relative flex items-center justify-center scale-110">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle cx="72" cy="72" r="65" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
              <circle cx="72" cy="72" r="65" stroke="currentColor" strokeWidth="6" strokeDasharray={408} strokeDashoffset={408 - (408 * pulse.score) / 100} strokeLinecap="round" fill="transparent" 
                className={`transition-all duration-1000 ${pulse.score < 40 ? 'text-red-500' : 'text-[#5A12DE]'}`} 
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-gray-900">{pulse.score}</span>
              <p className="text-[8px] font-black uppercase text-gray-400">Score</p>
            </div>
            <div className={`absolute inset-0 rounded-full animate-ping opacity-10 ${pulse.score < 40 ? 'bg-red-400' : 'bg-[#5A12DE]'}`} style={{ animationDuration: pulseSpeed }}></div>
          </div>
          <div className="mt-8 text-center">
            <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full border ${pulse.score < 40 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-[#5A12DE]/5 text-[#5A12DE] border-[#5A12DE]/10'}`}>
              STATUS: {pulse.status}
            </span>
            <p className="text-[9px] font-bold text-gray-400 mt-4 max-w-[150px]">Skor ini berdasarkan rasio saldo dan pengeluaranmu.</p>
          </div>
        </div>
      </div>

      <div className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm text-left">
        <h3 className="font-black text-gray-900 text-xl mb-6">Aktivitas Terbaru</h3>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? recentTransactions.map((t, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg">{getCategoryIcon(t.category)}</div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{t.description || "Tanpa Deskripsi"}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{t.category}</p>
                </div>
              </div>
              <p className={`font-black ${t.type === 'income' ? 'text-green-500' : 'text-gray-950'}`}>
                {t.type === 'income' ? '+' : '-'} {formatIDR(t.amount).replace('Rp', '').trim()}
              </p>
            </div>
          )) : <p className="text-center py-4 text-gray-400 font-bold italic">Belum ada transaksi di akun ini.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}