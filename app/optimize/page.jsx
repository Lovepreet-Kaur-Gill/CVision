"use client";
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Briefcase, 
  Loader2, 
  ArrowRight,
  BookOpen, 
  ExternalLink, 
  Info,
  Trophy,
  Sparkles,
  Target
} from "lucide-react";
import SoftAurora from "@/components/SoftAurora";

export default function JdMatcher() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleMatch = async () => {
    if (!file || !jd) {
      setError("Please upload a resume AND paste a job description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jd);

    try {
      const res = await fetch("/api/match", { method: "POST", body: formData });
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
    if (score >= 80) return "#00f2fe"; 
    if (score >= 60) return "#a855f7"; 
    return "#ef4444"; // Red for Low
  };

  const getCompatibilityLabel = (score) => {
    if (score >= 80) return "High Compatibility";
    if (score >= 60) return "Medium Compatibility";
    return "Low Compatibility";
  };

  return (
    <div className="min-h-screen w-full text-slate-100 font-inter pb-10 relative overflow-hidden bg-black">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@700;800;900&display=swap');
        
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-inter { font-family: 'Inter', sans-serif; }

        @keyframes revealUp {
          from { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(5px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
        .animate-reveal { opacity: 0; animation: revealUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }

        @keyframes gradientShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* 🔴 NEW: Sexy Neon Gradient Button 🔴 */
        .btn-neon-gradient {
          background: linear-gradient(135deg, #00f2fe 0%, #4facfe 40%, #a855f7 100%);
          background-size: 200% 200%;
          animation: gradientShine 4s ease infinite;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 10px 30px -10px rgba(0, 242, 254, 0.6);
        }
        .btn-neon-gradient:hover {
          box-shadow: 0 15px 40px -10px rgba(0, 242, 254, 0.9), inset 0 0 15px rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        .glass-card {
          background: rgba(15, 15, 20, 0.5);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        }

        /* Custom Scrollbar for Textarea */
        textarea::-webkit-scrollbar { width: 6px; }
        textarea::-webkit-scrollbar-track { background: transparent; }
        textarea::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        textarea::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.5); }
      `}} />

      <div className="fixed inset-0 w-full h-full z-0 opacity-40 pointer-events-none">
        <SoftAurora
          speed={0.5}
          scale={1.5}
          brightness={1.0}
          color1="#a855f7" // Purple
          color2="#00f2fe" // Cyan
          noiseFrequency={2.0}
          bandSpread={1.5}
          enableMouseInteraction={true}
          mouseInfluence={0.15}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-24 relative z-10 space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4 pt-10">
          <div className="animate-reveal inline-flex bg-white/5 border border-white/10 text-cyan-300 px-5 py-2 rounded-full text-xs font-semibold mb-4 backdrop-blur-md tracking-wider uppercase">
            Precision Alignment
          </div>
          <h1 className="animate-reveal delay-100 font-syne text-5xl md:text-7xl font-black tracking-[-0.03em] text-white drop-shadow-md">
            JD-Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">Optimizer</span>
          </h1>
          <p className="animate-reveal delay-200 text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Align your profile with the exact job requirements. Upload your CV and paste the JD to bridge the skill gap instantly.
          </p>
        </div>

        {/* Input Section Grid */}
        <div className="animate-reveal delay-300 grid md:grid-cols-2 gap-8">
          
          {/* Upload Resume Card */}
          <div className="glass-card p-8 md:p-10 rounded-[2.5rem] flex flex-col h-full border-t border-white/10">
            <h3 className="font-syne text-2xl font-bold text-white flex items-center gap-3 mb-6">
              <span className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30"><FileText size={22} /></span>
              Your Resume
            </h3>
            <div className={`flex-1 border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${file ? 'border-cyan-500/60 bg-cyan-950/20' : 'border-white/10 bg-white/5 hover:border-cyan-500/40 hover:bg-white/10'}`}>
              {file ? (
                <FileText size={48} className="text-cyan-400 mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
              ) : (
                <UploadCloud size={48} className="text-slate-500 mb-4" />
              )}
              <input 
                type="file" 
                id="resume-upload" 
                accept=".pdf"
                onChange={(e) => setFile(e.target.files[0])} 
                className="hidden" 
              />
              <label htmlFor="resume-upload" className="cursor-pointer text-cyan-400 font-bold hover:text-cyan-300 text-lg transition-colors">
                {file ? file.name : "Select Resume PDF"}
              </label>
              <p className="text-slate-500 text-sm mt-2 font-medium">Max 5MB • PDF Only</p>
            </div>
          </div>

          {/* Job Description Card */}
          <div className="glass-card p-8 md:p-10 rounded-[2.5rem] flex flex-col h-full border-t border-white/10">
            <h3 className="font-syne text-2xl font-bold text-white flex items-center gap-3 mb-6">
              <span className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30"><Briefcase size={22} /></span>
              Job Description
            </h3>
            <textarea
              className="flex-1 w-full min-h-[220px] p-6 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none resize-none text-slate-200 text-sm leading-relaxed backdrop-blur-md transition-all placeholder:text-slate-600"
              placeholder="Paste the job requirements, responsibilities, and qualifications here..."
              value={jd}
              onChange={(e) => setJd(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/*  Action Button  */}
        <div className="animate-reveal delay-400 flex flex-col items-center gap-4 mt-8">
          <button
            onClick={handleMatch}
            disabled={loading || !file || !jd}
            className={`group relative px-14 py-5 rounded-full font-syne font-bold text-white transition-all duration-300 active:scale-95 flex items-center gap-3 text-xl ${
              loading || !file || !jd
                ? "bg-white/5 border border-white/10 cursor-not-allowed text-slate-500" 
                : "btn-neon-gradient"
            }`}
          >
            {loading ? <><Loader2 className="animate-spin" /> Processing Match...</> : <>Calculate Match <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
          
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-2 font-medium animate-in backdrop-blur-md shadow-xl">
              <XCircle size={18}/> {error}
            </div>
          )}
        </div>

        {/*  RESULTS */}
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12 mt-12">
            
            <div className="grid md:grid-cols-3 gap-8">
              
              {/* Score Card */}
              <div className="glass-card p-10 rounded-[2.5rem] flex flex-col items-center justify-center relative border-t border-white/10">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-purple-500"></div>
                <h3 className="font-syne text-xl font-bold text-white mb-2">Match Accuracy</h3>
                
                <div className="w-48 h-48 relative">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[{ value: result.matchScore }, { value: 100 - result.matchScore }]}
                        cx="50%" cy="50%"
                        innerRadius={65} outerRadius={80}
                        startAngle={180} endAngle={0}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill="url(#scoreGradient)" cornerRadius={99} />
                        <Cell fill="#111827" cornerRadius={99} />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#a855f7" /> {/* Purple */}
                            <stop offset="100%" stopColor="#00f2fe" /> {/* Cyan */}
                          </linearGradient>
                        </defs>
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                    <span className="font-syne text-5xl font-black text-white">{result.matchScore}%</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 px-5 py-2.5 bg-cyan-950/30 rounded-full border border-cyan-500/20 mt-2">
                  <Trophy size={16} className="text-cyan-400" />
                  <span className="text-sm font-bold text-cyan-300">{getCompatibilityLabel(result.matchScore)}</span>
                </div>
              </div>

              {/* Expert Analysis */}
              <div className="md:col-span-2 glass-card p-10 rounded-[2.5rem] border-t border-white/10 flex flex-col justify-center">
                <h4 className="font-syne text-2xl font-bold text-white flex items-center gap-3 mb-6">
                  <span className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30"><Info size={22} /></span> 
                  Expert Analysis
                </h4>
                <p className="text-slate-300 text-base leading-relaxed font-medium italic border-l-2 border-indigo-500/50 pl-6 py-2">
                  "{result.analysis}"
                </p>
              </div>
            </div>

            {/* Missing Skills Section */}
            <div className="glass-card p-10 rounded-[2.5rem] border-t border-red-500/30">
              <h4 className="font-syne text-2xl font-bold text-white flex items-center gap-3 mb-8">
                <span className="p-2.5 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30"><BookOpen size={22} /></span> 
                Bridge the Gap (Missing Skills)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {result.missingKeywords?.map((skill, i) => {
                  const skillName = typeof skill === 'object' ? skill.name : skill;
                  return (
                    <div key={i} className="group flex flex-col justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/40 hover:bg-white/10 transition-all duration-300 shadow-lg">
                      <span className="text-base font-bold text-slate-200 group-hover:text-cyan-300 transition-colors mb-4 line-clamp-2">{skillName}</span>
                      
                      <a href={`https://www.youtube.com/results?search_query=${skillName}+tutorial`} target="_blank" rel="noreferrer" 
                         className="flex items-center justify-center gap-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 px-4 py-2.5 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] w-full">
                        <Target size={14} /> LEARN SKILL
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 glass-card rounded-[3rem] animate-pulse mx-auto max-w-4xl border-dashed border-white/20 mt-12">
            <div className="p-6 bg-cyan-950/40 rounded-full mb-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <Sparkles size={48} className="text-cyan-400" />
            </div>
            <h3 className="font-syne text-3xl font-bold text-white mb-4 tracking-tight">Ready to Sync?</h3>
            <p className="text-slate-400 max-w-md text-center px-6 text-lg font-medium">
              Upload your resume and paste the target job description to reveal your compatibility score and custom skill roadmap.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}