router.get("/test", testGeminiConnection);
router.post("/", handleVoiceInteraction); // No multer needed

import { streamVoiceResponse } from "../services/geminiService.js";

export const testGeminiConnection = async (req, res) => {
  res.status(200).json({ message: "Gemini backend is connected ✅" });
};

export const handleVoiceInteraction = async (req, res) => {
  try {
    const prompt = req.body.prompt;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    console.log("✅ Prompt received:", prompt);

    const responseText = await streamVoiceResponse(prompt); // Send text instead of audio

    console.log("✅ Gemini responded:", responseText);

    res.json({ response: responseText });
  } catch (error) {
    console.error("❌ Error handling voice interaction:", error.message);
    res.status(500).json({ error: error.message });
  }
};
