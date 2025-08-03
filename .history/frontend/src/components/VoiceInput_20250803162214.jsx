// components/VoiceInput.jsx
import { useState } from "react";
import axios from "axios";

export default function VoiceInput({ onSend }) {
  const [recognizing, setRecognizing] = useState(false);

  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = false;

  const startListening = () => {
    recognition.start();
    setRecognizing(true);
  };

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    onSend({ sender: "user", text: transcript });

    try {
      const res = await axios.post("/api/gemini", { prompt: transcript });
      const reply = res.data.reply;
      onSend({ sender: "bot", text: reply });

      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    } catch (err) {
      onSend({ sender: "bot", text: "Oops, something went wrong!" });
    } finally {
      setRecognizing(false);
    }
  };

  recognition.onerror = () => setRecognizing(false);

  return (
    <button
      className={`px-4 py-2 rounded-full mt-4 ${
        recognizing ? "bg-red-400" : "bg-green-500"
      } text-white`}
      onClick={startListening}
      disabled={recognizing}
    >
      🎙️ {recognizing ? "Listening..." : "Speak"}
    </button>
  );
}
