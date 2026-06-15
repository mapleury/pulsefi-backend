import React, { useState } from "react";
import { User, Lock, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PulseFiLogo from "./components/PulseFiLogo";
import { API_URL } from "./api";

export default function Register() {
  const [form, setForm] = useState({ username: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      
      if (res.ok) {
        alert("Registrasi Berhasil! Silahkan Login.");
        window.location.href = "/login";
      } else {
        setError(data.error || "Gagal membuat akun.");
      }
    } catch (err) {
      setError("Server PulseFi Offline (Cek Backend)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] flex flex-col md:flex-row font-sans relative overflow-hidden text-left">
      
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#5A12DE]/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8F79FF]/5 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden md:flex flex-1 p-12 lg:p-20 relative flex-col justify-between z-10"
      >
        <div className="flex items-center gap-4 text-left pl-2">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl shadow-[#5A12DE]/20 rotate-3 bg-white">
            <PulseFiLogo />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">PulseFi</h1>
            <span className="text-[10px] font-black text-[#5A12DE] uppercase tracking-[0.2em]">Join Eco-System</span>
          </div>
        </div>

        <div className="max-w-xl space-y-8">
          <h2 className="text-5xl font-black text-gray-900 leading-tight">Mulai Perjalanan Finansialmu Hari Ini.</h2>
          
          <div className="space-y-6">
            {[
              { title: "Track Every Penny", desc: "Pantau setiap rupiah yang keluar masuk secara otomatis." },
              { title: "AI Financial Mentor", desc: "Dapatkan saran cerdas dari AI untuk menabung lebih banyak." },
              { title: "Secure Data", desc: "Data finansialmu dienkripsi dengan standar keamanan tinggi." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="flex gap-4 items-start"
              >
                <div className="mt-1 bg-[#5A12DE] rounded-full p-1 shadow-lg shadow-[#5A12DE]/30">
                  <CheckCircle2 size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg">{item.title}</h4>
                  <p className="text-gray-500 font-medium text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">Integrated Intelligence v1.0</div>
      </motion.div>


      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 p-6 md:p-12 lg:p-20 flex items-center justify-center relative z-10"
      >
        <div className="absolute top-10 left-10 flex md:hidden items-center gap-3">
           <div className="w-10 h-10 rounded-xl overflow-hidden rotate-3 shadow-lg shadow-[#5A12DE]/20 bg-white">
              <PulseFiLogo />
           </div>
           <div className="text-left">
              <h1 className="text-xl font-black text-gray-900 tracking-tighter leading-none">PulseFi</h1>
              <p className="text-[8px] font-black text-[#5A12DE] uppercase tracking-widest mt-1">Join Now</p>
           </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl shadow-gray-200/60 p-10 md:p-14 border border-gray-100 relative">
          
          <div className="flex flex-col items-center mb-10 text-center font-sans">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create Account</h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">Be part of the future</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-1.5 text-left font-sans">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">Full Name</label>
              <div className="relative group">
                <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 text-[#5A12DE]/30 group-focus-within:text-[#5A12DE] transition-all" size={18} />
                <input 
                  type="text" required placeholder="Mirza Danish"
                  className="w-full pl-14 pr-6 py-4 rounded-[1.2rem] bg-gray-50 border-2 border-transparent focus:border-[#5A12DE]/20 focus:bg-white outline-none font-bold text-gray-900 transition-all shadow-inner"
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left font-sans">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">User ID</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#5A12DE]/30 group-focus-within:text-[#5A12DE] transition-all" size={18} />
                <input 
                  type="text" required placeholder="mirzadanish"
                  className="w-full pl-14 pr-6 py-4 rounded-[1.2rem] bg-gray-50 border-2 border-transparent focus:border-[#5A12DE]/20 focus:bg-white outline-none font-bold text-gray-900 transition-all shadow-inner"
                  onChange={e => setForm({...form, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left font-sans">
               <label className="text-[10px] font-black uppercase text-gray-400 ml-4 tracking-[0.2em]">Password</label>
               <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#5A12DE]/30 group-focus-within:text-[#5A12DE] transition-all" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 rounded-[1.2rem] bg-gray-50 border-2 border-transparent focus:border-[#5A12DE]/20 focus:bg-white outline-none font-bold text-gray-900 transition-all shadow-inner"
                  onChange={e => setForm({...form, password: e.target.value})}
                />
              </div>
            </div>

            <AnimatePresence>
                {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-black border border-red-100 italic"
                >
                    ⚠️ {error}
                </motion.div>
                )}
            </AnimatePresence>

            <button 
              disabled={loading}
              className="w-full py-5 rounded-[1.5rem] bg-[#5A12DE] text-white font-black shadow-xl shadow-[#5A12DE]/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group mt-4 font-sans"
            >
              {loading ? "Creating Roadmap..." : "Start Journey"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center pt-6 border-t border-gray-50 font-sans">
            <p className="text-xs font-bold text-gray-400">
              Already a member? <Link to="/login" className="text-[#5A12DE] font-black hover:underline underline-offset-4">Sign In</Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8 text-gray-300">
             <ShieldCheck size={14} />
             <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secure Registration</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}