import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { 
  Plus, Search, Target, Edit2, Trash2, ChevronLeft, ChevronRight, TrendingUp, Zap
} from "lucide-react";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [formData, setFormData] = useState({ name: "", target: "", current: 0 });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchGoals = async () => {
    try {
      const res = await fetch('http://127.0.0.1:3000/api/goals');
      const data = await res.json();
      if (Array.isArray(data)) setGoals(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const filteredGoals = useMemo(() => {
    return goals.filter(g => g.name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [goals, searchTerm]);

  const totalPages = Math.ceil(filteredGoals.length / itemsPerPage);
  const currentData = filteredGoals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

 // --- Inside Goals.jsx ---

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Standardize to 127.0.0.1 to match your fetchGoals
    const baseUrl = 'http://127.0.0.1:3000/api/goals';
    const url = editingId ? `${baseUrl}/${editingId}` : baseUrl;
    
    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            name: formData.name, 
            target: parseFloat(formData.target),
            current: parseFloat(formData.current || 0)
        }),
      });
      if (res.ok) { 
        resetForm(); 
        fetchGoals(); 
      } else {
        const errorData = await res.json();
        console.error("Server Error Detail:", errorData);
      }
    } catch (err) { 
      alert("Server connection failed"); 
    } finally { 
      setLoading(false); 
    }
};

const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    // Standardize to 127.0.0.1
    const res = await fetch(`http://127.0.0.1:3000/api/goals/${id}`, { method: 'DELETE' });
    if (res.ok) fetchGoals();
};

  const resetForm = () => {
    setFormData({ name: "", target: "", current: 0 });
    setEditingId(null);
  };

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Financial Goals</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Manifesting your future, one pulse at a time.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search goals..." 
            className="pl-10 pr-4 py-2 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#5A12DE]/20 outline-none w-64 transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <section className="lg:col-span-1">
          <div className="p-8 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(90,18,222,0.06)] sticky top-8">
            <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2 text-gray-800 tracking-tight">
              {editingId ? <Edit2 className="text-[#5A12DE]" size={20} /> : <Target className="text-[#5A12DE]" size={20} />}
              {editingId ? "Modify Goal" : "Set New Goal"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Goal Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. New MacBook Pro" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-5 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-[#8F79FF]/50 focus:ring-4 focus:ring-[#5A12DE]/5 outline-none font-bold text-gray-700 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Target Amount</label>
                <div className="relative">
                  <input 
                    type="number" 
                    required 
                    placeholder="0" 
                    value={formData.target} 
                    onChange={(e) => setFormData({...formData, target: e.target.value})} 
                    className="w-full px-5 py-3 rounded-xl bg-white/50 border border-gray-100 focus:border-[#8F79FF]/50 focus:ring-4 focus:ring-[#5A12DE]/5 outline-none font-extrabold text-gray-900 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">IDR</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Current Saved</label>
                <div className="relative">
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={formData.current} 
                    onChange={(e) => setFormData({...formData, current: e.target.value})} 
                    className="w-full px-5 py-3 rounded-xl bg-gray-50/50 border border-gray-100 outline-none font-bold text-gray-600 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">IDR</span>
                </div>
              </div>

              <button 
                disabled={loading} 
                className="w-full py-4 rounded-2xl text-white font-black bg-gradient-to-r from-[#5A12DE] to-[#8F79FF] shadow-lg shadow-[#5A12DE]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                {loading ? "Locking in..." : "Save Goal"}
              </button>
              
              {editingId && (
                <button type="button" onClick={resetForm} className="w-full py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </section>

        {/* Goals Grid Section */}
        <section className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentData.length > 0 ? (
              currentData.map((goal) => {
                const percentage = Math.min(Math.round((goal.current / goal.target) * 100), 100);
                return (
                  <div key={goal.id} className="group p-6 rounded-[2rem] bg-white/70 backdrop-blur-md border border-[#8F79FF]/20 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#5A12DE]/5 flex items-center justify-center text-[#5A12DE]">
                        {percentage >= 100 ? <Zap size={24} fill="currentColor"/> : <TrendingUp size={24}/>}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingId(goal.id); setFormData(goal); }} className="p-2 rounded-lg hover:bg-[#5A12DE]/5 text-gray-400 hover:text-[#5A12DE] transition-all"><Edit2 size={14}/></button>
                        <button onClick={() => handleDelete(goal.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"><Trash2 size={14}/></button>
                      </div>
                    </div>

                    <h4 className="font-black text-gray-900 text-lg mb-1 truncate">{goal.name}</h4>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                      {formatIDR(goal.current)} / {formatIDR(goal.target)}
                    </p>

                    {/* Progress Bar Container */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-[#5A12DE]">{percentage}% Complete</span>
                      </div>
                      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#5A12DE] to-[#8F79FF] transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(90,18,222,0.3)]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full h-64 flex flex-col items-center justify-center text-gray-400 bg-white/40 border-2 border-dashed border-gray-200 rounded-[2rem]">
                <Target size={40} className="mb-2 opacity-20" />
                <p className="font-bold text-sm">No financial goals set yet.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-full bg-white border border-gray-100 disabled:opacity-30"><ChevronLeft size={18}/></button>
              <span className="text-[10px] font-black uppercase text-[#5A12DE]">Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-full bg-white border border-gray-100 disabled:opacity-30"><ChevronRight size={18}/></button>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}