import axios from "axios";

export const getTestResponse = async () => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await axios.post(url, {
    contents: [
      {
        parts: [{ text: "Hello Gemini, are you working?" }],
      },
    ],
  });

  const reply =
    response.data.candidates[0]?.content?.parts[0]?.text || "No response";
  return reply;
};
