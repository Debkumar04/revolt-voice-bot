const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

async function processVoiceWithGemini(audioPath) {
  const audioData = fs.readFileSync(audioPath);
  const audioBase64 = audioData.toString("base64");

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "audio/webm",
                  data: audioBase64,
                },
              },
            ],
          },
        ],
        systemInstruction: {
          parts: [
            {
              text: "You are an assistant for Revolt Motors. Only answer questions related to Revolt electric bikes, services, pricing, and features. Do not answer anything else.",
            },
          ],
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let fullText = "";
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      fullText = response.data.candidates[0].content.parts[0].text;
    }

    return fullText || "Sorry, I didn’t understand that.";
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    return "Error: Unable to contact Gemini API.";
  }
}

module.exports = {
  processVoiceWithGemini,
};
