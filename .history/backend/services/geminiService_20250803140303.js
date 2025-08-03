// services/geminiService.js
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export const streamVoiceResponse = async (audioBuffer) => {
  const model = genAI.getGenerativeModel({
    model: process.env.MODEL_NAME,
  });

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: "audio/wav",
              data: audioBuffer.toString("base64"),
            },
          },
        ],
      },
    ],
  });

  const response = result.response;
  
  return response.text();
};
