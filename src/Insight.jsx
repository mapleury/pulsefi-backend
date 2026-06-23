import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { Lightbulb, Activity, PieChart } from "lucide-react";
import { API_URL } from "./api";

export default function Insight() {
  const [data, setData] = useState({ summary: { income: 0, expense: 0, savings: 0 }, categories: [] });
  const [loading, setLoading] = useState(true);

  // PERBAIKAN: Membersihkan trailing slash
  const baseUrl = API_URL.replace(/\/$/, "");

  const fetchInsights = useCallback(async () => {
    try {
      // PERBAIKAN: Menambahkan rute /api
      const res = await fetch(`${baseUrl}/api/insights`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('pulsefi_token')}` }
      });
      
      if (res.ok) {
        const d = await res.json();
        setData(d);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => { fetchInsights(); }, [fetchInsights]);

  const formatIDR = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);

  const income = data?.summary?.income || 0;
  const expense = data?.summary?.expense || 0;
  const savings = data?.summary?.savings || 0;
  const total = income + expense;
  
  const expenseAngle = total > 0 ? (expense / total) * 360 : 0;

  if (loading) return <DashboardLayout><div className="p-20 text-center font-bold text-gray-400">Syncing Intelligence...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <header className="mb-10 text-left">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Financial Insight</h2>
        <p className="text-sm text-gray-500 font-medium">Analisis mendalam detak jantung keuanganmu.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRAFIK BULAT */}
        <section className="lg:col-span-1 p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-2">
            <PieChart size={20} className="text-[#5A12DE]"/> Cashflow Ratio
          </h3>
          
          <div className="relative w-48 h-48 mb-8">
            <div 
              className="w-full h-full rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: total > 0 
                  ? `conic-gradient(#5A12DE ${360 - expenseAngle}deg, #EF4444 0deg)`
                  : '#f3f4f6' 
              }}
            >
              <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                <span className="text-[10px] font-black text-gray-400 uppercase">Saving Rate</span>
                <span className="text-xl font-black text-gray-900">
                  {income > 0 ? Math.round((savings / income) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center p-3 rounded-2xl bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#5A12DE]"></div>
                <span className="text-xs font-bold text-gray-500">Income</span>
              </div>
              <span className="text-xs font-black text-gray-900">{formatIDR(income)}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-2xl bg-gray-50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs font-bold text-gray-500">Expense</span>
              </div>
              <span className="text-xs font-black text-gray-900">{formatIDR(expense)}</span>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2 p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm text-left">
          <h3 className="text-lg font-black text-gray-800 mb-8 flex items-center gap-2">
            <Activity size={20} className="text-[#5A12DE]"/> Spending by Category
          </h3>
          
          <div className="space-y-6">
            {data?.categories?.length > 0 ? data.categories.map((cat, i) => {
              const perc = expense > 0 ? Math.round((cat.total / expense) * 100) : 0;
              return (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-700">{cat.category}</span>
                    <span className="text-gray-900">{formatIDR(cat.total)} <span className="text-gray-400 ml-1">({perc}%)</span></span>
                  </div>
                  <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#5A12DE]" style={{ width: `${perc}%` }} />
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center text-gray-400 font-bold italic border-2 border-dashed border-gray-50 rounded-3xl">
                Belum ada data pengeluaran.
              </div>
            )}
          </div>

          <div className="mt-10 p-5 rounded-3xl bg-gray-900 text-white flex items-start gap-4">
            <Lightbulb className="text-yellow-400 shrink-0" size={24} />
            <div>
              <p className="text-sm font-bold mb-1">PulseFi Intelligence</p>
              <p className="text-xs text-gray-400 leading-relaxed">
                {savings < 0 
                  ? "Bahaya! Pengeluaranmu lebih besar dari pendapatan. Ayo hemat!" 
                  : "Kondisi keuangan stabil. Terus pantau pengeluaran kategorimu."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}