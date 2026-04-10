"use client";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { 
  UploadCloud, FileText, CheckCircle, AlertCircle, 
  TrendingUp, Loader2, Briefcase, Zap, Search, Target 
} from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import SoftAurora from "@/components/SoftAurora"; 

export default function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 5 * 1024 * 1024; 
      if (selectedFile.size > maxSize) {
        setError("File is too heavy! Please upload a PDF under 5MB.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#A78BFA"; 
    if (score >= 60) return "#f59e0b";
    return "#ef4444"; // Red
  };

  return (
    <div className="w-full text-slate-100 font-inter pb-10 relative overflow-hidden bg-black">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@700;800;900&display=swap');
        
        /* Font Utilities */
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }

        /* Smooth Staggered Animation (Fade + SlideUp) */
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }

        .animate-reveal { opacity: 0; animation: revealUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }

        @keyframes float-tilt {
          0%, 100% { transform: translateY(0px) rotate(-3deg); filter: hue-rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); filter: hue-rotate(30deg); }
        }
        .animate-tilt {
          display: inline-block;
          animation: float-tilt 5s ease-in-out infinite;
          transform-origin: center center;
        }

        @keyframes gradientShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .text-gradient-cvision {
          background: linear-gradient(to right, #00f2fe, #4facfe, #a18cd1, #fbc2eb, #00f2fe);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          animation: gradientShine 4s linear infinite;
        }

        .btn-mesh-action {
          background: linear-gradient(110deg, #32402e 0%, #5c3038 50%, #302645 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          position: relative; overflow: hidden;
        }
        .btn-mesh-action:hover {
          background: linear-gradient(110deg, #41523c 0%, #753b46 50%, #40325c 100%);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }
        
        .btn-mesh-glass {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
        }
        .btn-mesh-glass:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }

        .glass-card {
          background: rgba(15, 15, 20, 0.5);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        }
      `}} />

      <div className="fixed inset-0 w-full h-full z-0 opacity-50">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1.0}
          color1="#e100ff" 
          color2="#00f2fe" 
          noiseFrequency={2.5}
          bandSpread={1.3}
          enableMouseInteraction={true}
          mouseInfluence={0.2}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black pointer-events-none"></div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10 space-y-24 md:space-y-32">
        
        <section className="text-center pt-10 flex flex-col items-center">
          <div className="animate-reveal inline-flex bg-white/5 border border-white/10 text-cyan-300 px-5 py-2 rounded-full text-xs font-semibold mb-8 backdrop-blur-md tracking-wider uppercase">
            Your Premium Career Sync Catalyst
          </div>
          
          <h1 className="animate-reveal delay-100 font-syne text-6xl md:text-8xl lg:text-[8.5rem] font-black tracking-[-0.04em] leading-[1.1] flex flex-col items-center">
            <span className="text-white text-4xl md:text-6xl mb-2 drop-shadow-lg">Build the Future with</span>
            <span className="animate-tilt text-gradient-cvision drop-shadow-[0_0_30px_rgba(79,172,254,0.4)] px-4">
              CVision
            </span>
          </h1>
          
          <p className="animate-reveal delay-200 text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mt-8 font-medium">
            Score your existing resume against industry benchmarks instantly, or use our premium builder to create a new one from scratch.
          </p>

          <div className="animate-reveal delay-300 flex flex-wrap items-center justify-center gap-5 mt-12">
            <SignedOut>
              <Link href="/sign-in" className="btn-mesh-action flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-lg text-white transition-all hover:scale-[1.03]">
                <Zap size={18} /> New Resume 
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/templates" className="btn-mesh-action flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-lg text-white transition-all hover:scale-[1.03]">
                <Zap size={18} /> New Resume 
              </Link>
            </SignedIn>
            <a href="#analyzer" className="btn-mesh-glass flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-lg text-slate-200 transition-all">
              <Search size={18} /> Score Existing Resume
            </a>
          </div>
        </section>

        {/* ATS ANALYZER  */}
        <section id="analyzer" className="animate-reveal delay-400 max-w-2xl mx-auto glass-card p-10 md:p-12 rounded-[2.5rem]">
          <div className="text-center space-y-3 mb-12">
            <h2 className="font-syne text-4xl md:text-5xl font-bold tracking-[-0.03em] text-white">
              Resume Structural <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Scan</span>
            </h2>
            <p className="text-slate-400 font-medium text-base">
              Upload your PDF below. Get instant AI insights & structural feedback.
            </p>
          </div>

          {/*  Upload Zone */}
          <div className={`mt-8 p-3 rounded-2xl border ${file ? 'border-cyan-500/40 bg-cyan-950/20' : 'border-slate-800 bg-white/5'} transition-all`}>
            <div className={`border-2 border-dashed ${file ? 'border-cyan-500/60 bg-cyan-950/20' : 'border-slate-700 hover:border-cyan-500/50'} rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer`}>
              {file ? (
                <FileText size={48} className="text-cyan-400 mb-5 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
              ) : (
                <UploadCloud size={48} className="text-slate-500 mb-5" />
              )}
              
              <input type="file" id="resume-upload" accept=".pdf" onChange={handleFileChange} className="hidden" />
              <label htmlFor="resume-upload" className="cursor-pointer font-semibold text-cyan-400 hover:text-cyan-300 text-lg transition-colors">
                {file ? file.name : "Browse PDF File"}
              </label>
              <p className="text-slate-500 text-sm mt-2 font-medium">Max 5MB • Conditional Scan</p>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="w-full mt-8">
            <SignedIn>
              <button onClick={handleUpload} disabled={loading || !file} className={`w-full py-4 rounded-full font-semibold text-lg text-white transition-all ${ loading || !file ? "bg-white/5 border border-white/10 cursor-not-allowed text-slate-500" : "btn-mesh-action hover:scale-[1.01]" }`}>
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> Synchronizing...</span> : "Generate Structural Insights"}
              </button>
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in?redirect_url=/" className={`w-full block py-4 rounded-full text-center font-semibold text-lg text-white transition-all ${ !file ? "bg-white/5 border border-white/10 pointer-events-none text-slate-500" : "btn-mesh-action hover:scale-[1.01] animate-pulse" }`}>
                {!file ? "Upload PDF First" : "Sign in to Scan Resume 🚀"}
              </Link>
            </SignedOut>
          </div>
          
          {error && <div className="text-red-400 bg-red-950/30 border border-red-500/20 p-4 rounded-xl text-sm font-medium mt-6 text-center">{error}</div>}
        </section>

        {/* CONDITIONALLY RENDER RESULTS */}
        {result && (
          <section className="animate-reveal delay-200 space-y-10 md:space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
               <Target size={40} className="text-cyan-400 mx-auto drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
               <h2 className="font-syne text-5xl font-bold tracking-[-0.03em] text-white">Structural Sync <span className="text-cyan-400">Report</span></h2>
               <p className="text-slate-400 font-medium">Below is the breakdown of your resume structure against standard industry formats.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
              {/* Pie Chart Card */}
              <div className="glass-card p-10 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden h-full">
                <h3 className="text-xl font-semibold text-slate-200 mb-2">Overall Score</h3>
                <div className="w-full h-40 relative">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={[{ value: result.score }, { value: 100 - result.score }]} cx="50%" cy="50%" innerRadius={55} outerRadius={70} startAngle={180} endAngle={0} dataKey="value" stroke="none">
                        <Cell fill={getScoreColor(result.score)} cornerRadius={99}/>
                        <Cell fill="#111827" cornerRadius={99}/>
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                    <span className="text-5xl font-extrabold text-white tracking-tight">{result.score}</span>
                    <span className="text-xs text-slate-500 uppercase font-semibold">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Summary Card */}
              <div className="glass-card p-10 rounded-[2rem] md:col-span-2 space-y-6 h-full">
                <div className="flex items-center gap-3">
                   <div className="text-cyan-400 bg-cyan-950/40 p-3 rounded-xl border border-cyan-500/20"><Briefcase size={22} /></div>
                   <h3 className="text-2xl font-semibold text-white">Sync Summary</h3>
                </div>
                <p className="text-slate-300 leading-relaxed font-medium">{result.summary}</p>
              </div>
            </div>

            {/* Lists Section */}
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Strengths */}
              <div className="glass-card p-10 rounded-[2rem] border-l-4 border-l-green-500">
                <div className="flex items-center gap-3 mb-8">
                  <CheckCircle size={24} className="text-green-400" />
                  <h3 className="text-2xl font-semibold text-white">Sync Strengths</h3>
                </div>
                <ul className="space-y-4">
                  {result.strengths?.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0 box-shadow-[0_0_8px_rgba(34,197,94,1)]"></span>
                      <span className="text-slate-300 leading-relaxed text-base font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="glass-card p-10 rounded-[2rem] border-l-4 border-l-red-500">
                <div className="flex items-center gap-3 mb-8">
                  <AlertCircle size={24} className="text-red-400" />
                  <h3 className="text-2xl font-semibold text-white">Areas to Target</h3>
                </div>
                <ul className="space-y-4">
                  {result.weaknesses?.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                      <span className="text-slate-300 leading-relaxed text-base font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improvement Section */}
            <div className="glass-card p-10 rounded-[2rem]">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp size={24} className="text-cyan-400" />
                  <h3 className="text-2xl font-semibold text-white">Improvement Roadmap</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.improvements?.map((item, i) => (
                    <div key={i} className="bg-white/5 p-5 rounded-xl border border-white/10 flex gap-4 items-start">
                       <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-cyan-500/80 text-cyan-50 rounded-full font-bold text-sm border border-cyan-400/30">{i + 1}</span>
                       <p className="text-slate-300 text-sm mt-1 leading-relaxed font-medium">{item}</p>
                    </div>
                  ))}
                </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}