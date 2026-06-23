import React, { useState } from "react";
import { User, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PulseFiLogo from "./components/PulseFiLogo";
import { API_URL } from "./api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Perbaikan Rute: Membersihkan trailing slash (jika ada) dan mengarahkannya ke /api/login
      const baseUrl = API_URL.replace(/\/$/, "");
      const endpoint = `${baseUrl}/api/login`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('pulsefi_token', data.token);
        localStorage.setItem('pulsefi_user', data.username);
        window.location.href = "/";
      } else {
        setError(data.error || "Akses ditolak.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Server Offline atau terjadi masalah koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col md:flex-row font-sans relative overflow-hidden text-left">
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:flex flex-1 p-12 lg:p-20 relative flex-col justify-between z-10"
      >
        <div className="flex items-center gap-4 text-left pl-2">
          <div className="w-16 h-16 rounded-[1.2rem] flex items-center justify-center shadow-xl shadow-[#5A12DE]/20 rotate-3 overflow-hidden bg-white">
            <PulseFiLogo />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none">PulseFi</h1>
            <span className="text-[10px] font-black text-[#5A12DE] uppercase tracking-[0.2em]">Financial Roadmap</span>
          </div>
        </div>

        <div className="max-w-xl">
          <div className="p-10 rounded-[3rem] bg-white/60 backdrop-blur-xl border border-white shadow-2xl shadow-gray-200/50 relative overflow-hidden mb-12">
            <div className="absolute top-6 right-6 opacity-10 rotate-12">
               <PulseFiLogo className="w-24 h-24" />
            </div>
            <p className="text-4xl font-black leading-tight text-gray-950 pr-12 text-left">
              "Kuasai aliran kasmu, bangun kekayaan masa depanmu."
            </p>
            <p className="text-sm font-medium text-gray-400 mt-6 uppercase tracking-widest text-left">– PulseFi Intelligence</p>
          </div>
        </div>
        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] text-left">Secure Financial Access v1.0</div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 p-6 md:p-12 lg:p-20 flex items-center justify-center relative z-10"
      >
        <div className="w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl p-12 md:p-16 border border-gray-100">
          <div className="flex flex-col items-center mb-10 text-center">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest tracking-widest">Enter secure credentials</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">User ID</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#5A12DE]/30" size={20} />
                <input 
                  type="text" required placeholder="username"
                  className="w-full pl-16 pr-6 py-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent focus:border-[#5A12DE]/20 focus:bg-white outline-none font-bold text-gray-900 transition-all shadow-inner"
                  onChange={e => setForm({...form, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
               <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">Password</label>
               <div className="relative">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#5A12DE]/30" size={20} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full pl-16 pr-6 py-5 rounded-[1.5rem] bg-gray-50 border-2 border-transparent focus:border-[#5A12DE]/20 focus:bg-white outline-none font-bold text-gray-900 transition-all shadow-inner"
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black">{error}</div>}

            <button disabled={loading} className="w-full py-5 rounded-[1.5rem] bg-[#5A12DE] text-white font-black shadow-xl shadow-[#5A12DE]/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
              {loading ? "Verifying..." : "Authorize Login"}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-12 text-center pt-8 border-t border-gray-100">
            <p className="text-xs font-bold text-gray-400">
              No account? <Link to="/register" className="text-[#5A12DE] font-black hover:underline">Register Now</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}