"use client";
import { useEffect, useState } from "react";
import { Zap } from "lucide-react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true); 
      setTimeout(() => setLoading(false), 800); 
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${
        fade ? 'opacity-0 scale-105 filter blur-sm' : 'opacity-100 scale-100 filter blur-0'
      }`}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        
        @keyframes load-bar {
          0% { width: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
        .animate-load-bar { 
          animation: load-bar 1.8s cubic-bezier(0.65, 0, 0.35, 1) forwards; 
        }
        
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 15px rgba(34,211,238,0.2); }
          50% { text-shadow: 0 0 30px rgba(34,211,238,0.6); }
        }
        .glow-text { animation: pulse-glow 2s ease-in-out infinite; }
      `}} />
      
      <div className="flex items-center mb-6">
        <span className="font-syne font-extrabold text-5xl text-white tracking-tight flex items-center">
          <span>C</span>
          <span className="relative">
            <span className="text-transparent">V</span>
            <Zap size={38} strokeWidth={2.5} className="absolute inset-0 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] rotate-[-15deg] translate-y-[-4px]"/>
          </span>
          <span className="ml-1 glow-text">ision</span>
        </span>
      </div>

      <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full animate-load-bar shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
      </div>
    </div>
  );
}