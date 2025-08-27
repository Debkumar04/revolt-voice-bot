import { useState } from "react";

export const useSpeechSynthesis = (language) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const cancelSpeech = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  const speakOutLoud = (text) => {
    cancelSpeech();

    let filteredText = text;
    if (!language.startsWith("en")) {
      filteredText = text
        .replace(/\(.*?\)|\[.*?\]/g, "")
        .replace(/English\s*:.*/gi, "")
        .trim();
    }

    if (!filteredText) {
      filteredText = language.startsWith("en")
        ? "Please ask about Revolt Motors"
        : "कृपया रिवोल्ट मोटर्स के बारे में पूछें";
    }

    const utterance = new SpeechSynthesisUtterance(filteredText);
    utterance.lang = language;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return { isSpeaking, speakOutLoud, cancelSpeech };
};
