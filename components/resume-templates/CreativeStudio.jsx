import React from 'react';

const CreativeStudio = ({ data, themeColor = "#4f46e5", fontFamily = "font-sans", hiddenSections = {} }) => {
  const nameParts = (data.personal?.name || "YOUR NAME").split(" ");
  const firstName = nameParts[0];
  const lastName  = nameParts.slice(1).join(" ");

  return (
    <div className={`w-full min-h-[297mm] flex font-sans text-slate-800 bg-white overflow-hidden ${fontFamily}`}>

      {/* ── LEFT SIDEBAR ────── */}
      <div className="w-[35%] p-8 text-white flex flex-col shadow-2xl z-10" style={{ backgroundColor: themeColor }}>

        {/* Profile photo */}
        <div className="flex justify-center mb-6">
          {data.personal?.image ? (
            <img
              src={data.personal.image}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border-4 border-white/50 bg-black/10 flex items-center justify-center text-xs font-bold shadow-lg text-white/70">
              NO PHOTO
            </div>
          )}
        </div>

        <section className="mb-6">
          <h2 className="text-xs font-black uppercase tracking-widest mb-3 border-b border-white/30 pb-1">
            Contact
          </h2>
          <div className="space-y-2 text-[10px] break-words break-all text-white/90">
            {data.personal?.email    && <p>✉️ {data.personal.email}</p>}
            {data.personal?.phone    && <p>📞 {data.personal.phone}</p>}
            {data.personal?.location && <p>📍 {data.personal.location}</p>}
            {data.personal?.linkedin && <p>🔗 {data.personal.linkedin}</p>}
  
            {data.personal?.github && (
              <p className="flex items-center gap-1 break-all">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
                  0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                  -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
                  .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
                  -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004
                  1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7
                  1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0
                  1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484
                  17.522 2 12 2z"/>
                </svg>
                {data.personal.github}
              </p>
            )}
          </div>
        </section>

        {/* Skills */}
        {!hiddenSections.skills && data.skills && data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest mb-3 border-b border-white/30 pb-1">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white/20 px-2 py-1 rounded text-[9px] font-bold break-words break-all backdrop-blur-sm shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/*  Education */}
        {!hiddenSections.education && data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest mb-3 border-b border-white/30 pb-1">
              Education
            </h2>
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-3">
                <h3 className="font-bold text-[11px] break-words break-all">{edu.degree}</h3>
                <p className="text-[10px] text-white/80 break-words break-all">{edu.school}</p>
                <p className="text-[9px] text-white/60 italic break-words break-all mt-0.5">{edu.year}</p>
                {edu.desc && (
                  <p className="text-[9px] text-white/70 mt-1 break-words break-all whitespace-pre-wrap leading-snug">
                    {edu.desc}
                  </p>
                )}
              </div>
            ))}
          </section>
        )}
      </div>

      {/* ── RIGHT CONTENT ─ */}
      <div className="w-[65%] p-10 flex flex-col bg-slate-50">

        <header className="mb-8 border-b-2 border-slate-200 pb-6">
          <h1 className="text-5xl font-black uppercase tracking-tighter leading-none text-slate-900 break-words break-all">
            {firstName} <br />
            <span style={{ color: themeColor }}>{lastName}</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest break-words break-all">
            {data.personal?.title || "Professional Title"}
          </p>
        </header>

        <div className="space-y-6 flex-1 overflow-hidden">

          {/* Profile */}
          {data.personal?.summary && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: themeColor }}>
                  Profile
                </h2>
                <div className="h-[2px] flex-1 opacity-20" style={{ backgroundColor: themeColor }}></div>
              </div>
              <p className="text-[11px] leading-relaxed text-justify text-slate-600 break-words break-all whitespace-pre-wrap pl-3">
                {data.personal.summary}
              </p>
            </section>
          )}

          {/*  Experience */}
          {!hiddenSections.experience && data.experience && data.experience.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: themeColor }}>
                  Experience
                </h2>
                <div className="h-[2px] flex-1 opacity-20" style={{ backgroundColor: themeColor }}></div>
              </div>
              
              {data.experience.map((exp) => (
                <div
                  key={exp.id}
                  className="mb-4 overflow-hidden relative pl-4 border-l-2"
                  style={{ borderColor: themeColor + '40' }}
                >
                  <div
                    className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5"
                    style={{ backgroundColor: themeColor }}
                  />
                  <div className="flex justify-between items-baseline flex-wrap gap-4">
                    <h3 className="font-bold text-[12px] break-words break-all text-slate-900 flex-1">{exp.role}</h3>
                    {exp.duration && (
                      <span 
                        className="text-[9px] font-bold px-2 py-0.5 rounded shrink-0 uppercase tracking-wider whitespace-nowrap"
                        style={{ backgroundColor: themeColor + '15', color: themeColor }}
                      >
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold mt-0.5 break-words break-all" style={{ color: themeColor }}>
                    {exp.company}
                  </p>
                  <p className="text-[10px] text-slate-600 leading-snug break-words break-all whitespace-pre-wrap mt-1">
                    {exp.desc}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/*  Projects */}
          {!hiddenSections.projects && data.projects && data.projects.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: themeColor }}>
                  Projects
                </h2>
                <div className="h-[2px] flex-1 opacity-20" style={{ backgroundColor: themeColor }}></div>
              </div>

              {data.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="mb-4 overflow-hidden relative pl-4 border-l-2"
                  style={{ borderColor: themeColor + '40' }}
                >
                  <div
                    className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5"
                    style={{ backgroundColor: themeColor }}
                  />
                  <div className="flex justify-between items-baseline flex-wrap gap-4">
                    <h3 className="font-bold text-[12px] break-words break-all text-slate-900 flex-1">
                      {proj.title}
                    </h3>
                    {proj.duration && (
                      <span 
                        className="text-[9px] font-bold px-2 py-0.5 rounded shrink-0 uppercase tracking-wider whitespace-nowrap"
                        style={{ backgroundColor: themeColor + '15', color: themeColor }}
                      >
                        {proj.duration}
                      </span>
                    )}
                  </div>
                  
                  {proj.tech && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5 mb-1.5">
                      {proj.tech.split(',').filter(t => t.trim() !== '').map((tech, i) => (
                        <span
                          key={i}
                          className="font-bold text-[8px] px-1.5 py-0.5 rounded uppercase tracking-wider border"
                          style={{ backgroundColor: themeColor + '05', color: themeColor, borderColor: themeColor + '20' }}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-slate-600 leading-snug mt-1.5 break-words break-all whitespace-pre-wrap">
                    {proj.desc}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* CUSTOM SECTIONS*/}
          {data.customSections && data.customSections.length > 0 && data.customSections.map(sec => (
            !hiddenSections?.[`custom_${sec.id}`] && (
              <section key={sec.id} className="mb-6 break-inside-avoid">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xs font-black uppercase tracking-widest" style={{ color: themeColor }}>
                    {sec.title}
                  </h2>
                  <div className="h-[2px] flex-1 opacity-20" style={{ backgroundColor: themeColor }}></div>
                </div>

                <div className="space-y-4">
                  {sec.items.map(item => (
                    <div key={item.id} className="relative pl-4 border-l-2" style={{ borderColor: themeColor + '40' }}>
                   
                      <div 
                        className="absolute w-2 h-2 rounded-full -left-[5px] top-1.5" 
                        style={{ backgroundColor: themeColor }}
                      ></div>
                      
                      <div className="flex justify-between items-baseline gap-4">
                        {/* Title with word-break to prevent overflow */}
                        <h3 className="font-bold text-[12px] text-slate-900 break-words flex-1">
                          {item.title}
                        </h3>
                        
                        {item.date && (
                          <span 
                            className="text-[9px] font-bold px-2 py-0.5 rounded shrink-0 uppercase tracking-wider whitespace-nowrap"
                            style={{ backgroundColor: themeColor + '15', color: themeColor }}
                          >
                            {item.date}
                          </span>
                        )}
                      </div>
                      
                      {item.subtitle && (
                        <div className="text-[10px] font-bold mt-0.5 break-words" style={{ color: themeColor }}>
                          {item.subtitle}
                        </div>
                      )}
                      
                      {item.desc && (
                        <p className="text-[10px] text-slate-600 mt-1 leading-snug break-words whitespace-pre-wrap">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )
          ))}

        </div>
      </div>
    </div>
  );
};

export default CreativeStudio;