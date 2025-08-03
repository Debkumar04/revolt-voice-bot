import { useState, useEffect, useRef } from "react";
import robotFace from "../assets/robot-face.png"; // make sure this path is correct

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
      speakOutLoud(data.response);
    } catch (error) {
      const errorMsg = "Error: " + error.message;
      setResponse(errorMsg);
      speakOutLoud(errorMsg);
    }
  };

  const getBorderColor = () => {
    if (isSpeaking) return "border-green-400 animate-pulse";
    if (isRecording) return "border-red-500 animate-ping-slow";
    return "border-green-400";
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="flex flex-col items-center">
        <div
          className={`w-24 h-24 rounded-full border-4 ${getBorderColor()} flex items-center justify-center transition-all duration-300 mb-4`}
        >
          <img src={robotFace} alt="Robot" className="w-16 h-16 object-contain" />
        </div>

        <h1 className="text-2xl font-semibold mb-8 flex items-center gap-2">
          <img src={robotFace} alt="Mini Icon" className="w-8 h-8" />
          Talk to Rev
        </h1>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          className="bg-blue-500 hover:bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 1v22m0 0l-4-4m4 4l4-4"
            />
          </svg>
        </button>

        <div className="mt-6 text-sm text-gray-300 text-center">
          <p><strong>You said:</strong> {transcript}</p>
          <p><strong>Bot:</strong> {response}</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
