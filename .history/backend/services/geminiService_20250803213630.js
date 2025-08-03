import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// VALID MODELS (May 2024)
const WORKING_MODELS = {
  FLASH_LATEST: "gemini-1.5-flash-latest",
  PRO_LATEST: "gemini-1.5-pro-latest",
  FLASH: "gemini-1.5-flash",
  PRO: "gemini-1.5-pro",
};

const REVOLT_INSTRUCTIONS = {
  role: "user",
  parts: [
    {
      text: `You are "Rev", the official AI assistant for Revolt Motors.
    Only discuss:
    - RV300/RV400 specifications
    - Battery/charging info
    - Dealership services
    
    For other queries respond:
    "I specialize in Revolt electric bikes. Visit revoltmotors.com"`,
    },
  ],
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getRevoltResponse(prompt) {
  // Try models in order of preference
  const modelsToTry = [
    WORKING_MODELS.FLASH_LATEST,
    WORKING_MODELS.FLASH,
    WORKING_MODELS.PRO_LATEST,
    WORKING_MODELS.PRO,
  ];

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      });

      const chat = model.startChat({
        systemInstruction: REVOLT_INSTRUCTIONS,
        history: [
          {
            role: "model",
            parts: [{ text: "Hello! How can I help with Revolt bikes today?" }],
          },
        ],
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response.text();

      return response || "Please visit revoltmotors.com";
    } catch (error) {
      if (!error.message.includes("model not found")) {
        console.error(`Attempt with ${modelName} failed:`, error.message);
        throw new Error("Service unavailable. Please try again later.");
      }
      // Continue to next model if 404
    }
  }

  throw new Error("All models failed. Try again later.");
}
