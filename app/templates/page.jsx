"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  FileText, LayoutTemplate, Download,
  User, Briefcase, GraduationCap, Code,
  Plus, Trash2, RotateCcw, Save, Loader2,
  ZoomIn, ZoomOut, Eye, EyeOff,
  Undo2, Redo2, Copy, Check, ChevronUp, ChevronDown,
  Share2, X, Github, Zap, Award
} from "lucide-react";
import ModernTech from "@/components/resume-templates/ModernTech";
import CorporateClassic from "@/components/resume-templates/CorporateClassic";
import CreativeStudio from "@/components/resume-templates/CreativeStudio";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import SoftAurora from "@/components/SoftAurora";

// ─── Constants ────────────────────────────────────────────────────────────────
const SKILL_SUGGESTIONS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Python", "Node.js",
  "Tailwind CSS", "GraphQL", "PostgreSQL", "MongoDB", "Docker", "Kubernetes",
  "AWS", "Firebase", "Git", "Figma", "Machine Learning", "TensorFlow",
  "PyTorch", "Generative AI", "REST APIs", "Redux", "Vue.js", "Angular",
  "Java", "C++", "Go", "Rust", "Swift",
];

const PRESET_COLORS = [
  "#00f2fe", "#a855f7", "#ec4899", "#4f46e5",
  "#10b981", "#f59e0b", "#3b82f6", "#ffffff",
];

// ✅ REQ 3: Dummy Data for new users instead of your personal info
const defaultData = {
  personal: {
    name: "John Doe",
    title: "Software Engineer",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    summary: "A passionate and results-driven professional with experience in building scalable solutions and eager to contribute to innovative tech projects.",
    image: "",
  },
  experience: [
    {
      id: 1,
      role: "Software Developer Intern",
      company: "Tech Solutions Inc.",
      duration: "Jan 2024 - Present",
      desc: "Assisted in building and maintaining modern web applications using React and Node.js.",
    },
  ],
  education: [
    { id: 1, degree: "B.S. Computer Science", school: "State University", year: "2020 - 2024", desc: "Relevant Coursework: Data Structures, Algorithms, Database Management." },
  ],
  skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
  projects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      tech: "React, Node.js, MongoDB",
      duration: "Fall 2023", 
      desc: "Developed a full-stack e-commerce platform with secure payment integration and real-time inventory management.",
    },
  ],
  customSections: [], // ✅ REQ 4: Added array for custom sections
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const config = {
    success: { border: "border-green-500/50", icon: <Check size={16} className="text-green-400" /> },
    error:   { border: "border-red-500/50",   icon: <X size={16} className="text-red-400" /> },
    info:    { border: "border-cyan-500/50",  icon: <Zap size={16} className="text-cyan-400" /> },
  }[type];

  return (
    <div className={`fixed top-24 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-200 text-sm font-bold shadow-2xl bg-[#0a0a0f]/95 backdrop-blur-xl border ${config.border} animate-in slide-in-from-top-4`}>
      {config.icon}
      <span className="max-w-xs">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white shrink-0 transition-colors">
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Share Modal ──────────────────────────────────────────────────────────────
function ShareModal({ resumeId, onClose }) {
  const [copied, setCopied] = useState(false);
  const url = resumeId
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/r/${resumeId}`
    : null;

  const copy = () => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0f] rounded-[2rem] p-8 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-syne font-bold text-xl text-white flex items-center gap-2">
            <Share2 size={20} className="text-cyan-400" /> Share Resume
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
            <X size={18} />
          </button>
        </div>
        {url ? (
          <>
            <p className="text-sm text-slate-400 mb-4 font-medium">Anyone with this link can view your resume:</p>
            <div className="flex flex-col gap-3">
              <input readOnly value={url}
                className="w-full p-3 text-sm border border-white/10 rounded-xl bg-white/5 outline-none text-slate-200 font-mono" />
              <button onClick={copy}
                className="w-full py-3 btn-neon-gradient text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Link</>}
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400 font-medium text-center bg-white/5 p-4 rounded-xl border border-white/5">
            Save your resume to the cloud first to generate a share link.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Inline Resume Preview ────────────────────────────────────────────────────
function ResumePreview({ data, themeColor, fontFamily, hiddenSections }) {
  const p = data.personal;

  return (
    <div className={`w-full h-full bg-white text-slate-900 ${fontFamily} text-sm`} style={{ fontFamily: "inherit" }}>
      {/* Header */}
      <div className="px-10 py-8 border-b-4" style={{ borderColor: themeColor }}>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: themeColor }}>{p.name}</h1>
        <p className="text-base font-semibold text-slate-500 mt-0.5">{p.title}</p>

        {/* Contact row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-600">
          {p.email    && <span>✉ {p.email}</span>}
          {p.phone    && <span>📞 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && (
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              {p.linkedin}
            </span>
          )}
          {p.github && (
            <span className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              {p.github}
            </span>
          )}
        </div>
      </div>

      <div className="px-10 py-6 space-y-5">
        {/* Summary */}
        {p.summary && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: themeColor }}>Summary</h2>
            <p className="text-xs text-slate-700 leading-relaxed">{p.summary}</p>
          </section>
        )}

        {/* Experience */}
        {!hiddenSections?.experience && data.experience?.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: themeColor }}>Experience</h2>
            <div className="space-y-3">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs">{exp.role}</span>
                    <span className="text-[10px] text-slate-400">{exp.duration}</span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500">{exp.company}</p>
                  {exp.desc && <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{exp.desc}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {!hiddenSections?.education && data.education?.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: themeColor }}>Education</h2>
            <div className="space-y-2">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs">{edu.degree}</span>
                    <span className="text-[10px] text-slate-400">{edu.year}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{edu.school}</p>
                  {edu.desc && <p className="text-[10px] text-slate-500">{edu.desc}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {!hiddenSections?.skills && data.skills?.filter(Boolean).length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: themeColor }}>Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.filter(Boolean).map((skill, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ backgroundColor: themeColor }}>
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {!hiddenSections?.projects && data.projects?.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-2" style={{ color: themeColor }}>Projects</h2>
            <div className="space-y-3">
              {data.projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-xs">{proj.title}</span>
                      {proj.tech && <span className="text-[9px] text-indigo-500 font-semibold">{proj.tech}</span>}
                    </div>
                    {proj.duration && <span className="text-[10px] text-slate-400">{proj.duration}</span>}
                  </div>
                  {proj.desc && <p className="text-[10px] text-slate-600 mt-0.5 leading-relaxed">{proj.desc}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// ─── START REPLACEMENT 1 ──────────────────────────────────────────────────────
const CUSTOM_SECTION_PRESETS = [
  "Certifications", "Awards", "Publications", "Volunteer Work",
  "Languages", "Hobbies & Interests", "References", "Achievements"
];

function AddSectionModal({ onAdd, onClose }) {
  const [name, setName] = useState("");

  const handleAdd = (sectionName) => {
    const trimmed = sectionName.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#0a0a0f] rounded-[2rem] p-8 w-full max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-syne font-bold text-xl text-white flex items-center gap-2">
            <Plus size={20} className="text-cyan-400" /> New Section
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
            <X size={18} />
          </button>
        </div>

        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-3">Quick Add</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {CUSTOM_SECTION_PRESETS.map(preset => (
            <button key={preset} onClick={() => handleAdd(preset)}
              className="px-3 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-xs font-bold hover:bg-cyan-500/20 transition-all">
              {preset}
            </button>
          ))}
        </div>

        <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-3">Or type a custom name</p>
        <div className="flex gap-2">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd(name)}
            placeholder="e.g. Patents, Research..."
            className="flex-1 p-3 border border-white/10 rounded-xl bg-white/5 outline-none text-white text-sm focus:border-cyan-500/50 transition-colors"
          />
          <button onClick={() => handleAdd(name)}
            className="px-4 py-3 btn-neon-gradient text-white rounded-xl text-sm font-bold transition-all">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}


function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0a0a0f] rounded-[2rem] p-8 w-full max-w-sm shadow-[0_0_50px_rgba(220,38,38,0.15)] border border-red-500/20 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mb-2">
            <Trash2 size={24} className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          </div>
          <h3 className="font-syne font-bold text-xl text-white">Delete Section?</h3>
          <p className="text-sm text-slate-400 font-medium">
            Are you sure you want to delete this entire custom section? This action cannot be undone.
          </p>
          <div className="flex gap-3 w-full mt-4">
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold text-sm bg-white/5 text-slate-300 hover:bg-white/10 transition-all border border-white/10">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdvancedResumeBuilder() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { theme, systemTheme }         = useTheme();

 // Core state
  const [resumeData, setResumeData]                     = useState(defaultData);
  const [activeSidebarTab, setActiveSidebarTab]         = useState("content");
  const [activeContentSection, setActiveContentSection] = useState("personal");
  const [selectedTemplate, setSelectedTemplate]         = useState("modern-tech");
  const [themeColor, setThemeColor]                     = useState("#00f2fe"); // CVision Cyan Default
  const [fontFamily, setFontFamily]                     = useState("font-sans");
  const [fontSize, setFontSize]                         = useState("md");
  const resumeRef = useRef(null);

  // Cloud & UX State
  const [isSaving, setIsSaving]             = useState(false);
  const [isFetching, setIsFetching]         = useState(true);
  // const [shareId, setShareId]               = useState(null);
  // const [showShare, setShowShare]           = useState(false);
  // const [showAddSection, setShowAddSection] = useState(false);
  const [shareId, setShareId]       = useState(null);
  const [showShare, setShowShare]   = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null); 
  const [zoom, setZoom]                     = useState(85);
  const [toast, setToast]                   = useState(null);

  // Undo / Redo State
  const [history, setHistory]           = useState([defaultData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Section visibility & Skills
  const [hiddenSections, setHiddenSections] = useState({});
  const [skillSuggestions, setSkillSuggestions]  = useState([]);
  const [activeSkillInput, setActiveSkillInput]  = useState(null);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => setToast({ msg, type });

  const pushHistory = useCallback((newData) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newData].slice(-50);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const updateData = useCallback((updater) => {
    setResumeData(prev => {
      const next = updater(prev);
      pushHistory(next);
      return next;
    });
  }, [pushHistory]);

  const undo = () => {
    if (historyIndex <= 0) return;
    const i = historyIndex - 1;
    setHistoryIndex(i);
    setResumeData(history[i]);
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const i = historyIndex + 1;
    setHistoryIndex(i);
    setResumeData(history[i]);
  };

  // ── Fetch from Database ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || !isSignedIn) { setIsFetching(false); return; }
    (async () => {
      try {
        const { data } = await supabase
          .from("resumes").select("*").eq("user_id", user.id).single();
        if (data) {
          const loaded = {
            personal:   data.personal_info || defaultData.personal,
            experience: data.experience    || defaultData.experience,
            education:  data.education     || defaultData.education,
            skills:     data.skills        || defaultData.skills,
            projects:   data.projects      || defaultData.projects,
            customSections: data.custom_sections || defaultData.customSections,
          };
          if (!loaded.personal.github) loaded.personal.github = "";
          setResumeData(loaded);
          setHistory([loaded]);
          setShareId(data.id || null);
        }
      } catch (e) { console.error(e); }
      finally { setIsFetching(false); }
    })();
  }, [isLoaded, isSignedIn, user]);

  // ── Save to Database ──────────────────────────────────────────────────────────
  const saveToCloud = async () => {
    if (!isSignedIn) { showToast("Please sign in to save!", "error"); return; }
    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from("resumes").select("id").eq("user_id", user.id).single();
      const payload = {
        user_id:       user.id,
        personal_info: resumeData.personal,
        experience:    resumeData.experience,
        education:     resumeData.education,
        skills:        resumeData.skills,
        projects:      resumeData.projects,
        custom_sections: resumeData.customSections || [],
        updated_at:    new Date().toISOString(),
      };
      if (existing) {
        await supabase.from("resumes").update(payload).eq("id", existing.id);
        setShareId(existing.id);
      } else {
        const { data: inserted } = await supabase
          .from("resumes").insert([payload]).select().single();
        setShareId(inserted?.id || null);
      }
      showToast("Saved to cloud ☁️", "success");
    } catch (e) {
      console.error(e);
      showToast("Save failed. Try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // ── PDF Export ────────────────────────────────────────────────────────────────
  const exportPDF = async () => {
    if (!resumeRef.current) return;
    showToast("Generating Premium PDF…", "info");
    try {
      const dataUrl = await toPng(resumeRef.current, {
        quality: 1, pixelRatio: 2, backgroundColor: "#ffffff", skipFonts: true,
      });
      const pdf   = new jsPDF("p", "mm", "a4");
      const w     = pdf.internal.pageSize.getWidth();
      const h     = pdf.internal.pageSize.getHeight();
      const props = pdf.getImageProperties(dataUrl);
      const ratio = Math.min(w / props.width, h / props.height);
      const fw    = props.width  * ratio;
      const fh    = props.height * ratio;
      let left = fh, pos = 0;
      pdf.addImage(dataUrl, "PNG", 0, pos, fw, fh);
      left -= h;
      while (left > 0) {
        pos = left - fh;
        pdf.addPage();
        pdf.addImage(dataUrl, "PNG", 0, pos, fw, fh);
        left -= h;
      }
      pdf.save(`${resumeData.personal?.name || "CVision"}_Resume.pdf`);
      showToast("PDF downloaded!", "success");
    } catch (e) {
      console.error(e);
      showToast("PDF failed. Check console.", "error");
    }
  };

  // ── Form Handlers ────────────────────────────────────────────────────────────────
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      updateData(prev => ({ ...prev, personal: { ...prev.personal, image: reader.result } }));
    reader.readAsDataURL(file);
  };

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    updateData(prev => ({ ...prev, personal: { ...prev.personal, [name]: value } }));
  };

  const addExp  = () => updateData(prev => ({ ...prev, experience: [...prev.experience, { id: Date.now(), role: "", company: "", duration: "", desc: "" }] }));
  const updExp  = (id, f, v) => updateData(prev => ({ ...prev, experience: prev.experience.map(e => e.id === id ? { ...e, [f]: v } : e) }));
  const delExp  = (id) => updateData(prev => ({ ...prev, experience: prev.experience.filter(e => e.id !== id) }));
  const moveExp = (id, dir) => updateData(prev => {
    const arr = [...prev.experience];
    const i   = arr.findIndex(e => e.id === id);
    const j   = i + dir;
    if (j < 0 || j >= arr.length) return prev;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return { ...prev, experience: arr };
  });

  const addEdu = () => updateData(prev => ({ ...prev, education: [...prev.education, { id: Date.now(), degree: "", school: "", year: "", desc: "" }] }));
  const updEdu = (id, f, v) => updateData(prev => ({ ...prev, education: prev.education.map(e => e.id === id ? { ...e, [f]: v } : e) }));
  const delEdu = (id) => updateData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== id) }));

  const updSkill = (i, v) => {
    setSkillSuggestions(SKILL_SUGGESTIONS.filter(s => s.toLowerCase().startsWith(v.toLowerCase()) && v.length > 0).slice(0, 5));
    setActiveSkillInput(i);
    updateData(prev => { const s = [...prev.skills]; s[i] = v; return { ...prev, skills: s }; });
  };
  const addSkill = () => updateData(prev => ({ ...prev, skills: [...prev.skills, ""] }));
  const delSkill = (i) => updateData(prev => ({ ...prev, skills: prev.skills.filter((_, x) => x !== i) }));
  const pickSugg = (i, v) => {
    updateData(prev => { const s = [...prev.skills]; s[i] = v; return { ...prev, skills: s }; });
    setSkillSuggestions([]); setActiveSkillInput(null);
  };

  const addProj = () => updateData(prev => ({ ...prev, projects: [...(prev.projects || []), { id: Date.now(), title: "", tech: "", duration: "", desc: "" }] })); 
  const updProj = (id, f, v) => updateData(prev => ({ ...prev, projects: prev.projects.map(p => p.id === id ? { ...p, [f]: v } : p) }));
  const delProj = (id) => updateData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));

  const toggleSection = (s) => setHiddenSections(prev => ({ ...prev, [s]: !prev[s] }));

  // ── Custom Sections Logic ────────────────────────────────────────────────────────
  const addCustomSection = (title) => {
    if (!title || !title.trim()) return;
    const newSection = { id: Date.now(), title: title.trim(), items: [] };
    updateData(prev => ({ ...prev, customSections: [...(prev.customSections || []), newSection] }));
    setActiveContentSection(`custom_${newSection.id}`);
    showToast(`"${title}" section added!`, "success");
  };

  const requestDeleteCustomSection = (secId) => {
    setSectionToDelete(secId); // Opens the modal
  };

  const confirmDeleteCustomSection = () => {
    if (!sectionToDelete) return;
    updateData(prev => ({ ...prev, customSections: (prev.customSections || []).filter(s => s.id !== sectionToDelete) }));
    setActiveContentSection("personal");
    setSectionToDelete(null); // Closes the modal
    showToast("Section deleted", "success");
  };

  const addCustomItem = (secId) => {
    updateData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === secId ? { ...s, items: [...s.items, { id: Date.now(), title: "", subtitle: "", date: "", desc: "" }] } : s
      ),
    }));
  };

  const updCustomItem = (secId, itemId, field, value) => {
    updateData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === secId ? { ...s, items: s.items.map(item => item.id === itemId ? { ...item, [field]: value } : item) } : s
      ),
    }));
  };

  const delCustomItem = (secId, itemId) => {
    updateData(prev => ({
      ...prev,
      customSections: prev.customSections.map(s =>
        s.id === secId ? { ...s, items: s.items.filter(item => item.id !== itemId) } : s
      ),
    }));
  };

  const fontSizeClass = { sm: "text-xs", md: "text-sm", lg: "text-base" }[fontSize];

  // ── Loading ───────────────────────────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black gap-6">
        <Loader2 className="animate-spin text-cyan-400" size={48} />
        <h2 className="text-2xl font-syne font-bold text-white tracking-tight">Syncing Workspace…</h2>
      </div>
    );
  }

  // ── Render ──────
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-black font-inter pt-[76px] md:pt-[104px] pb-[80px] md:pb-0 overflow-hidden relative">
      
      {/* GLOBAL CSS INJECTION */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Syne:wght@700;800;900&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        
        /* ✅ Fixes the long text overflow going out of the resume paper */
        #resume-paper { word-wrap: break-word; overflow-wrap: break-word; }
        #resume-paper * { word-break: break-word; }

        /* Custom Dark Input Style */
        .glass-input {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          outline: none;
          transition: all 0.2s ease;
        }
        .glass-input:focus {
          border-color: rgba(34,211,238,0.5);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 2px rgba(34,211,238,0.1);
        }
        .glass-input::placeholder { color: rgba(255,255,255,0.3); }

        /* Custom Scrollbar for Sidebar */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(34,211,238,0.5); }

        /* Neon Export Button */
        @keyframes gradientShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .btn-neon-gradient {
          background: linear-gradient(135deg, #00f2fe 0%, #4facfe 40%, #a855f7 100%);
          background-size: 200% 200%;
          animation: gradientShine 4s ease infinite;
          box-shadow: 0 5px 20px -5px rgba(0, 242, 254, 0.6);
        }
        .btn-neon-gradient:hover {
          box-shadow: 0 10px 30px -5px rgba(0, 242, 254, 0.8);
          transform: translateY(-1px);
        }
      `}} />

      {/* BACKGROUND AURORA (Behind entire builder) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
         <SoftAurora speed={0.4} color1="#a855f7" color2="#00f2fe" />
         <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* ✅ Modals Mounted Here */}
      {toast          && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {showShare      && <ShareModal resumeId={shareId} onClose={() => setShowShare(false)} />}
      {showAddSection && <AddSectionModal onAdd={addCustomSection} onClose={() => setShowAddSection(false)} />}
      {sectionToDelete && <ConfirmDeleteModal onConfirm={confirmDeleteCustomSection} onCancel={() => setSectionToDelete(null)} />}

      {/* ════════ LEFT SIDEBAR (Glass UI) ════════ */}
      <div className="w-full md:w-[420px] h-1/2 md:h-full flex flex-col z-10 shrink-0 bg-[#0a0a0f]/80 backdrop-blur-2xl border-r border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.5)]">

        {/* Header */}
        {/* <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h1 className="text-lg font-syne font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight">CVision Builder</h1> */}
        {/* Header */}
        {/* ✅ Reduced padding (p-3 md:p-4) to make the header thinner */}
        <div className="p-3 md:p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          {/* ✅ Reduced text size (text-base md:text-lg) */}
          <h1 className="text-base md:text-lg font-syne font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight">CVision Builder</h1>
          <div className="flex items-center gap-2">
            <button onClick={undo} disabled={historyIndex <= 0}
              className="p-2 text-slate-400 hover:text-cyan-400 disabled:opacity-20 transition-colors rounded-lg bg-white/5 hover:bg-white/10" title="Undo">
              <Undo2 size={14} />
            </button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1}
              className="p-2 text-slate-400 hover:text-cyan-400 disabled:opacity-20 transition-colors rounded-lg bg-white/5 hover:bg-white/10" title="Redo">
              <Redo2 size={14} />
            </button>
            <button onClick={() => setShowShare(true)}
              className="p-2 text-slate-400 hover:text-cyan-400 transition-colors rounded-lg bg-white/5 hover:bg-white/10" title="Share">
              <Share2 size={14} />
            </button>
            <button onClick={saveToCloud} disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-bold hover:bg-cyan-500/30 hover:text-cyan-200 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
              {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {isSaving ? "Saving" : "Save"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/5 bg-white/5">
          {["content", "templates", "design", "sections"].map(tab => (
            <button key={tab} onClick={() => setActiveSidebarTab(tab)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeSidebarTab === tab
                  ? "border-b-2 border-cyan-400 text-cyan-400 bg-cyan-400/5 shadow-[inset_0_-10px_20px_-10px_rgba(34,211,238,0.2)]"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 custom-scroll overflow-y-auto p-5 space-y-6">

          {/* ── SECTIONS ── */}
          {activeSidebarTab === "sections" && (
            <div className="space-y-3 animate-in fade-in">
              <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest mb-4 flex items-center gap-2"><Eye size={12}/> Toggle Visibility</p>
              {["experience", "education", "skills", "projects"].map(sec => (
                <div key={sec} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                  <span className="text-sm font-bold capitalize text-slate-200">{sec}</span>
                  <button onClick={() => toggleSection(sec)}
                    className={`p-2 rounded-xl transition-all ${
                      hiddenSections[sec]
                        ? "bg-white/10 text-slate-500 hover:bg-white/20 hover:text-white"
                        : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    }`}>
                    {hiddenSections[sec] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── DESIGN ── */}
          {activeSidebarTab === "design" && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest mb-3 flex items-center gap-2"><Zap size={12}/> Accent Color</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {PRESET_COLORS.map(c => (
                    <button key={c} onClick={() => setThemeColor(c)}
                      className="w-8 h-8 rounded-full transition-all hover:scale-110 shadow-lg"
                      style={{ backgroundColor: c, border: themeColor === c ? "2px solid white" : "2px solid transparent", boxShadow: themeColor === c ? `0 0 15px ${c}` : 'none' }} />
                  ))}
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <label className="text-xs font-bold text-slate-300">Custom Hex:</label>
                  <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent p-0" />
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-md border border-cyan-400/20">{themeColor}</span>
                </div>
              </div>
              
              <div>
                <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest mb-3">Typography</p>
                <div className="flex flex-col gap-2.5">
                  {[["font-sans","Modern Sans"],["font-serif","Classic Serif"],["font-mono","Developer Mono"]].map(([val, label]) => (
                    <button key={val} onClick={() => setFontFamily(val)}
                      className={`p-3.5 border rounded-xl text-left text-sm transition-all ${val} ${
                        fontFamily === val
                          ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300 font-bold shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                          : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest mb-3">Sizing Base</p>
                <div className="flex gap-2">
                  {["sm","md","lg"].map(s => (
                    <button key={s} onClick={() => setFontSize(s)}
                      className={`flex-1 py-3 border rounded-xl text-xs font-bold transition-all ${
                        fontSize === s
                          ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
                      }`}>
                      {s.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TEMPLATES ── */}
          {activeSidebarTab === "templates" && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-[10px] text-cyan-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-2"><LayoutTemplate size={12}/> Select Layout</p>
              {[
                ["modern-tech",     "Modern Tech",       "Best for AI & SDE roles",          "from-cyan-400 to-blue-500"],
                ["classic-corp",    "Corporate Classic", "Best for Finance & Executive roles", "from-slate-400 to-slate-600"],
                ["creative-studio", "Creative Studio",   "Best for Design & Creative roles",   "from-pink-400 to-purple-500"],
              ].map(([val, name, desc, grad]) => (
                <div key={val} onClick={() => setSelectedTemplate(val)}
                  className={`p-5 rounded-2xl cursor-pointer transition-all group border ${
                    selectedTemplate === val
                      ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}>
                  <div className={`w-full h-12 bg-gradient-to-r ${grad} rounded-xl mb-4 flex items-center justify-center shadow-inner opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <FileText size={20} className="text-white drop-shadow-md" />
                  </div>
                  <div className={`font-bold text-base mb-1 ${selectedTemplate === val ? 'text-cyan-300' : 'text-slate-200'}`}>{name}</div>
                  <div className="text-xs text-slate-500 font-medium">{desc}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── CONTENT ── */}
          {activeSidebarTab === "content" && (
            <div className="space-y-6">

              {/* Section nav icons */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  ["personal",   <User size={18} />,         "Info"],
                  ["experience", <Briefcase size={18} />,      "Work"],
                  ["education",  <GraduationCap size={18} />,  "Edu"],
                  ["skills",     <Code size={18} />,           "Skills"],
                  ["projects",   <LayoutTemplate size={18} />, "Proj"],
                ].map(([key, icon, label]) => (
                  <button key={key} onClick={() => setActiveContentSection(key)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all ${
                      activeContentSection === key
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        : "bg-white/5 border-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10"
                    }`}>
                    {icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
                  </button>
                ))}
              </div>

              {/* ✅ REQ 4: Custom Section Tabs & Add Button */}
              {(resumeData.customSections || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {resumeData.customSections.map(sec => (
                    <button key={sec.id} onClick={() => setActiveContentSection(`custom_${sec.id}`)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                        activeContentSection === `custom_${sec.id}`
                          ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                          : "bg-white/5 border-white/5 text-slate-400 hover:text-slate-300 hover:bg-white/10"
                      }`}>
                      <Award size={14} /> {sec.title}
                    </button>
                  ))}
                </div>
              )}
              
              <button onClick={() => setShowAddSection(true)} 
                className="w-full py-2.5 mt-2 border border-dashed border-white/20 rounded-xl text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-xs font-bold flex items-center justify-center gap-2">
                <Plus size={14} /> Add Custom Section
              </button>

              {/* Personal */}
              {activeContentSection === "personal" && (
                <div className="space-y-4 animate-in fade-in">
                  <h3 className="font-syne font-bold text-white text-lg border-b border-white/10 pb-2">Profile Details</h3>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider block mb-2">Avatar (Optional)</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload}
                      className="w-full p-2 border border-white/10 rounded-xl text-xs bg-white/5 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-500/20 file:text-cyan-300 hover:file:bg-cyan-500/30 cursor-pointer text-slate-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[["name","Full Name"],["title","Job Title"],["email","Email Address"],["phone","Phone No."],["location","Location (City)"]].map(([name, ph]) => (
                      <input key={name} name={name} value={resumeData.personal[name] || ""}
                        onChange={handlePersonalChange}
                        className={`glass-input p-3 rounded-xl text-xs font-medium w-full ${name === 'name' || name === 'title' ? 'col-span-2' : 'col-span-2 sm:col-span-1'}`}
                        placeholder={ph} />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative col-span-2 sm:col-span-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Briefcase size={14}/></span>
                      <input name="linkedin" value={resumeData.personal.linkedin || ""} onChange={handlePersonalChange}
                        className="glass-input pl-9 pr-3 py-3 rounded-xl text-xs font-medium w-full" placeholder="LinkedIn URL" />
                    </div>
                    <div className="relative col-span-2 sm:col-span-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Github size={14} /></span>
                      <input name="github" value={resumeData.personal.github || ""} onChange={handlePersonalChange}
                        className="glass-input pl-9 pr-3 py-3 rounded-xl text-xs font-medium w-full" placeholder="GitHub URL" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider block mb-2">Executive Summary</label>
                    <textarea name="summary" rows={4} value={resumeData.personal.summary}
                      onChange={handlePersonalChange}
                      className="glass-input p-3 rounded-xl text-xs font-medium w-full resize-none custom-scroll"
                      placeholder="Brief overview of your professional background and goals..." />
                  </div>
                </div>
              )}

              {/* Experience */}
              {activeContentSection === "experience" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h3 className="font-syne font-bold text-white text-lg">Work Experience</h3>
                    <button onClick={addExp} className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all border border-cyan-500/30"><Plus size={14} /></button>
                  </div>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-600 bg-white/5 px-2 py-1 rounded-md">POS 0{idx + 1}</span>
                        <div className="flex gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => moveExp(exp.id, -1)} disabled={idx === 0} className="p-1.5 bg-white/10 text-slate-300 hover:bg-white/20 disabled:opacity-20 rounded-md transition-colors"><ChevronUp size={14} /></button>
                          <button onClick={() => moveExp(exp.id, 1)} disabled={idx === resumeData.experience.length - 1} className="p-1.5 bg-white/10 text-slate-300 hover:bg-white/20 disabled:opacity-20 rounded-md transition-colors"><ChevronDown size={14} /></button>
                          <button onClick={() => delExp(exp.id)} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-md transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <input value={exp.role} onChange={e => updExp(exp.id, "role", e.target.value)} placeholder="Role / Position" className="glass-input p-2.5 rounded-xl text-xs col-span-2" />
                         <input value={exp.company} onChange={e => updExp(exp.id, "company", e.target.value)} placeholder="Company Name" className="glass-input p-2.5 rounded-xl text-xs col-span-2 sm:col-span-1" />
                         <input value={exp.duration} onChange={e => updExp(exp.id, "duration", e.target.value)} placeholder="Dates (2023 - Present)" className="glass-input p-2.5 rounded-xl text-xs col-span-2 sm:col-span-1" />
                      </div>
                      <textarea value={exp.desc} onChange={e => updExp(exp.id, "desc", e.target.value)}
                        placeholder="Bullet points describing achievements and responsibilities..."
                        className="glass-input p-3 rounded-xl text-xs w-full h-24 resize-none custom-scroll" />
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {activeContentSection === "education" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h3 className="font-syne font-bold text-white text-lg">Education</h3>
                    <button onClick={addEdu} className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all border border-cyan-500/30"><Plus size={14} /></button>
                  </div>
                  {resumeData.education.map((edu, idx) => (
                    <div key={edu.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative group">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-black text-slate-600 bg-white/5 px-2 py-1 rounded-md">EDU 0{idx + 1}</span>
                         <button onClick={() => delEdu(edu.id)} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-md transition-colors opacity-40 group-hover:opacity-100"><Trash2 size={14} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input value={edu.degree || ""} onChange={e => updEdu(edu.id, "degree", e.target.value)} placeholder="Degree / Course" className="glass-input p-2.5 rounded-xl text-xs col-span-2" />
                        <input value={edu.school || ""} onChange={e => updEdu(edu.id, "school", e.target.value)} placeholder="University / School" className="glass-input p-2.5 rounded-xl text-xs col-span-2 sm:col-span-1" />
                        <input value={edu.year || ""} onChange={e => updEdu(edu.id, "year", e.target.value)} placeholder="Year (2021-2025)" className="glass-input p-2.5 rounded-xl text-xs col-span-2 sm:col-span-1" />
                      </div>
                      <textarea value={edu.desc || ""} onChange={e => updEdu(edu.id, "desc", e.target.value)}
                        placeholder="CGPA, Honors, Key Coursework..."
                        className="glass-input p-3 rounded-xl text-xs w-full h-16 resize-none custom-scroll" />
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {activeContentSection === "skills" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h3 className="font-syne font-bold text-white text-lg">Core Skills</h3>
                    <button onClick={addSkill} className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all border border-cyan-500/30"><Plus size={14} /></button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium">Add technical and soft skills. Start typing for AI suggestions.</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {resumeData.skills.map((skill, i) => (
                      <div key={i} className="relative group">
                        <input value={skill} onChange={e => updSkill(i, e.target.value)}
                          onFocus={() => setActiveSkillInput(i)}
                          onBlur={() => setTimeout(() => { setSkillSuggestions([]); setActiveSkillInput(null); }, 150)}
                          className="glass-input p-3 rounded-xl text-xs font-bold w-full"
                          placeholder="e.g. Next.js" />
                        <button onClick={() => delSkill(i)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-75 group-hover:scale-100">
                          <Trash2 size={10} />
                        </button>
                        
                        {/* Autocomplete Dropdown */}
                        {activeSkillInput === i && skillSuggestions.length > 0 && (
                          <div className="absolute z-50 top-full left-0 w-full mt-2 bg-[#0a0a0f] border border-cyan-500/30 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                            {skillSuggestions.map(s => (
                              <button key={s} onMouseDown={() => pickSugg(i, s)}
                                className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors border-b border-white/5 last:border-0">
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {activeContentSection === "projects" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <h3 className="font-syne font-bold text-white text-lg">Projects</h3>
                    <button onClick={addProj} className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all border border-cyan-500/30"><Plus size={14} /></button>
                  </div>
                  {(resumeData.projects || []).map((proj, idx) => (
                    <div key={proj.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative group">
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-black text-slate-600 bg-white/5 px-2 py-1 rounded-md">PROJ 0{idx + 1}</span>
                         <button onClick={() => delProj(proj.id)} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-md transition-colors opacity-40 group-hover:opacity-100"><Trash2 size={14} /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input value={proj.title} onChange={e => updProj(proj.id, "title", e.target.value)} placeholder="Project Name" className="glass-input p-2.5 rounded-xl text-xs col-span-2 sm:col-span-1" />
                        <input value={proj.duration || ""} onChange={e => updProj(proj.id, "duration", e.target.value)} placeholder="Dates (e.g. Jan 2026)" className="glass-input p-2.5 rounded-xl text-xs col-span-2 sm:col-span-1" />
                        <input value={proj.tech} onChange={e => updProj(proj.id, "tech", e.target.value)} placeholder="Tech Stack (React, Python...)" className="glass-input p-2.5 rounded-xl text-xs col-span-2 text-cyan-300 font-medium" />
                      </div>
                      <textarea value={proj.desc} onChange={e => updProj(proj.id, "desc", e.target.value)}
                        placeholder="Describe the problem solved, tech used, and outcome..."
                        className="glass-input p-3 rounded-xl text-xs w-full h-24 resize-none custom-scroll" />
                    </div>
                  ))}
                </div>
              )}

              {/* ✅ REQ 4: Form for Custom Sections */}
              {(resumeData.customSections || []).map(sec => (
                activeContentSection === `custom_${sec.id}` && (
                  <div key={sec.id} className="space-y-4 animate-in fade-in">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <h3 className="font-syne font-bold text-white text-lg flex items-center gap-2">
                        {sec.title}
                      </h3>
                      <div className="flex gap-2">
                        <button onClick={() => addCustomItem(sec.id)} className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all border border-cyan-500/30"><Plus size={14} /></button>
                        {/* ✅ Updated to use the new modal function */}
                        <button onClick={() => requestDeleteCustomSection(sec.id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all border border-red-500/30"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    {sec.items.length === 0 && <p className="text-xs text-slate-500">Click + to add an item to this section.</p>}
                    {sec.items.map((item, idx) => (
                      <div key={item.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3 relative group">
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-black text-slate-600 bg-white/5 px-2 py-1 rounded-md">ITEM 0{idx + 1}</span>
                           <button onClick={() => delCustomItem(sec.id, item.id)} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-md transition-colors opacity-40 group-hover:opacity-100"><Trash2 size={14} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input value={item.title} onChange={e => updCustomItem(sec.id, item.id, "title", e.target.value)} placeholder="Title / Award Name" className="glass-input p-2.5 rounded-xl text-xs col-span-2" />
                          <input value={item.subtitle} onChange={e => updCustomItem(sec.id, item.id, "subtitle", e.target.value)} placeholder="Subtitle / Issuer" className="glass-input p-2.5 rounded-xl text-xs col-span-2 sm:col-span-1" />
                          {/* ✅ Restricted Date Field with clear placeholder and max length to prevent UI breaking */}
                          <input type="text" maxLength={25} value={item.date} onChange={e => updCustomItem(sec.id, item.id, "date", e.target.value)} placeholder="Date (e.g., 2023 - 2024)" className="glass-input p-2.5 rounded-xl text-xs col-span-2 sm:col-span-1" />
                        </div>
                        <textarea value={item.desc} onChange={e => updCustomItem(sec.id, item.id, "desc", e.target.value)} placeholder="Description (Optional)" className="glass-input p-3 rounded-xl text-xs w-full h-16 resize-none custom-scroll" />
                      </div>
                    ))}
                  </div>
                )
              ))}

            </div>
          )}
        </div>
      </div>

      {/* ════════ RIGHT CANVAS AREA ════════ */}
      <div className="flex-1 relative flex flex-col overflow-hidden bg-transparent z-10">

        {/* Toolbar */}
        {/* ✅ Reduced padding (py-2 md:py-3) to make the toolbar thinner and align better */}
        <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/10 z-20">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider hidden sm:block">View Scale</span>
            <div className="flex items-center bg-white/5 rounded-xl border border-white/10 p-1">
              <button onClick={() => setZoom(z => Math.max(40, z - 10))} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-all"><ZoomOut size={14} /></button>
              <span className="text-xs font-mono text-white w-12 text-center font-bold">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(130, z + 10))} className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-all"><ZoomIn size={14} /></button>
            </div>
            <button onClick={() => setZoom(85)} className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 px-3 py-1.5 rounded-lg border border-cyan-400/20 hover:bg-cyan-500/10 transition-all hidden sm:block">FIT</button>
          </div>

          <div className="flex items-center gap-2">
            {/* ✅ REQ 2: Export PDF Button moved here to replace Live Preview */}
            <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl text-xs font-bold text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
              <Download size={14} /> Export PDF
            </button>
          </div>
        </div>

        {/* Scrollable canvas area */}
        <div className="flex-1 custom-scroll overflow-y-auto flex justify-center p-6 md:p-12 relative">
          {/* ✅ REQ 1: Applying scale to wrapper so the 'resumeRef' is strictly A4 unscaled during html-to-image capture */}
          <div
            className={`transition-all duration-300 origin-top flex justify-center h-fit`}
            style={{
              transform: `scale(${zoom / 100})`,
              marginBottom: zoom < 100 ? `-${(100 - zoom) * 2.97}mm` : "40px",
            }}
          >
            {/* The actual A4 page */}
            <div
              ref={resumeRef}
              id="resume-paper"
              className={`w-[210mm] min-h-[297mm] bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ${fontSizeClass}`}
            >
              {selectedTemplate === "modern-tech" && (
                <ModernTech data={resumeData} themeColor={themeColor} fontFamily={fontFamily} hiddenSections={hiddenSections} />
              )}
              {selectedTemplate === "classic-corp" && (
                <CorporateClassic data={resumeData} themeColor={themeColor} fontFamily={fontFamily} hiddenSections={hiddenSections} />
              )}
              {selectedTemplate === "creative-studio" && (
                <CreativeStudio data={resumeData} themeColor={themeColor} fontFamily={fontFamily} hiddenSections={hiddenSections} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}