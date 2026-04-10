import React from 'react';

// ✅ hiddenSections prop added — controls which sections render
const CorporateClassic = ({ data, themeColor = "#000000", fontFamily = "font-serif", hiddenSections = {} }) => {
  return (
    <div className={`w-full h-full p-12 text-slate-900 bg-white overflow-hidden ${fontFamily}`}>

      {/* ── HEADER  */}
      <header className="text-center border-b-[2px] pb-5 mb-6" style={{ borderColor: themeColor }}>
        <h1 className="text-3xl font-bold uppercase tracking-widest break-words break-all" style={{ color: themeColor }}>
          {data.personal?.name || "YOUR NAME"}
        </h1>
        <p className="text-sm font-semibold text-slate-600 mt-1 uppercase tracking-wider break-words break-all">
          {data.personal?.title || "Professional Title"}
        </p>
        <div className="flex justify-center flex-wrap gap-2 mt-3 text-[11px] text-slate-600">
          {data.personal?.email    && <span className="break-all">{data.personal.email}</span>}
          {data.personal?.phone    && <span className="break-all">| {data.personal.phone}</span>}
          {data.personal?.location && <span className="break-all">| {data.personal.location}</span>}
          {data.personal?.linkedin && <span className="break-all">| {data.personal.linkedin}</span>}
  
          {data.personal?.github && (
            <span className="flex items-center gap-1 break-all">
              | <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
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

      {/* ── BODY ──── */}
      <div className="space-y-5">

        {/* Profile  */}
        {data.personal?.summary && (
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-widest mb-2 border-b-[2px] pb-1"
              style={{ color: themeColor, borderColor: themeColor + '4d' }}>
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-justify break-words break-all whitespace-pre-wrap text-slate-700">
              {data.personal.summary}
            </p>
          </section>
        )}

        {/*  Experience */}
        {!hiddenSections.experience && data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-widest mb-3 border-b-[2px] pb-1"
              style={{ color: themeColor, borderColor: themeColor + '4d' }}>
              Work Experience
            </h2>
            {data.experience.map((exp) => (
              <div key={exp.id} className="mb-4 overflow-hidden">
                <div className="flex justify-between items-baseline flex-wrap gap-4">
                  {/* Role and Company */}
                  <h3 className="font-bold text-[13px] break-words break-all text-slate-900 flex-1 w-full">
                    {exp.role}{' '}
                    <span className="font-semibold italic" style={{ color: themeColor }}>at {exp.company}</span>
                  </h3>
                  {/* Date locked right */}
                  <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap shrink-0">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-[11px] text-slate-700 leading-snug break-words break-all whitespace-pre-wrap mt-1.5 pl-4 border-l-[2px]"
                  style={{ borderColor: themeColor + '33' }}>
                  {exp.desc}
                </p>
              </div>
            ))}
          </section>
        )}

        {/*  Projects */}
        {!hiddenSections.projects && data.projects && data.projects.length > 0 && (
          <section>
            <h2 className="text-[13px] font-bold uppercase tracking-widest mb-3 border-b-[2px] pb-1"
              style={{ color: themeColor, borderColor: themeColor + '4d' }}>
              Projects
            </h2>
            {data.projects.map((proj) => (
              <div key={proj.id} className="mb-3 overflow-hidden">
                <div className="flex justify-between items-baseline flex-wrap gap-4">
                  {/* Title and Tech */}
                  <h3 className="font-bold text-[12px] break-words break-all text-slate-900 flex-1 w-full">
                    {proj.title}{' '}
                    {proj.tech && (
                      <span className="font-medium text-[10px] italic text-slate-500 ml-1">
                        | {proj.tech.split(',').map(t => t.trim()).join(' • ')}
                      </span>
                    )}
                  </h3>
                  {proj.duration && (
                    <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap shrink-0">
                      {proj.duration}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-700 leading-snug mt-1 break-words break-all whitespace-pre-wrap">
                  {proj.desc}
                </p>
              </div>
            ))}
          </section>
        )}

        {/* CUSTOM SECTIONS  */}
        {data.customSections && data.customSections.length > 0 && data.customSections.map(sec => (
          !hiddenSections?.[`custom_${sec.id}`] && (
            <div key={sec.id} className="mb-6 break-inside-avoid">
              <h2 
                className="text-[13px] font-bold uppercase tracking-widest mb-3 border-b-[2px] pb-1" 
                style={{ color: themeColor, borderColor: themeColor + '4d' }}
              >
                {sec.title}
              </h2>
              
              <div className="space-y-3">
                {sec.items.map(item => (
                  <div key={item.id} className="relative">
                    <div className="flex justify-between items-baseline gap-4 w-full">
                      <h3 className="font-bold text-[12px] text-slate-900 break-words flex-1 w-full">
                        {item.title}
                      </h3>
                    
                      {item.date && (
                        <span className="text-[11px] font-semibold text-slate-600 whitespace-nowrap shrink-0">
                          {item.date}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <div className="text-[11px] font-semibold italic mt-0.5 break-words" style={{ color: themeColor }}>
                        {item.subtitle}
                      </div>
                    )}
                    
                    {item.desc && (
                      <p className="text-[11px] text-slate-700 mt-1 leading-snug break-words whitespace-pre-wrap">
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {(!hiddenSections.education || !hiddenSections.skills) && (
          <div className="grid grid-cols-2 gap-8">

            {/*Education */}
            {!hiddenSections.education && data.education && data.education.length > 0 && (
              <section>
                <h2 className="text-[13px] font-bold uppercase tracking-widest mb-3 border-b-[2px] pb-1"
                  style={{ color: themeColor, borderColor: themeColor + '4d' }}>
                  Education
                </h2>
                {data.education.map((edu) => (
                  <div key={edu.id} className="mb-3 overflow-hidden">
                    <h3 className="font-bold text-[12px] text-slate-900 break-words break-all">{edu.degree}</h3>
                    <p className="text-[11px] font-semibold italic break-words break-all mt-0.5" style={{ color: themeColor }}>
                      {edu.school}
                    </p>
                    <p className="text-[10px] font-semibold text-slate-500 break-words break-all mt-0.5">{edu.year}</p>
                    {edu.desc && (
                      <p className="text-[10px] text-slate-700 mt-1 break-words break-all whitespace-pre-wrap leading-snug">
                        {edu.desc}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/*  Skills */}
            {!hiddenSections.skills && data.skills && data.skills.length > 0 && (
              <section>
                <h2 className="text-[13px] font-bold uppercase tracking-widest mb-3 border-b-[2px] pb-1"
                  style={{ color: themeColor, borderColor: themeColor + '4d' }}>
                  Technical Skills
                </h2>
                <p className="text-[11px] leading-relaxed font-medium text-slate-700 break-words break-all">
                  {data.skills.join(" • ")}
                </p>
              </section>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default CorporateClassic;