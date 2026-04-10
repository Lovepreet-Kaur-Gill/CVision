"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useEffect, useState } from "react";
import SoftAurora from "@/components/SoftAurora";

export default function SignUpPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#020308] overflow-y-auto transition-colors duration-300">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@700;800;900&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }

        /* Neon Glow Animation for the Logo text */
        @keyframes pulse-glow {
          0%, 100% { text-shadow: 0 0 15px rgba(34,211,238,0.4); }
          50% { text-shadow: 0 0 30px rgba(34,211,238,0.8); }
        }
        .glow-text { animation: pulse-glow 2.5s ease-in-out infinite; }

        /* Smooth Reveal */
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

        /* HIDE CLERK DEV BADGE */
        .cl-development-mode-badge, [data-development-mode] { display: none !important; }

        /* DEEP CLERK CSS OVERRIDES FOR GLASS EFFECT - HIGH BLUR 40px */
        .cl-card {
          background: rgba(8, 8, 12, 0.6) !important;
          backdrop-filter: blur(40px) !important;     
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 0 60px rgba(0, 0, 0, 0.7), inset 0 0 20px rgba(255, 255, 255, 0.01) !important;
          border-radius: 1.75rem !important;
        }
        
        .cl-headerTitle, .cl-headerSubtitle { color: #ffffff !important; font-family: 'Syne', sans-serif !important; }
        .cl-headerSubtitle { color: #cbd5e1 !important; font-weight: 500 !important; }

        .cl-socialButtonsBlockButton {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.08) !important;
          border-radius: 1rem !important;
          transition: all 0.3s ease !important;
        }
        .cl-socialButtonsBlockButtonText { color: #e2e8f0 !important; font-weight: 600 !important; }

        .cl-formFieldInput {
          background: rgba(0, 0, 0, 0.2) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          border-radius: 0.75rem !important;
        }
        
        .cl-formButtonPrimary {
          background: linear-gradient(135deg, #00f2fe 0%, #4facfe 50%, #a855f7 100%) !important;
          color: white !important;
          border-radius: 1rem !important;
          font-weight: bold !important;
        }

        .cl-footer { background: transparent !important; border-top: 1px solid rgba(255,255,255,0.05) !important; }
        .cl-dividerLine { background: rgba(255,255,255,0.1) !important; }
        .cl-footerActionLink { color: #22d3ee !important; }
      `}} />

      {/* ══ BACKGROUND EFFECTS ══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 opacity-40">
          <SoftAurora speed={0.4} scale={1.5} brightness={1.0} color1="#a855f7" color2="#00f2fe" />
        </div>
        <div 
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            backgroundPosition: "center center",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)"
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020308_85%)]" />
      </div>

      {/* ══ CONTENT ══ */}
      <div className="relative z-10 min-h-full flex flex-col items-center justify-center py-12 px-6 animate-fade-up">

        {/* ── Branding ── */}
        <div className="mb-10 flex flex-col items-center text-center">
          
          <div className="relative flex items-center justify-center w-24 h-24 mb-6 group cursor-default">
            <div className="absolute inset-0 bg-cyan-500/20 blur-[30px] rounded-full group-hover:bg-cyan-500/40 transition-all duration-700"></div>
            <div className="relative z-10 flex items-center justify-center w-full h-full text-white font-syne font-black text-6xl tracking-tighter">
               <span className="translate-x-[8px] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">C</span>
               <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-500 -translate-x-[8px] drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] mix-blend-lighten">V</span>
            </div>
          </div>
          
          <h1 className="font-syne font-extrabold text-3xl text-white tracking-tight">
            Join <span className="glow-text text-cyan-400">CVision</span>
          </h1>
          <p className="mt-2 text-xs font-bold text-slate-400 tracking-widest uppercase">
            Create an account to build your future
          </p>
        </div>

        {/* ── Clerk SignUp ── */}
        <div className="w-full max-w-md">
          <SignUp
            appearance={{
              baseTheme: dark,
              layout: {
                socialButtonsPlacement: "top",
                logoPlacement: "none", 
              },
              elements: {
                rootBox: "w-full",
              },
            }}
          />
        </div>

        {/* Bottom Tag */}
        <p className="text-[10px] mt-10 text-slate-700 font-bold uppercase tracking-widest text-center">
          Secured by Clerk • Quantum Encryption Enabled
        </p>
      </div>
    </div>
  );
}