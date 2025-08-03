import { getTestResponse } from "../services/geminiService.js";

export const testGeminiConnection = async (req, res, next) => {
  try {
    const reply = await getTestResponse();
    res.json({ message: reply });
  } catch (error) {
    next(error);
  }
};
