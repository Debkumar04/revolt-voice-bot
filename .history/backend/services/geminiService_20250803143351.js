export const streamVoiceResponse = async (promptText) => {
  console.log("🔍 Prompt received:", promptText); // Debug log

  const model = genAI.getGenerativeModel({
    model: process.env.MODEL_NAME,
  });

  try {
    const result = await model.generateContent(promptText);
    const response = result.response;
    console.log("✅ Gemini Raw Response:", response);
    return response.text() || "No meaningful response from Gemini.";
  } catch (error) {
    console.error("❌ Gemini API Error:", error.message);
    throw new Error("Failed to generate response from Gemini.");
  }
};
