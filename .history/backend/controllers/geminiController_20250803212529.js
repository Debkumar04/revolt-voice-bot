import { getRevoltResponse } from "../services/geminiService.js";

export const handleVoiceInteraction = async (req, res) => {
  try {
    const { prompt, language = "en-US" } = req.body;

    if (!prompt?.trim()) {
      return res.status(400).json({
        response: "Please ask about Revolt Motors products",
        error: "Empty prompt",
      });
    }

    // Add language context
    const localizedPrompt = `[Respond in ${language}] User: ${prompt}`;
    const response = await getRevoltResponse(localizedPrompt);

    res.json({
      response: response.replace(/\(.*?\)/g, ""), // Remove parentheses
      language,
    });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({
      response: "Revolt support unavailable. Visit revoltmotors.com",
      error: error.message,
    });
  }
};

// Test endpoint
export const testConnection = (req, res) => {
  res.json({
    status: "Active",
    instructions: REVOLT_SYSTEM_INSTRUCTION,
  });
};
