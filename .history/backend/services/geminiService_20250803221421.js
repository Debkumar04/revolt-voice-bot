import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const MODEL_NAME = "gemini-2.0-flash"; // Updated to current working model

// System instructions for Revolt Motors
const SYSTEM_INSTRUCTIONS = `
You are "Rev", the official AI assistant for Revolt Motors.
Only discuss:
- RV300 and RV400 specifications
- Battery and charging information
- Dealership services

For other queries respond:
"I specialize in Revolt electric bikes. Visit revoltmotors.com"
`;

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getRevoltResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 1000,
      },
    });

    const chat = model.startChat({
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
              text: "I'm Rev, your Revolt Motors assistant. How can I help with our electric bikes today?",
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response.text();

    return response || "Please visit revoltmotors.com for more information";
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Handle specific errors
    if (error.message.includes("quota")) {
      throw new Error("Our servers are busy. Please try again later.");
    }
    if (error.message.includes("model not found")) {
      throw new Error("Service is currently upgrading. Please try again soon.");
    }

    throw new Error(
      "I'm having trouble accessing Revolt information. Please try again."
    );
  }
}
