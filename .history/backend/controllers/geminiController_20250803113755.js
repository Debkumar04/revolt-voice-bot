// controllers/geminiController.js
import { streamVoiceResponse } from "../services/geminiService.js";

export const testGeminiConnection = async (req, res) => {
  try {
    res.status(200).json({ message: "Gemini backend is connected ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleVoiceInteraction = async (req, res) => {
  try {
    const audioBuffer = req.file?.buffer;

    if (!audioBuffer) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const responseText = await streamVoiceResponse(audioBuffer);
    res.json({ message: responseText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
