import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { 
  Plus, Search, Target, Edit2, Trash2, ChevronLeft, ChevronRight, TrendingUp, Zap, X,
  ArrowRight, Award, Flame
} from "lucide-react";
import { API_URL } from "./api";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({ name: "", target: "", current: 0 });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('pulsefi_token')}`,
    'Content-Type': 'application/json'
  });

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/goals`, { headers: getAuthHeader() });
      if (res.status === 401 || res.status === 403) { window.location.href = "/login"; return; }
      const data = await res.json();
      if (Array.isArray(data)) setGoals(data);
    } catch (err) { console.error("Fetch error:", err); }
  }, []);

  useEffect(() => { fetchGoals(); }, [fetchGoals]);

  const filteredGoals = useMemo(() => {
    return goals.filter(g => g.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [goals, searchTerm]);

  const totalPages = Math.ceil(filteredGoals.length / itemsPerPage);
  const currentData = filteredGoals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const baseUrl = `${API_URL}/goals`;
    const url = editingId ? `${baseUrl}/${editingId}` : baseUrl;
    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ 
            name: formData.name, 
            target: parseFloat(formData.target),
            current: parseFloat(formData.current || 0)
        }),
      });
      if (res.ok) { resetForm(); fetchGoals(); }
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus target keuangan ini?")) return;
    try {
      const res = await fetch(`${API_URL}/goals/${id}`, { method: 'DELETE', headers: getAuthHeader() });
      if (res.ok) fetchGoals();
    } catch (err) { console.error(err); }
  };

  const resetForm = () => {
    setFormData({ name: "", target: "", current: 0 });
    setEditingId(null);
  };

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { 
    style: 'currency', currency: 'IDR', maximumFractionDigits: 0 
  }).format(num || 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
        
        {/* --- HEADER SECTION --- */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-[#5A12DE]/10 rounded-lg text-[#5A12DE]"><Award size={18}/></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5A12DE]">Financial Roadmap</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Financial Goals</h1>
            <p className="text-gray-500 font-medium mt-1">Setiap rupiah yang kamu simpan adalah investasi masa depan.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A12DE] transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari target impian..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-11 pr-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-4 focus:ring-[#5A12DE]/5 focus:border-[#5A12DE]/20 outline-none w-full md:w-72 transition-all font-medium"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* --- FORM SECTION (Side) --- */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 sticky top-10 text-left">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  {editingId ? <Edit2 className="text-[#5A12DE]" size={20} /> : <Plus className="text-[#5A12DE]" size={20} />}
                  {editingId ? "Ubah Target" : "Target Baru"}
                </h3>
                {editingId && (
                  <button onClick={resetForm} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-red-500"><X size={16}/></button>
                )}
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Nama Target</label>
                  <input 
                    type="text" required placeholder="Contoh: Haji / Beli Motor" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#5A12DE]/20 focus:bg-white outline-none font-bold text-gray-700 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Budget Target</label>
                  <div className="relative">
                    <input 
                      type="number" required placeholder="0" 
                      value={formData.target} 
                      onChange={(e) => setFormData({...formData, target: e.target.value})} 
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#5A12DE]/20 focus:bg-white outline-none font-black text-gray-900 text-xl"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">IDR</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-2 tracking-widest">Saldo Awal</label>
                  <div className="relative">
                    <input 
                      type="number" placeholder="0" 
                      value={formData.current} 
                      onChange={(e) => setFormData({...formData, current: e.target.value})} 
                      className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#5A12DE]/20 focus:bg-white outline-none font-bold text-gray-600"
                    />
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">IDR</span>
                  </div>
                </div>

                <button 
                  disabled={loading} 
                  className="w-full py-5 rounded-[1.5rem] text-white font-black bg-[#5A12DE] shadow-lg shadow-[#5A12DE]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  <span>{loading ? "Menyimpan..." : editingId ? "Perbarui Target" : "Wujudkan Target"}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </aside>

          {/* --- GOALS GRID SECTION --- */}
          <main className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentData.length > 0 ? (
                currentData.map((goal) => {
                  const targetValue = parseFloat(goal.target) || 0;
                  const currentValue = parseFloat(goal.current) || 0;
                  const percentage = targetValue > 0 ? Math.min(Math.round((currentValue / targetValue) * 100), 100) : 0;
                  const isDone = percentage >= 100;

                  return (
                    <div key={goal.id} className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left relative overflow-hidden flex flex-col justify-between h-72">
                      {/* Latar Belakang Dekoratif */}
                      {isDone && <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 blur-[60px] rounded-full" />}
                      {!isDone && <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#5A12DE]/5 blur-[60px] rounded-full" />}

                      <div className="relative z-10 flex justify-between items-start">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isDone ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-50 text-[#5A12DE] group-hover:bg-[#5A12DE] group-hover:text-white group-hover:rotate-6'}`}>
                          {isDone ? <Zap size={28} fill="currentColor" /> : <Target size={28}/>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingId(goal.id); setFormData(goal); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#5A12DE] hover:bg-white hover:shadow-md transition-all"><Edit2 size={16}/></button>
                          <button onClick={() => handleDelete(goal.id)} className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white hover:shadow-md transition-all"><Trash2 size={16}/></button>
                        </div>
                      </div>

                      <div className="relative z-10 mt-6">
                        <h4 className="font-black text-gray-900 text-xl mb-1 truncate group-hover:text-[#5A12DE] transition-colors">{goal.name}</h4>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          {formatIDR(currentValue)} / {formatIDR(targetValue)}
                        </p>
                      </div>

                      <div className="relative z-10 mt-auto space-y-3">
                        <div className="flex justify-between items-end">
                          <span className={`text-[10px] font-black flex items-center gap-1.5 ${isDone ? 'text-green-600' : 'text-[#5A12DE]'}`}>
                            {isDone ? <Flame size={12} fill="currentColor"/> : <TrendingUp size={12}/>}
                            {isDone ? "MISSION ACCOMPLISHED" : `${percentage}% COLLECTED`}
                          </span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-[3px]">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out relative ${isDone ? 'bg-green-500' : 'bg-gradient-to-r from-[#5A12DE] to-[#8F79FF]'}`}
                            style={{ width: `${percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full h-80 flex flex-col items-center justify-center text-gray-300 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                  <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                    <Target size={40} className="opacity-20" />
                  </div>
                  <p className="font-bold text-gray-400">Belum ada target impian yang tercatat.</p>
                </div>
              )}
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 pt-6">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(p => p - 1)} 
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-[#5A12DE] hover:shadow-md disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={20}/>
                </button>
                <div className="px-6 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
                   <span className="text-xs font-black text-gray-900 tracking-widest uppercase">Page {currentPage} of {totalPages}</span>
                </div>
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => setCurrentPage(p => p + 1)} 
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-[#5A12DE] hover:shadow-md disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={20}/>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}