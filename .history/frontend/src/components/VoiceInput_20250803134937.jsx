import { useState, useRef } from "react";
import axios from "axios";

export default function VoiceInput() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition API not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      try {
        const res = await axios.post("http://localhost:5000/api/gemini", {
          prompt: spokenText,
        });
        setResponse(res.data.response);
      } catch (error) {
        console.error("Error from backend:", error.message);
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech recognition error:", err);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h2>🎤 Voice Assistant</h2>
      <button onClick={startListening}>Start Speaking</button>
      <div style={{ marginTop: "1rem" }}>
        <strong>You said:</strong> {text}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <strong>Gemini says:</strong> {response}
      </div>
    </div>
  );
}
