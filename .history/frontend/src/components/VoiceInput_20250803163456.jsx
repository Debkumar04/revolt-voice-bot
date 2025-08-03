import React, { useEffect, useRef, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

const VoiceInput = ({ onUserMessage, onBotMessage, onLoading }) => {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // Speak text using SpeechSynthesis
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  // Start voice recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
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

        const data = await res.json();
        const botReply = data?.response || "Sorry, I couldn't understand that.";

        onBotMessage?.(botReply);
        speak(botReply);
      } catch (err) {
        console.error("Failed to get Gemini response:", err);
        onBotMessage?.("Error talking to Gemini.");
      } finally {
        onLoading?.(false);
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  return (
    <Tooltip title={isListening ? "Stop Listening" : "Start Voice Chat"}>
      <IconButton
        color={isListening ? "error" : "primary"}
        onClick={isListening ? stopListening : startListening}
        size="large"
        sx={{ position: "absolute", bottom: 20, right: 20 }}
      >
        {isListening ? <StopIcon /> : <MicIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default VoiceInput;
