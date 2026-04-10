"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext"; 
import { 
  UploadCloud, 
  Loader2, 
  MapPin, 
  Briefcase, 
  ExternalLink, 
  Building2, 
  RefreshCw,
  Search,
  Zap
} from "lucide-react";
import SoftAurora from "@/components/SoftAurora";

export default function JobBoard() {
  const { sharedResumeText, setSharedResumeText } = useUser();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [uploading, setUploading] = useState(false);

  //Auto-Fetch 
  useEffect(() => {
  if (sharedResumeText && jobs.length === 0 && !loading) {
    fetchJobs(sharedResumeText);
  }
}, [sharedResumeText, jobs.length]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", "General Software Engineering Role"); 

    try {
      const res = await fetch("/api/match", { method: "POST", body: formData });
      const data = await res.json();
      
      if(data.resumeText) {
          setSharedResumeText(data.resumeText); 
          fetchJobs(data.resumeText);
      } else {
          alert("Could not extract text. Please ensure API returns 'resumeText'.");
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Extraction failed. Check if API is running.");
    } finally {
      setUploading(false);
    }
  };

  // Fetch Jobs Logic
  const fetchJobs = async (text) => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Job Fetch Error:", err);
      alert("Failed to fetch jobs. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
      setSharedResumeText("");
      setJobs([]);
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

        .glass-card {
          background: rgba(15, 15, 20, 0.5);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .animate-shimmer {
          background: linear-gradient(to right, rgba(255,255,255,0.05) 4%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.05) 36%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear forwards;
        }
      `}} />

      {/* AURORA BACKGROUND */}
      <div className="fixed inset-0 w-full h-full z-0 opacity-40 pointer-events-none">
        <SoftAurora
          speed={0.5}
          scale={1.5}
          brightness={1.0}
          color1="#00f2fe"
          color2="#a855f7"
          noiseFrequency={2.0}
          bandSpread={1.5}
          enableMouseInteraction={true}
          mouseInfluence={0.15}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 relative z-10 space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center space-y-4 pt-10">
          <div className="animate-reveal inline-flex bg-white/5 border border-white/10 text-cyan-300 px-5 py-2 rounded-full text-xs font-semibold mb-4 backdrop-blur-md tracking-wider uppercase tracking-widest">
            AI Job Discovery
          </div>
          <h1 className="animate-reveal delay-100 font-syne text-5xl md:text-7xl font-black tracking-[-0.03em] text-white">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">Perfect Match</span>
          </h1>
          <p className="animate-reveal delay-200 text-slate-400 max-w-lg text-lg font-medium">
            {sharedResumeText 
              ? "Based on your unique resume footprint, we've curated these opportunities." 
              : "Upload your resume and let CVision's AI extract your skills to find the perfect job."}
          </p>
        </div>

        {!sharedResumeText ? (
          /* UPLOAD BOX */
          <div className="animate-reveal delay-300 max-w-2xl mx-auto glass-card p-12 rounded-[3rem] border-t border-white/10 flex flex-col items-center justify-center text-center group transition-all duration-500 hover:shadow-[0_0_50px_rgba(34,211,238,0.15)] hover:border-cyan-500/30">
            <div className="p-6 bg-white/5 rounded-full mb-8 border border-white/10 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-500">
                <UploadCloud size={56} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
            </div>
            <h3 className="font-syne text-3xl font-bold mb-3 text-white tracking-tight">Upload Your Resume</h3>
            <p className="text-slate-400 mb-10 text-lg font-medium max-w-sm">We'll extract your core skills and match you with the best open roles.</p>
            
            <input type="file" id="job-resume" className="hidden" onChange={handleFileUpload} accept=".pdf" />
            <label 
                htmlFor="job-resume" 
                className={`cursor-pointer btn-mesh-action px-12 py-5 rounded-full font-syne font-bold text-lg text-white transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-3 active:scale-95 ${uploading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {uploading ? <><Loader2 className="animate-spin" /> Analyzing Profile...</> : <>Select PDF File <Zap size={20}/></>}
            </label>
          </div>
        ) : (
            /* JOBS GRID */
            <div className="space-y-10 animate-in fade-in duration-700">
                <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-slate-300 font-medium px-2">
                        <Search size={20} className="text-cyan-400"/> 
                        <span>Opportunities Found</span>
                    </div>
                    <button onClick={handleReset} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-cyan-400 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-all">
                        <RefreshCw size={16} /> Rescan New CV
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading && [1,2,3,4,5,6].map(i => (
                    <div key={i} className="h-80 animate-shimmer rounded-[2.5rem] border border-white/5" />
                ))}
                
                {!loading && jobs.length > 0 && jobs.map((job, i) => (
                    <div key={i} className="glass-card p-8 rounded-[2.5rem] border-t border-white/10 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-black/50 rounded-2xl flex items-center justify-center p-3 border border-white/10 group-hover:border-cyan-500/30 transition-colors overflow-hidden">
                                {job.employer_logo ? (
                                    <img src={job.employer_logo} alt="logo" className="w-full h-full object-contain" />
                                ) : (
                                    <Building2 size={28} className="text-slate-500" />
                                )}
                            </div>
                            <span className="text-[10px] font-black px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl uppercase tracking-widest">
                                {job.job_employment_type?.replace('_', ' ') || "Full Time"}
                            </span>
                        </div>
                        
                        <h3 className="font-syne font-bold text-2xl leading-tight mb-3 text-white line-clamp-2">
                            {job.job_title}
                        </h3>
                        <p className="text-sm text-slate-400 font-semibold mb-8">
                            {job.employer_name}
                        </p>
                        
                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                                <div className="p-2 bg-white/5 border border-white/10 rounded-lg"><MapPin size={16} className="text-cyan-400" /></div>
                                {job.job_city || job.job_country || "Remote Worldwide"}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                                <div className="p-2 bg-white/5 border border-white/10 rounded-lg"><Briefcase size={16} className="text-purple-400" /></div>
                                {job.job_publisher}
                            </div>
                        </div>
                    </div>

                    <a href={job.job_apply_link} target="_blank" rel="noreferrer" className="w-full py-4 bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 text-cyan-400 font-syne font-bold rounded-2xl text-center text-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                        Apply Now <ExternalLink size={18} />
                    </a>
                    </div>
                ))}
                
                {!loading && jobs.length === 0 && (
                    <div className="col-span-full text-center py-24 glass-card rounded-[3rem] border-dashed border-white/20">
                        <Search size={40} className="text-slate-500 mx-auto mb-6" />
                        <h3 className="font-syne text-2xl font-bold text-white mb-2">No Matches Found</h3>
                        <p className="text-slate-400 font-medium mb-6">Try optimizing and uploading a different resume profile.</p>
                    </div>
                )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}