import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PulseFiDashboard from "./PulseFiDashboard"; 
import Transactions from "./Transactions"; 
import Goals from "./Goals"; // 1. Import your new Goals component

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<PulseFiDashboard />} />
        
        {/* Transactions */}
        <Route path="/transaksi" element={<Transactions />} />
        
        {/* 2. Add the Goals Route - Path must match sidebar 'to="/goals"' */}
        <Route path="/goals" element={<Goals />} />
        
        {/* Fallback: If page not found, go back to Dashboard */}
        <Route path="*" element={<PulseFiDashboard />} />
      </Routes>
    </Router>
  );
}