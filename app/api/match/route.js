import { NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { model } from "@/lib/gemini";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    if (!file) {
      return NextResponse.json({ error: "Resume is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractTextFromPDF(buffer);

    // extraction only
    if (!jobDescription || jobDescription === "General Software Engineering Role") {
         return NextResponse.json({ resumeText: resumeText });
    }

    // matching
    const prompt = `
      You are an expert ATS Scanner. Compare the Resume with the Job Description (JD).
      RESUME: "${resumeText}"
      JD: "${jobDescription}"
      
      OUTPUT JSON:
      {
        "matchScore": 85,
        "compatibilityLabel": "High Match",
        "missingKeywords": [{"name": "Docker", "learningLink": "https://youtube.com"}],
        "matchingKeywords": ["React", "Node"],
        "analysis": "Brief analysis..."
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanJson);

    //Response Return 
    return NextResponse.json({ 
        ...data, 
        resumeText: resumeText 
    });

  } catch (error) {
    console.error("Match Error:", error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}