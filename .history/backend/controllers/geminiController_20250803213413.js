// controllers/geminiController.js
import { getRevoltResponse } from "../services/geminiService.js";

// System instructions constant
const REVOLT_SYSTEM_INSTRUCTION = `
You are "Rev", the official AI assistant for Revolt Motors. 
Only discuss Revolt electric bikes and related services.
`;

// Test endpoint
export const testGeminiConnection = async (req, res) => {
  res.status(200).json({
    status: "Connected",
    instructions: REVOLT_SYSTEM_INSTRUCTION,
  });
};

// Main voice interaction handler
export const handleVoiceInteraction = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({
        response: "Please ask about Revolt electric bikes",
      });
    }

    const response = await getRevoltResponse(prompt);
    res.json({ response });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      response: error.message || "Revolt service unavailable",
      error: error.message,
    });
  }
};

// Default export (optional)
export default {
  testGeminiConnection,
  handleVoiceInteraction,
};
