// services/geminiService.js
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const streamVoiceResponse = async (promptText) => {
  console.log("🔍 Prompt received:", promptText);

  try {
    const model = genAI.getGenerativeModel({
      model: process.env.MODEL_NAME || "gemini-1.5-pro",
    });

    const result = await model.generateContent(promptText);

    const response = await result.response;
    const text = response.text();

    console.log("✅ Gemini Raw Response:", text);
    return text || "No meaningful response from Gemini.";
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    throw new Error("Failed to generate response from Gemini.");
  }
};
