// --- components/VoiceInput.jsx ---
import { useState, useEffect } from "react";
import axios from "axios";

export default function VoiceInput({ onUserMessage, onBotMessage }) {
  const [listening, setListening] = useState(false);
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  const startListening = () => {
    setListening(true);
    recognition.start();
  };

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    setListening(false);
    onUserMessage(transcript);

    try {
      onBotMessage(null); // show loading
      const res = await axios.post("http://localhost:5000/api/gemini", {
        prompt: transcript,
      });
      const reply = res.data.response;
      onBotMessage(reply);
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    } catch (err) {
      onBotMessage("Error getting response.");
    }
  };

  return (
    <button
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
      onClick={startListening}
      disabled={listening}
    >
      {listening ? "Listening..." : "Talk to Gemini"}
    </button>
  );
}
