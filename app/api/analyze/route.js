import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { model } from "@/lib/gemini";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await extractTextFromPDF(buffer);

    const today = new Date().toLocaleDateString("en-US", { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    const prompt = `
      You are an encouraging and professional Career Coach. 
      Analyze this resume text and generate a JSON response.
      
      **CRITICAL CONTEXT (READ THIS FIRST):**
      - **Current Date:** ${today}.
      - **Future Dates:** If the user lists a graduation year (e.g., 2026, 2027) or an upcoming internship (e.g., June 2025) and today is Feb 2026, DO NOT mark this as a "Future Date Error" or "Inconsistent". It is simply their expected graduation or start date.
      - **Focus:** Judge the content, skills, and projects, not just the timeline.

      **RESUME TEXT:**
      "${text}"

      **SCORING RUBRIC (Total 100):**
      - **Impact (40):** Measurable results (numbers, %).
      - **Skills (30):** Relevant tech stack.
      - **Structure (30):** Clarity and formatting.
      - **Instruction:** If the resume is decent, score between **75-90**. Only go below 70 for very poor resumes.

      **OUTPUT FORMAT (JSON ONLY):**
      {
        "score": 85,
        "summary": "2-3 lines professional summary...",
        "strengths": ["Strength 1", "Strength 2", "Strength 3"],
        "weaknesses": ["Weakness 1 (be constructive)", "Weakness 2"],
        "improvements": ["Actionable Tip 1", "Actionable Tip 2", "Actionable Tip 3"]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Analysis failed", details: error.message }, { status: 500 });
  }
}