// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const { prompt } = await request.json();
//     const apiKey = process.env.GEMINI_API_KEY;

//     if (!prompt) {
//       return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
//     }

//     const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }],
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("Gemini Error:", data);
//       return NextResponse.json({ error: data.error?.message || "AI failed" }, { status: response.status });
//     }

//     const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

//     return NextResponse.json({ text });

//   } catch (error) {
//     console.error("AI Route Crash:", error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }

// // gemini-2.5-flash 
// // gemini-2.5-pro 
// // gemini-2.0-flash 
// // gemini-2.0-flash-001 



// src/app/api/ai-enhance/route.js
// Place this file EXACTLY at: src/app/api/ai-enhance/route.js

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set in .env.local");
      return NextResponse.json(
        { error: "Server config error: GEMINI_API_KEY missing. Add it to .env.local and restart." },
        { status: 500 }
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: data.error?.message || "Gemini AI request failed" },
        { status: response.status }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) {
      console.error("Gemini returned empty response:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: "Gemini returned an empty response. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });

  } catch (error) {
    console.error("AI Route Crash:", error);
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 });
  }
}