"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, FileX } from "lucide-react";
import ModernTech from "@/components/resume-templates/ModernTech";
import SoftAurora from "@/components/SoftAurora";

export default function SharedResumeViewer() {
  const params = useParams();
  const id = params?.id;
  
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchSharedResume = async () => {
      try {
        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          setError(true);
        } else {
          // Reconstruct the data object for the template
          setResumeData({
            personal: data.personal_info || {},
            experience: data.experience || [],
            education: data.education || [],
            skills: data.skills || [],
            projects: data.projects || [],
            customSections: data.custom_sections || [],
          });
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedResume();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
        <p className="text-slate-400 font-syne font-bold tracking-widest uppercase">Loading Profile...</p>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
          <SoftAurora speed={0.4} color1="#ef4444" color2="#a855f7" />
        </div>
        <div className="z-10 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md">
          <FileX size={64} className="text-slate-500 mx-auto mb-6" />
          <h1 className="text-3xl font-syne font-bold text-white mb-2">Resume Not Found</h1>
          <p className="text-slate-400 font-medium">The link might be invalid, expired, or deleted by the owner.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black py-10 px-4 md:py-20 flex justify-center overflow-y-auto custom-scroll relative">
      
      {/* Background Styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.5); }
      `}} />
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <SoftAurora speed={0.3} color1="#00f2fe" color2="#a855f7" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Shared Resume Canvas */}
      <div className="z-10 relative flex flex-col items-center">
        
        {/* Paper Container (Removed the floating badge, added mb-10 for padding) */}
        <div className="w-[210mm] min-h-[297mm] mb-10 bg-white shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden scale-[0.6] sm:scale-75 md:scale-100 origin-top">
          {/* Defaulting to ModernTech for the shared view, with a sleek Cyan accent */}
          <ModernTech 
            data={resumeData} 
            themeColor="#00f2fe" 
            fontFamily="font-sans" 
            hiddenSections={{}} 
          />
        </div>
      </div>
      
    </div>
  );
}