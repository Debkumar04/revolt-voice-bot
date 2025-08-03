// src/components/VoiceInput.jsx
import { useState, useEffect, useRef } from "react";

const VoiceInput = () => {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
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
      speakOutLoud(data.response); // Speak the response
    } catch (error) {
      console.error("Error sending prompt:", error.message);
      const errorMsg = "Error: " + error.message;
      setResponse(errorMsg);
      speakOutLoud(errorMsg); // Speak the error if needed
    }
  };

  return (
    <div className="p-4 border rounded-lg w-[80%] mx-auto mt-10">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded font-semibold ${
          isRecording ? "bg-red-500 text-white" : "bg-green-500 text-white"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Talking"}
      </button>

      <div className="mt-4">
        <strong>Transcript:</strong> <p>{transcript}</p>
      </div>

      <div className="mt-4">
        <strong>Gemini Response:</strong> <p>{response}</p>
      </div>
    </div>
  );
};

export default VoiceInput;
