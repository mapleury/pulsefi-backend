import React, { useState, useEffect, useMemo, useCallback } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { 
  Plus, Search, Tag, Edit2, Trash2, ChevronLeft, ChevronRight, X
} from "lucide-react";
import { API_URL } from "./api";

const getCategoryIcon = (cat) => {
  const icons = {
    "Food/Hustle": "☕",
    "Subscriptions": "💳",
    "Self-Care": "🧼",
    "Transport": "🚗",
    "Entertainment": "🎮",
    "Fixed Needs": "🏠"
  };
  return icons[cat] || "🏷️";
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]); 
  const [categories, setCategories] = useState([
    "Food/Hustle", "Subscriptions", "Self-Care", "Transport", "Entertainment", "Fixed Needs"
  ]);
  
  const [formData, setFormData] = useState({ 
    amount: "", 
    category: "Food/Hustle", 
    category_type: "primary",
    type: "expense", 
    description: "" 
  });

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", type: "primary" });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const getAuthHeader = () => ({
    'Authorization': `Bearer ${localStorage.getItem('pulsefi_token')}`,
    'Content-Type': 'application/json'
  });

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/transactions`, { headers: getAuthHeader() });
      if (res.status === 401) { window.location.href = "/login"; return; }
      const data = await res.json();
      if (Array.isArray(data)) setTransactions(data);
    } catch (err) { console.error("Fetch error:", err); }
  }, []);

  const fetchGoals = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/goals`, { headers: getAuthHeader() });
      const data = await res.json();
      if (Array.isArray(data)) setGoals(data);
    } catch (err) { console.error("Error fetching goals:", err); }
  }, []);

  useEffect(() => { 
    fetchTransactions(); 
    fetchGoals();
  }, [fetchTransactions, fetchGoals]);

  useEffect(() => {
    if (!editingId) { 
      if (formData.type === 'income') {
        setFormData(prev => ({ ...prev, category: 'General Income', category_type: 'primary' }));
      } else {
        setFormData(prev => ({ ...prev, category: 'Food/Hustle', category_type: 'primary' }));
      }
    }
  }, [formData.type, editingId]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCat.name.trim() === "") return;
    const formattedName = newCat.name.trim();
    if (!categories.includes(formattedName)) {
      setCategories(prev => [...prev, formattedName]);
    }
    setFormData(prev => ({ ...prev, category: formattedName, category_type: newCat.type }));
    setNewCat({ name: "", type: "primary" });
    setIsModalOpen(false);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || t.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [transactions, searchTerm, filterCategory]);

  const currentData = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const url = editingId ? `${API_URL}/transactions/${editingId}` : `${API_URL}/transactions`;
    try {
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ ...formData, amount: parseFloat(formData.amount) }),
      });
      if (res.ok) { resetForm(); fetchTransactions(); fetchGoals(); }
    } catch (err) { alert("Error saving data"); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus transaksi?")) return;
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`, { 
        method: 'DELETE', headers: getAuthHeader() 
      });
      if (res.ok) { fetchTransactions(); fetchGoals(); }
    } catch (err) { alert("Gagal menghapus"); }
  };

  const resetForm = () => {
    setFormData({ amount: "", category: "Food/Hustle", category_type: "primary", type: "expense", description: "" });
    setEditingId(null);
  };

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

  return (
    <DashboardLayout>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="text-left">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Transaksi Kamu</h2>
          <p className="text-sm text-gray-500 font-medium mt-1">Kelola pemasukan dan pengeluaran pribadimu.</p>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Cari..." 
              className="pl-10 pr-4 py-2 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none w-64"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 rounded-2xl bg-white border border-gray-100 shadow-sm outline-none text-sm font-bold text-gray-600"
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">Semua Kategori</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-1">
          <div className="p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm sticky top-8 text-left">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2">
              {editingId ? <Edit2 className="text-[#5A12DE]" size={20} /> : <Plus className="text-[#5A12DE]" size={20} />}
              {editingId ? "Edit Transaksi" : "Tambah Baru"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <input 
                  type="number" required placeholder="0" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({...formData, amount: e.target.value})} 
                  className="w-full px-5 py-3 rounded-2xl bg-gray-50 border-none outline-none text-2xl font-black text-gray-900"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">IDR</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" onClick={() => setFormData({...formData, type: 'income'})} 
                  className={`py-3 rounded-xl font-bold transition-all ${formData.type === 'income' ? 'bg-green-100 text-green-600 border-2 border-green-200' : 'bg-gray-50 text-gray-400'}`}
                > Income </button>
                <button 
                  type="button" onClick={() => setFormData({...formData, type: 'expense'})} 
                  className={`py-3 rounded-xl font-bold transition-all ${formData.type === 'expense' ? 'bg-red-100 text-red-600 border-2 border-red-200' : 'bg-gray-50 text-gray-400'}`}
                > Expense </button>
              </div>

              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase text-gray-400">
                    {formData.type === 'income' ? 'Allocate to Goal' : 'Category'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.type === 'income') alert("Gunakan menu Goals untuk membuat target baru!");
                      else setIsModalOpen(true);
                    }}
                    className="text-[10px] font-bold text-[#5A12DE] hover:text-[#8F79FF]"
                  >
                    {formData.type === 'income' ? '+ NEW GOAL' : '+ ADD NEW'}
                  </button>
                </div>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none font-bold text-gray-700"
                >
                  {formData.type === 'income' ? (
                    <>
                      <option value="General Income">General Income (No Goal)</option>
                      {goals.map(goal => (
                        <option key={goal.id} value={goal.name}>{goal.name}</option>
                      ))}
                    </>
                  ) : (
                    categories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  )}
                </select>
              </div>

              <textarea 
                placeholder="Deskripsi..." value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 h-24 resize-none outline-none font-medium"
              />

              <button 
                disabled={loading} 
                className="w-full py-4 rounded-2xl text-white font-black bg-[#5A12DE] shadow-lg shadow-[#5A12DE]/20 hover:scale-[1.02] transition-all"
              >
                {loading ? "Menyimpan..." : "Simpan Transaksi"}
              </button>
            </form>
          </div>
        </section>

        <section className="lg:col-span-2 space-y-4">
          {currentData.length > 0 ? (
            currentData.map((t) => (
              <div key={t.id} className="group p-5 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl">
                    {getCategoryIcon(t.category)}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 text-lg leading-tight">{t.description || "Tanpa Judul"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-[#5A12DE] bg-[#5A12DE]/5 px-2 py-0.5 rounded uppercase">{t.category}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`text-xl font-black ${t.type === 'income' ? 'text-green-500' : 'text-gray-900'}`}>
                      {t.type === 'income' ? '+' : '-'} {formatIDR(t.amount).replace('Rp', '').trim()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingId(t.id); setFormData(t); }} className="p-2 text-gray-300 hover:text-[#5A12DE]"><Edit2 size={18}/></button>
                    <button onClick={() => handleDelete(t.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-300 bg-white rounded-[2rem] border-2 border-dashed">
              <p className="font-bold">Belum ada transaksi</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 rounded-full bg-white border border-gray-100 disabled:opacity-30"><ChevronLeft size={18}/></button>
              <span className="text-[10px] font-black text-[#5A12DE]">Hal {currentPage} dari {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 rounded-full bg-white border border-gray-100 disabled:opacity-30"><ChevronRight size={18}/></button>
            </div>
          )}
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative text-left">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X /></button>
            <h3 className="text-2xl font-black mb-6">Kategori Baru</h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nama Kategori</label>
                <input 
                  value={newCat.name} 
                  onChange={(e) => setNewCat({...newCat, name: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#5A12DE] font-bold"
                  placeholder="Contoh: Skin Care"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Tipe</label>
                <select 
                  value={newCat.type} 
                  onChange={(e) => setNewCat({...newCat, type: e.target.value})}
                  className="w-full px-5 py-3 rounded-xl bg-gray-50 outline-none font-bold"
                >
                  <option value="primary">Needs (Penting)</option>
                  <option value="wants">Wants (Lifestyle)</option>
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-[#5A12DE] text-white rounded-2xl font-black shadow-lg shadow-[#5A12DE]/20">Tambah Kategori</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}