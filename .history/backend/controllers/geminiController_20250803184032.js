// controllers/geminiController.js
import { streamVoiceResponse } from "../services/geminiService.js";

export const handleVoiceInteraction = async (req, res) => {
  try {
    const { prompt, language = 'en-US' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    // Add language context to prompt
    const localizedPrompt = `[Respond in ${language}] User: ${prompt}`;
    const responseText = await streamVoiceResponse(localizedPrompt);

    res.json({ 
      response: responseText,
      language // Send back for frontend validation
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ 
      error: "Revolt service unavailable. Please try again later.",
      details: error.message 
    });
  }
};