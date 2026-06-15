import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LifeSimulation = ({ monthlySaving = 0 }) => {
  const formatInternal = (num) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      maximumFractionDigits: 0 
    }).format(num || 0);
  };

  const formatJutaan = (value) => {
    return `Rp ${(value / 1000000).toFixed(1)}Jt`;
  };

  const generateData = () => {
    const data = [];
    let betterYou = 0;
    let chaosYou = 0;
    let currentYou = 0;
    const saving = parseFloat(monthlySaving) || 0;

    for (let month = 1; month <= 6; month++) {
      betterYou += saving * 1.5;
      chaosYou += saving * 0.4;
      currentYou += saving;

      data.push({
        name: `Bln ${month}`,
        'Better You ✨': Math.round(betterYou),
        'Current You ⚖️': Math.round(currentYou),
        'Chaos You 📉': Math.round(chaosYou),
      });
    }
    return data;
  };

  const data = generateData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-full rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-sm flex flex-col"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Alternate Life Mode</h2>
          <p className="text-gray-400 font-medium italic mt-1 text-sm">"Satu keputusan, ribuan masa depan."</p>
        </div>
        <div className="text-left md:text-right bg-gray-50 p-4 rounded-2xl">
          <p className="text-[10px] font-black text-[#5A12DE] uppercase tracking-widest">Estimasi Tabungan</p>
          <p className="text-lg font-black text-gray-900">{formatJutaan(monthlySaving)}/bln</p>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tickFormatter={formatJutaan} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} width={60} />
            <Tooltip
              contentStyle={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(value) => formatInternal(value)}
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }} />
            <Line type="monotone" dataKey="Better You ✨" stroke="#5A12DE" strokeWidth={4} dot={{ r: 4, fill: '#5A12DE' }} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Current You ⚖️" stroke="#60a5fa" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey="Chaos You 📉" stroke="#f87171" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 p-6 rounded-3xl bg-gradient-to-br from-[#5A12DE] to-[#8F79FF] text-white text-left relative overflow-hidden group">
        <div className="relative z-10">
          <p className="text-lg font-bold leading-tight">
            Disiplin +50% membuat dana daruratmu terkumpul <span className="text-yellow-300 underline decoration-2">3x lebih cepat!</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default LifeSimulation;