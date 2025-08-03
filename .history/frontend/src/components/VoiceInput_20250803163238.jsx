import React, { useEffect, useRef, useState } from "react";

export default function VoiceInput({ onUserMessage, onBotMessage, onLoading }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onend = () => setListening(false);

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      if (onUserMessage) onUserMessage(transcript);

      try {
        onLoading(true);
        const res = await fetch("http://localhost:5173/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: transcript }),
        });

        const data = await res.json();
        const botReply = data?.response || "Sorry, I couldn't understand that.";

        if (onBotMessage) onBotMessage(botReply);
        speak(botReply);
      } catch (err) {
        console.error("Failed to get Gemini response:", err);
        if (onBotMessage) onBotMessage("Error talking to Gemini.");
      } finally {
        onLoading(false);
      }
    };

    recognitionRef.current = recognition;
  }, [onUserMessage, onBotMessage, onLoading]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={startListening}
        className={`px-4 py-2 rounded-full text-white transition ${
          listening
            ? "bg-red-500 animate-pulse"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {listening ? "Listening..." : "🎤 Speak"}
      </button>
    </div>
  );
}
