import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Best stable model from your list
export const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-lite-latest" 
  // model: "gemini-2.0-flash"
});

// Note: Agar 2.0 par dobara limit (429) aaye, 
// toh aap "gemini-flash-lite-latest" try kar sakti hain.