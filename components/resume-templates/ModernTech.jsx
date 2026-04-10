import React from 'react';

// ✅ Added hiddenSections prop — controls which sections render
const ModernTech = ({ data, themeColor = "#4f46e5", fontFamily = "font-sans", hiddenSections = {} }) => {
  return (
    <div className={`w-full h-full p-10 text-slate-800 flex flex-col bg-white overflow-hidden ${fontFamily}`}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header className="border-b-4 pb-6 mb-6" style={{ borderColor: themeColor }}>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900 break-words break-all">
          {data.personal?.name || "YOUR NAME"}
        </h1>
        <p className="text-lg font-bold mt-1 break-words break-all" style={{ color: themeColor }}>
          {data.personal?.title || "Job Title"}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs font-semibold text-slate-500">
          {data.personal?.location && <span className="break-all">📍 {data.personal.location}</span>}
          {data.personal?.email    && <span className="break-all">✉️ {data.personal.email}</span>}
          {data.personal?.phone    && <span className="break-all">📞 {data.personal.phone}</span>}
          {data.personal?.linkedin && <span className="break-all">🔗 {data.personal.linkedin}</span>}

          {/* ✅ GitHub — always in header, not toggleable */}
          {data.personal?.github && (
            <span className="flex items-center gap-1 break-all">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
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
            </span>
          )}
        </div>
      </header>

      {/* ── BODY ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-8 flex-1">

        {/* LEFT COLUMN */}
        <div className="col-span-8 space-y-6 overflow-hidden">

          {/* Profile */}
          {data.personal?.summary && (
            <section>
              {/* ✅ Standardized Header Style */}
              <h2 className="text-sm font-black uppercase tracking-widest mb-3 border-b-2 pb-1" style={{ color: themeColor, borderColor: themeColor }}>
                Profile
              </h2>
              <p className="text-sm leading-relaxed text-justify break-words break-all whitespace-pre-wrap">
                {data.personal.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {!hiddenSections.experience && data.experience && data.experience.length > 0 && (
            <section>
              {/* ✅ Standardized Header Style */}
              <h2 className="text-sm font-black uppercase tracking-widest mb-3 border-b-2 pb-1" style={{ color: themeColor, borderColor: themeColor }}>
                Experience
              </h2>
              {data.experience.map((exp) => (
                <div key={exp.id} className="mb-4 overflow-hidden">
                  <div className="flex justify-between items-baseline flex-wrap gap-2">
                    <h3 className="font-bold text-base text-slate-800 break-words flex-1">{exp.role}</h3>
                    {/* ✅ Standardized Date Pill */}
                    {exp.duration && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded whitespace-nowrap shrink-0">
                        {exp.duration}
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-xs mb-1 break-words" style={{ color: themeColor }}>
                    {exp.company}
                  </p>
                  <p className="text-xs text-slate-600 leading-snug break-words whitespace-pre-wrap">
                    {exp.desc}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {!hiddenSections.projects && data.projects && data.projects.length > 0 && (
            <section>
              {/* ✅ Standardized Header Style */}
              <h2 className="text-sm font-black uppercase tracking-widest mb-3 border-b-2 pb-1" style={{ color: themeColor, borderColor: themeColor }}>
                Projects
              </h2>
              {data.projects.map((proj) => (
                <div key={proj.id} className="mb-4 overflow-hidden">
                  
                  {/* Row 1: Title and Date */}
                  <div className="flex justify-between items-baseline flex-wrap gap-2">
                    <h3 className="font-bold text-base text-slate-800 break-words flex-1">{proj.title}</h3>
                    {/* ✅ Standardized Date Pill */}
                    {proj.duration && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded whitespace-nowrap shrink-0">
                        {proj.duration}
                      </span>
                    )}
                  </div>
                  
                  {/* Row 2: Tech Skills */}
                  {/* Row 2: Tech Skills */}
                  {proj.tech && (
                    <div className="flex flex-wrap gap-1.5 mt-2 mb-2 w-full">
                      {proj.tech.split(',').filter(t => t.trim() !== '').map((tech, i) => (
                        <span
                          key={i}
                          // ✅ Removed break-all, added whitespace-nowrap
                          className="bg-slate-50 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 whitespace-nowrap inline-block"
                          style={{ color: themeColor }}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Row 3: Description */}
                  <p className="text-xs text-slate-600 leading-snug mt-1 break-words whitespace-pre-wrap">
                    {proj.desc}
                  </p>
                </div>
              ))}
            </section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-4 space-y-6 overflow-hidden">

          {/* Skills */}
          {/* Skills */}
          {!hiddenSections.skills && data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 border-b pb-1">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2 w-full">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    // ✅ Removed break-words and break-all, added whitespace-nowrap
                    className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold border border-slate-200 whitespace-nowrap inline-block"
                    style={{ color: themeColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* CUSTOM SECTIONS (Modern Tech Style) */}
          {data.customSections && data.customSections.length > 0 && data.customSections.map(sec => (
            !hiddenSections?.[`custom_${sec.id}`] && (
              <div key={sec.id} className="mb-6 break-inside-avoid">
                {/* ✅ Standardized Header Style */}
                <h2 className="text-sm font-black uppercase tracking-widest mb-3 border-b-2 pb-1" style={{ color: themeColor, borderColor: themeColor }}>
                  {sec.title}
                </h2>
                
                <div className="space-y-4">
                  {sec.items.map(item => (
                    <div key={item.id} className="relative">
                      {/* Flex layout with gap-4 ensures title and date never overlap */}
                      <div className="flex justify-between items-baseline mb-1 gap-2">
                        <h3 className="font-bold text-base text-slate-800 break-words flex-1">
                          {item.title}
                        </h3>
                        
                        {/* ✅ Standardized Date Pill */}
                        {item.date && (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded whitespace-nowrap shrink-0">
                            {item.date}
                          </span>
                        )}
                      </div>
                      
                      {/* Subtitle & Description with break-words to prevent horizontal overflow */}
                      {item.subtitle && (
                        <div className="text-xs font-bold mb-1 break-words" style={{ color: themeColor }}>
                          {item.subtitle}
                        </div>
                      )}
                      
                      {item.desc && (
                        <p className="text-xs text-slate-600 leading-snug break-words whitespace-pre-wrap">
                          {item.desc}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}

          {/* Education */}
          {!hiddenSections.education && data.education && data.education.length > 0 && (
            <section>
              {/* ✅ Standardized Header Style */}
              <h2 className="text-sm font-black uppercase tracking-widest mb-3 border-b-2 pb-1" style={{ color: themeColor, borderColor: themeColor }}>
                Education
              </h2>
              {data.education.map((edu) => (
                <div key={edu.id} className="mb-4 overflow-hidden">
                  <div className="flex justify-between items-baseline flex-wrap gap-2 mb-1">
                    <h3 className="font-bold text-base text-slate-800 break-words flex-1">{edu.degree}</h3>
                    {/* ✅ Standardized Date Pill */}
                    {edu.year && (
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-1 rounded whitespace-nowrap shrink-0">
                        {edu.year}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold break-words" style={{ color: themeColor }}>
                    {edu.school}
                  </p>
                  {edu.desc && (
                    <p className="text-xs text-slate-600 mt-1 break-words whitespace-pre-wrap">
                      {edu.desc}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

        </div>
      </div>
    </div>
  );
};

export default ModernTech;