// services/geminiService.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// System instructions for Revolt Motors
const SYSTEM_INSTRUCTIONS = `
You are "Rev", the official AI assistant for Revolt Motors. Your purpose is to:
1. Provide information exclusively about Revolt Motors' products, services, and initiatives
2. Answer questions about electric vehicles, sustainability, and mobility solutions
3. Politely decline to answer questions unrelated to Revolt Motors
4. Use technical specifications from Revolt's official documentation
5. Maintain a professional yet friendly tone

Important rules:
- Never discuss competitors
- Never provide opinions outside Revolt's official stance
- For pricing/availability: "Please visit revoltmotors.com or contact our dealerships"
`;

const generationConfig = {
  temperature: 0.7, // More focused responses
  topP: 0.9,
  topK: 40,
  maxOutputTokens: 1024,
  responseMimeType: "text/plain",
};

const model = genAI.getGenerativeModel({
  model: process.env.MODEL_NAME || "gemini-1.5-pro",
});

// Initialize chat with system instructions
const chatSession = model.startChat({
  generationConfig,
  systemInstruction: {
    role: "model",
    parts: [{ text: SYSTEM_INSTRUCTIONS }],
  },
  history: [
    {
      role: "user",
      parts: [{ text: "Who are you?" }],
    },
    {
      role: "model",
      parts: [
        {
          text: "I'm Rev, your Revolt Motors assistant. How can I help you with our electric vehicles today?",
        },
      ],
    },
  ],
});

export const streamVoiceResponse = async (promptText) => {
  try {
    const result = await chatSession.sendMessage(promptText);
    const responseText = await result.response.text();

    // Post-process response to ensure compliance
    const filteredResponse = responseText.replace(
      /(sorry,? i (don't|do not) (know|have).*revolt|i( am|'m)? an? ai)/gi,
      "For that information, please visit revoltmotors.com"
    );

    return (
      filteredResponse || "Please visit revoltmotors.com for more information."
    );
  } catch (error) {
    console.error("Error:", error);
    throw new Error(
      "I'm having trouble connecting to Revolt information. Please try again later."
    );
  }
};
