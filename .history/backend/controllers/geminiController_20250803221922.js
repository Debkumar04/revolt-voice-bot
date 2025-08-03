const { processVoiceWithGemini } = require("../services/geminiService");

const handleVoiceInteraction = async (req, res) => {
  try {
    const audioPath = req.file?.path;
    if (!audioPath) {
      return res.status(400).json({ text: "No audio file provided" });
    }

    const resultText = await processVoiceWithGemini(audioPath);
    return res.status(200).json({ text: resultText });
  } catch (err) {
    console.error("Voice controller error:", err.message);
    return res.status(500).json({ text: "Something went wrong" });
  }
};

module.exports = {
  handleVoiceInteraction,
};
