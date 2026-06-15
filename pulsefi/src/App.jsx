import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PulseFiDashboard from "./PulseFiDashboard"; 
import Transactions from "./Transactions"; 
import Goals from "./Goals";
import Profile from "./Profile";
import Insight from "./Insight";
import Streak from "./Streak";
import Mentor from "./Mentor"; 
import Login from "./Login"; 
import Register from "./Register"; 

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('pulsefi_token');
  if (!token || token === "undefined") return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><PulseFiDashboard /></ProtectedRoute>} />
        <Route path="/transaksi" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/insight" element={<ProtectedRoute><Insight /></ProtectedRoute>} />
        <Route path="/simulasi" element={<ProtectedRoute><Streak /></ProtectedRoute>} />
        <Route path="/mentor" element={<ProtectedRoute><Mentor /></ProtectedRoute>} /> 
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}