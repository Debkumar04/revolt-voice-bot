// components/VoiceInput/useSpeechRecognition.js
import { useEffect, useRef } from "react";

export const useSpeechRecognition = (language, onResult, onError, onStop) => {
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      onError("Speech not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.onerror = (event) => {
      onError(`Recognition error: ${event.error}`);
      onStop();
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognition) recognition.stop();
    };
  }, [language]);

  return recognitionRef;
};
