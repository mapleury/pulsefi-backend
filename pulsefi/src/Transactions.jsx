import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { 
  Plus, Search, Tag, Edit2, Trash2, ChevronLeft, ChevronRight 
} from "lucide-react";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({ amount: "", category: "Food/Hustle", type: "expense", description: "" });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Filtering & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const categories = ["Food/Hustle", "Subscriptions", "Self-Care", "Transport", "Entertainment", "Fixed Needs"];

  const getCategoryIcon = (cat) => {
    const icons = {
      "Food/Hustle": "☕",
      "Subscriptions": "💳",
      "Self-Care": "🧼",
      "Transport": "🚗",
      "Entertainment": "🎮",
      "Fixed Needs": "🏠"
    };
    return icons[cat] || "✨";
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/transactions');
      const data = await res.json();
      if (Array.isArray(data)) setTransactions(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || t.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, filterCategory]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const currentData = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `http://localhost:3000/api/transactions/${editingId}` : 'http://localhost:3000/api/transactions';
    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) }),
      });
      if (res.ok) { resetForm(); fetchTransactions(); }
    } catch (err) { alert("Backend offline?"); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus transaksi?")) return;
    const res = await fetch(`http://localhost:3000/api/transactions/${id}`, { method: 'DELETE' });
    if (res.ok) fetchTransactions();
  };

  const resetForm = () => {
    setFormData({ amount: "", category: "Food/Hustle", type: "expense", description: "" });
    setEditingId(null);
  };

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

  return (
    <DashboardLayout>
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Data Transaksi</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Monitoring your cashflow pulse.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search description..." 
              className="pl-10 pr-4 py-2 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#5A12DE]/20 outline-none w-64 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none text-sm font-bold text-gray-600 cursor-pointer"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
      <section className="lg:col-span-1">
  <div className="p-8 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(90,18,222,0.06)] sticky top-0 transition-all duration-500">
    <h3 className="text-xl font-extrabold mb-6 flex items-center gap-2 text-gray-800 tracking-tight">
              {editingId ? <Edit2 className="text-[#5A12DE]" size={20} /> : <Plus className="text-[#5A12DE]" size={20} />}
              {editingId ? "Update Data" : "New Transaction"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input 
                  type="number" 
                  required 
                  placeholder="0" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                className="w-full px-5 py-2 rounded-2xl bg-white/50 border border-gray-100 focus:border-[#8F79FF]/50 focus:ring-4 focus:ring-[#5A12DE]/5 outline-none text-2xl font-extrabold text-gray-900 transition-all placeholder:text-gray-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">IDR</span>
              </div>

           <div className="grid grid-cols-2 gap-3">
          
{/* Income Button */}
<button 
  type="button" 
  onClick={() => setFormData({...formData, type: 'income'})} 
  className={`
    flex items-center justify-center gap-2 py-1 px-4 min-h-[56px] rounded-xl font-extrabold text-base transition-all duration-300 border w-full
    ${formData.type === 'income' 
      ? 'bg-[#D1E7D1] text-[#3A5A40] shadow-[0_8px_20px_rgba(58,90,64,0.15)] scale-[1.02] border-[#A3C9A8]' 
      : 'bg-white/40 backdrop-blur-md border-gray-200 text-gray-400 hover:bg-white/60 hover:text-gray-600 hover:-translate-y-0.5'
    }
  `}
>
  <div className={`
    flex items-center justify-center w-6 h-6 rounded-full shrink-0
    ${formData.type === 'income' ? 'bg-[#3A5A40] text-white' : 'bg-gray-200 text-gray-400'}
  `}>
    <Plus size={14} strokeWidth={3} />
  </div>
  <span className="tracking-tight flex-1 text-center">
    Income
  </span>
</button>

{/* Expense Button */}
<button 
  type="button" 
  onClick={() => setFormData({...formData, type: 'expense'})} 
  className={`
    flex items-center justify-center gap-2 py-2 px-4 min-h-[56px] rounded-xl font-extrabold text-base transition-all duration-300 border w-full
    ${formData.type === 'expense' 
      ? 'bg-[#FAD2D2] text-[#A63D40] shadow-[0_8px_20px_rgba(166,61,64,0.15)] scale-[1.02] border-[#E8A5A5]' 
      : 'bg-white/40 backdrop-blur-md border-gray-200 text-gray-400 hover:bg-white/60 hover:text-gray-600 hover:-translate-y-0.5'
    }
  `}
>
  <div className={`
    flex items-center justify-center w-6 h-6 rounded-full shrink-0
    ${formData.type === 'expense' ? 'bg-[#A63D40] text-white' : 'bg-gray-200 text-gray-400'}
  `}>
    <div className="w-3 h-[3px] bg-current rounded-full" />
  </div>
  <span className="tracking-tight flex-1 text-center">
    Expense
  </span>
</button>

              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                 className="w-full px-4 py-3 rounded-xl bg-white/50 border border-gray-100 outline-none focus:border-[#8F79FF]/50 focus:ring-4 focus:ring-[#5A12DE]/5 font-semibold text-gray-700 transition-all"
                >
                  {categories.map(cat => <option key={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Description</label>
                <textarea 
                  placeholder="What was this for?..." 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50/50 border border-gray-100 h-24 resize-none outline-none focus:ring-2 focus:ring-[#5A12DE]/20 transition-all" 
                />
              </div>

              <button 
                disabled={loading} 
                className="w-full py-4 rounded-2xl text-white font-black bg-gradient-to-r from-[#5A12DE] to-[#8F79FF] shadow-lg shadow-[#5A12DE]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? "Syncing..." : "Save Record"}
              </button>
              
              {editingId && (
                <button 
                  type="button"
                  onClick={resetForm}
                  className="w-full py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          </div>
        </section>

        {/* Transactions List Section */}
        <section className="lg:col-span-2 space-y-4">
          {currentData.length > 0 ? (
           currentData.map((t) => (
  <div 
    key={t.id} 
    className="group p-4 rounded-2xl bg-white/70 backdrop-blur-md border border-[#8F79FF]/40 shadow-[0_4px_20px_rgba(90,18,222,0.04)] hover:bg-white/95 hover:-translate-y-1 hover:border-[#8F79FF]/60 hover:shadow-[0_12px_40px_rgba(90,18,222,0.15)] transition-all duration-300 flex items-center justify-between"
  >
    <div className="flex items-center gap-4">
      {/* Icon with increased visibility */}
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-500">
        {getCategoryIcon(t.category)}
      </div>
      
      <div>
        {/* Bigger Description/Title */}
        <p className="font-extrabold text-gray-900 text-lg tracking-tight leading-tight mb-1.5">
          {t.description || "Untitled Transaction"}
        </p>
        <div className="flex items-center gap-2">
          {/* Small, light category tag */}
          <span className="text-[9px] font-semibold text-[#8F79FF] uppercase tracking-wider bg-[#8F79FF]/10 px-2 py-0.5 rounded-md">
            {t.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
          
          {/* Custom Date & Time Format: 4:15 Am at March 15 2025 */}
          <span className="text-[11px] text-gray-400 font-medium">
            {new Date(t.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} at {new Date(t.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>
    </div>

    {/* Actions and Amount section (Actions moved to the left of the amount) */}
    <div className="flex items-center gap-5">
      
      {/* Action buttons (Slightly hover up, no side animation) */}
      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
        <button 
          onClick={() => { setEditingId(t.id); setFormData(t); }} 
          className="p-2.5 rounded-xl text-gray-400 hover:text-[#5A12DE] hover:bg-[#5A12DE]/5 transition-all"
        >
          <Edit2 size={16}/>
        </button>
        <button 
          onClick={() => handleDelete(t.id)} 
          className="p-2.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <Trash2 size={16}/>
        </button>
      </div>

      {/* Amount and Verification status */}
      <div className="text-right min-w-[110px]">
        <p className={`text-xl font-extrabold tracking-tight ${t.type === 'income' ? 'text-green-500' : 'text-gray-950'}`}>
          {t.type === 'income' ? '+' : '-'} {formatIDR(t.amount).replace('Rp', '').trim()}
        </p>
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-0.5">Verified</p>
      </div>
    </div>
  </div>
))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 bg-white/40 border-2 border-dashed border-gray-200 rounded-3xl">
              <Search size={40} className="mb-2 opacity-20" />
              <p className="font-bold">No transactions found</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-6 mt-8">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => p - 1)} 
                className="p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:text-[#5A12DE] hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
              >
                <ChevronLeft size={20}/>
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#5A12DE] bg-[#5A12DE]/10 px-3 py-1 rounded-full uppercase tracking-tighter">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => p + 1)} 
                className="p-3 rounded-full bg-white border border-gray-100 shadow-sm hover:text-[#5A12DE] hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none transition-all"
              >
                <ChevronRight size={20}/>
              </button>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}