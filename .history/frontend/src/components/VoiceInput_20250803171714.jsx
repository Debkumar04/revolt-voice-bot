// src/components/VoiceInput.jsx
import { useState, useEffect, useRef } from "react";
const VoiceInput = () => {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcriptedText = event.results[0][0].transcript;
      setTranscript(transcriptedText);
    //   onSend({ sender: "user", text: transcriptedText });
      sendToBackend(transcriptedText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecording = () => {
    setIsRecording(true);
    setTranscript("");
    setResponse("");
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current.stop();
  };

  const speakOutLoud = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1;
    utterance.rate = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const sendToBackend = async (promptText) => {
    try {
      const res = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Something went wrong");
      }

      const data = await res.json();
      setResponse(data.response);
    //   onSend({ sender: "bot", text: data.response });
      speakOutLoud(data.response);
    } catch (error) {
      const errorMsg = "Error: " + error.message;
      setResponse(errorMsg);
    //   onSend({ sender: "bot", text: errorMsg });
      speakOutLoud(errorMsg);
    }
  };

  const getCircleClass = () => {
    if (isSpeaking) return "border-green-400 animate-pulse";
    if (isRecording) return "border-red-500 animate-ping-slow";
    return "border-green-400";
  };

  return (
    <div className="flex flex-col items-center text-white">
      <div
        className={`w-40 h-40 rounded-full border-4 ${getCircleClass()} flex items-center justify-center transition-all duration-300`}
      >
        <img
          src={"../assets/robot-face.png.png"}
          alt="Robot Avatar"
          className="w-24 h-24 object-contain"
        />
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="mt-6 px-6 py-2 rounded-full bg-green-600 hover:bg-green-700 transition-all font-bold"
      >
        {isRecording ? "Stop Listening" : "Talk to Me"}
      </button>

    </div>
  );
};

export default VoiceInput;
