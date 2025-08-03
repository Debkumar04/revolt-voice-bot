import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Valid model names (as of May 2024)
const SUPPORTED_MODELS = {
  FLASH: "gemini-1.5-flash",
  PRO: "gemini-1.5-pro",
  FREE_TIER: "gemini-pro", // Free tier model name
};

const REVOLT_INSTRUCTIONS = `
You are "Rev", the official AI assistant for Revolt Motors.
Only discuss:
- RV300 and RV400 specifications
- Battery and charging information
- Revolt dealership services

For other queries respond:
"I specialize in Revolt electric bikes. Visit revoltmotors.com for more info."
`;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getRevoltResponse(prompt) {
  try {
    // Use free tier model by default
    const model = genAI.getGenerativeModel({
      model: SUPPORTED_MODELS.FREE_TIER,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: REVOLT_INSTRUCTIONS }],
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

    if (error.message.includes("model not found")) {
      throw new Error(
        "Our AI service is currently upgrading. Please try again later."
      );
    }

    if (error.message.includes("quota")) {
      throw new Error(
        "Our servers are busy. Please try again in a few minutes."
      );
    }

    throw new Error(
      "I'm having trouble accessing Revolt information. Please try again."
    );
  }
}
