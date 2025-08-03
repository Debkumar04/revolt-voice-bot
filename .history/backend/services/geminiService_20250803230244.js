// services/geminiService.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

// Configuration for generation
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Create persistent chat session
const model = genAI.getGenerativeModel({
  model: process.env.MODEL_NAME || "gemini-1.5-pro",
});

const chatSession = model.startChat({
  generationConfig,
});

// Export function to interact with Gemini via chat
export const streamVoiceResponse = async (promptText) => {
  console.log("🔍 Prompt received:", promptText);

  try {
    const result = await chatSession.sendMessage(promptText);
    const responseText = await result.response.text();

    console.log("✅ Gemini Response:", responseText);
    return responseText || "No meaningful response from Gemini.";
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    throw new Error("Failed to generate response from Gemini.");
  }
};
