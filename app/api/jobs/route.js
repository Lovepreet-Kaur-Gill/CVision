import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: "Resume text missing" }, { status: 400 });
    }

    const aiPrompt = `
      Extract a generic Job Title and top 2 critical skills from this resume.
      IMPORTANT: Return ONLY a raw JSON object. No conversation.
      Format: {"title": "Software Engineer", "skills": "React, Python"}
      Resume: "${resumeText.slice(0, 2000)}" 
    `;

    const aiResult = await model.generateContent(aiPrompt);
    const responseText = aiResult.response.text();
    
    let keywords;
    try {
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      keywords = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("AI JSON Parse Error. Raw Text:", responseText);
      // Fallback data so the user still sees something
      keywords = { title: "Software Engineer", skills: "Full Stack" };
    }

    // Search Function 
    const searchJobs = async (query) => {
      const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '79660250dcmshe7829269964fd64p12ae97jsn954fc96ea2ee', 
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      });
      if (!res.ok) return { data: [] };
      return await res.json();
    };

    // simplified query for better match results
    let searchQuery = `${keywords.title} in India ${keywords.skills}`;
    let jobData = await searchJobs(searchQuery);
    let jobs = jobData.data || [];

    if (jobs.length === 0) {
      console.log("Strict search failed, trying broad search...");
      searchQuery = `${keywords.title} jobs in India`; 
      jobData = await searchJobs(searchQuery);
      jobs = jobData.data || [];
    }

    return NextResponse.json({ 
      jobs: jobs, 
      suggestedTitle: keywords.title 
    });

  } catch (error) {
    console.error("Job API Error:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error.message 
    }, { status: 500 });
  }
}