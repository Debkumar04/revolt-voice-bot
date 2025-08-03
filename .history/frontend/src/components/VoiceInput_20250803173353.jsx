// components/VoiceInput.jsx
import { useEffect, useRef, useState } from "react";

export default function VoiceInput({ onSend }) {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      onSend({ sender: "user", text: transcript });

      // Simulate bot response after 1s
      setSpeaking(true);
      setTimeout(() => {
        onSend({ sender: "bot", text: `You said: "${transcript}"` });
        setSpeaking(false);
      }, 1000);
    };

    recognitionRef.current = recognition;
  }, [onSend]);

  const handleClick = () => {
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const getGlowColor = () => {
    if (speaking) return "glow-green";
    if (listening) return "glow-red";
    return "border-neutral-800";
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${getGlowColor()}`}
      >
        <img
          src="/43e0daa6-ca04-4bd0-a1fc-5ba0deb415cc.png"
          alt="robot"
          className="w-[10px] h-[10px]"
        />
      </div>
      <button
        onClick={handleClick}
        className="mt-4 px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
      >
        Talk to me
      </button>
    </div>
  );
}
