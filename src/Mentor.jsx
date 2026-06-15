import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "./components/DashboardLayout";
import { Send, Bot, User, Sparkles, Zap, Activity } from "lucide-react";
import { API_URL } from "./api";

export default function Mentor() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Halo Bosquu! Aku PulseAI Mentor. Siap bantu kamu atur strategi finansial hari ini. Ada yang mau ditanyain?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('pulsefi_token')}`
        },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "Koneksi terputus. Coba lagi ya Bosquu!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 h-screen flex flex-col items-center pt-12 pb-10 px-6 overflow-hidden">
        
        <div className="w-full max-w-4xl h-[80vh] flex flex-col bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(90,18,222,0.1)] border border-gray-100 overflow-hidden">
          
          <div className="p-7 bg-gray-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5A12DE] to-[#8F79FF] flex items-center justify-center shadow-lg shadow-[#5A12DE]/30">
                <Bot size={28} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-lg leading-none">PulseAI Mentor</h3>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active Intelligence</p>
                </div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <Sparkles size={14} className="text-yellow-400" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Gemini 2.5 Flash</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'user' ? 'bg-white text-gray-400' : 'bg-[#5A12DE] text-white'
                  }`}>
                    {msg.role === 'user' ? <User size={18} /> : <Zap size={18}/>}
                  </div>
                  
                  <div className={`p-4 rounded-[1.8rem] text-sm leading-relaxed text-left shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-[#5A12DE] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-3 items-center">
                  <div className="w-9 h-9 rounded-xl bg-[#5A12DE] text-white flex items-center justify-center shrink-0">
                    <Activity size={18} className="animate-spin" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#5A12DE] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#5A12DE] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#5A12DE] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <div className="p-8 bg-white border-t border-gray-100 shrink-0">
            <div className="flex gap-3 bg-gray-100 p-2 rounded-[2.5rem] focus-within:ring-4 focus-within:ring-[#5A12DE]/10 focus-within:bg-white transition-all duration-300">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Tanya mentor: 'Aman gak beli sepatu baru?'"
                className="flex-1 bg-transparent border-none outline-none px-5 py-2 text-sm text-gray-700 font-bold"
              />
              <button 
                onClick={sendMessage}
                disabled={loading}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  input.trim() && !loading 
                  ? 'bg-[#5A12DE] text-white shadow-lg shadow-[#5A12DE]/30 hover:scale-105 active:scale-95' 
                  : 'bg-gray-200 text-gray-400'
                }`}
              >
                <Send size={18} fill={input.trim() ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  );
}