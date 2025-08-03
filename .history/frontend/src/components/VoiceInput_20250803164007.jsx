import React, { useEffect, useRef, useState } from "react";

export default function VoiceInput({ onUserMessage, onBotMessage, onLoading }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript.trim();
      if (!transcript) return;

      onUserMessage?.(transcript);

      try {
        onLoading?.(true);
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: transcript }),
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonError) {
          console.error("Invalid JSON response:", text);
          throw new Error("Invalid JSON returned from server.");
        }

        const botReply = data?.response || "Sorry, no response from Gemini.";
        onBotMessage?.(botReply);
        speak(botReply);
      } catch (err) {
        console.error("Failed to get Gemini response:", err.message);
        onBotMessage?.("Error getting response from Gemini.");
      } finally {
        onLoading?.(false);
      }
    };

    recognitionRef.current = recognition;
  }, [onUserMessage, onBotMessage, onLoading]);

  const handleClick = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-md font-medium transition ${
        isListening ? "bg-red-500 text-white" : "bg-green-500 text-white"
      }`}
    >
      {isListening ? "Stop" : "Speak"}
    </button>
  );
}
