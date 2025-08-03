import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { setTimeout } from "timers/promises";

dotenv.config();

// Configuration
const REVOLT_SYSTEM_INSTRUCTION = `
You are "Rev", the official AI assistant for Revolt Motors. Your purpose is to:
1. Provide information exclusively about Revolt Motors' electric bikes and services
2. Answer technical questions about RV300, RV400 models
3. Politely decline non-Revolt queries with: "I specialize in Revolt Motors products"
4. For pricing/availability: "Please visit revoltmotors.com or contact dealerships"

Rules:
- Never discuss competitors
- Never provide unofficial specifications
- Always respond in the user's language
`;

const config = {
  model: "gemini-1.0-pro", // Free tier model
  temperature: 0.7,
  topP: 0.9,
  maxOutputTokens: 1024,
};

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel(config);
const chat = model.startChat({
  systemInstruction: {
    role: "model",
    parts: [{ text: REVOLT_SYSTEM_INSTRUCTION }],
  },
});

// Response cache to prevent quota issues
const responseCache = new Map();

export async function getRevoltResponse(prompt) {
  // Check cache first
  if (responseCache.has(prompt)) {
    await setTimeout(1000); // Artificial delay for realism
    return responseCache.get(prompt);
  }

  try {
    const result = await chat.sendMessage(prompt);
    const response = await result.response.text();

    // Cache response for 10 minutes
    responseCache.set(prompt, response);
    setTimeout(() => responseCache.delete(prompt), 600000);

    return response;
  } catch (error) {
    if (error.message.includes("429")) {
      console.warn("⚠️ Rate limit hit - Using fallback response");
      return "Our Revolt support is currently busy. Please visit revoltmotors.com for details.";
    }
    console.error("Gemini Error:", error);
    return "I'm having trouble accessing Revolt information. Please try again later.";
  }
}
