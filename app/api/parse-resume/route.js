import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const prompt = `
      You are a strict JSON generator. Convert the following Resume Text into a valid JSON object.
      
      RULES:
      1. Return ONLY the JSON object. Do not include markdown formatting (like \`\`\`json).
      2. Do not include any introductory text or comments.
      3. Ensure all arrays have commas between items.
      4. If a field is missing, use an empty string "" or empty array [].
      
      Resume Text: "${resumeText.slice(0, 4000)}"

      Required Structure:
      {
        "personalInfo": {
          "name": "Full Name",
          "email": "Email",
          "phone": "Phone",
          "location": "City, Country",
          "summary": "Professional summary"
        },
        "education": [
          { "degree": "Degree", "school": "University", "year": "Year" }
        ],
        "experience": [
          { "role": "Role", "company": "Company", "duration": "Dates", "description": ["Point 1", "Point 2"] }
        ],
        "skills": ["Skill 1", "Skill 2"],
        "projects": [
           { "title": "Project Name", "technologies": "Tech Stack", "description": "Brief description" }
        ],
        "certificates": [
           { "name": "Certificate Name", "issuer": "Issuer", "year": "Year" }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const jsonStartIndex = responseText.indexOf('{');
    const jsonEndIndex = responseText.lastIndexOf('}');

    if (jsonStartIndex === -1 || jsonEndIndex === -1) {
      throw new Error("AI did not return a valid JSON object");
    }

    const cleanJson = responseText.substring(jsonStartIndex, jsonEndIndex + 1);
    
    let parsedData;
    try {
        parsedData = JSON.parse(cleanJson);
    } catch (e) {
        console.error("JSON Parse Fix Failed. Raw text:", responseText);
        const fixedJson = cleanJson.replace(/,\s*}/g, '}'); 
        parsedData = JSON.parse(fixedJson);
    }

    return NextResponse.json({ data: parsedData });

  } catch (error) {
    console.error("Parse Error Details:", error);
    return NextResponse.json({ 
        error: "Failed to parse resume", 
        details: error.message 
    }, { status: 500 });
  }
}