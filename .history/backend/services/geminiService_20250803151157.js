// services/geminiService.js
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const streamVoiceResponse = async (promptText) => {
  console.log("🔍 Prompt received:", promptText); // For debugging

  try {
    const model = ai.getGenerativeModel({
      model: process.env.MODEL_NAME || "gemini-1.5-flash",
    });

    const result = await model.generateContent(promptText);
    const response = await result.response; // Ensure response is awaited if it's a Promise
    const text = await response.text(); // Convert to plain text

    console.log("✅ Gemini Raw Response:", text);
    return text || "No meaningful response from Gemini.";
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    throw new Error("Failed to generate response from Gemini.");
  }
};
