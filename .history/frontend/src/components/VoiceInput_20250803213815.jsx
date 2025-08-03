import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import robotFace from "../assets/robot-face.png";

const VoiceInput = () => {
  // State management
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // System instructions for Revolt Motors
  const getRevoltInstructions = () => {
    const baseInstruction = `
      You are "Rev", the official AI assistant for Revolt Motors.
      Only discuss: RV300, RV400, charging, batteries, and Revolt services.
      For other queries, respond: "I specialize in Revolt electric bikes"
    `;

    switch (language) {
      case "hi-IN":
        return `${baseInstruction}\nकेवल हिंदी में उत्तर दें`;
      case "mr-IN":
        return `${baseInstruction}\nफक्त मराठीत उत्तर द्या`;
      case "es-ES":
        return `${baseInstruction}\nResponder sólo en español`;
      case "fr-FR":
        return `${baseInstruction}\nRépondez uniquement en français`;
      default:
        return baseInstruction;
    }
  };

  // Speech control
  const cancelSpeech = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      sendToBackend(text);
    };

    recognition.onerror = (event) => {
      setError(`Recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      cancelSpeech();
      if (isRecording) recognition.stop();
    };
  }, [language]);

  // Recording handlers
  const startRecording = () => {
    cancelSpeech();
    setError(null);
    setIsRecording(true);
    setTranscript("");
    setResponse("Listening...");
    recognitionRef.current.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    recognitionRef.current.stop();
  };

  // Speech synthesis with language filtering
  const speakOutLoud = (text) => {
    cancelSpeech();

    let filteredText = text;
    if (!language.startsWith("en")) {
      filteredText = text
        .replace(/\(.*?\)|\[.*?\]/g, "") // Remove brackets
        .replace(/English\s*:.*/gi, "") // Remove English translations
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

  // API communication with error handling
const sendToBackend = async (promptText) => {
  try {
    setResponse("Connecting to Rev...");

    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptText }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.response || "Network error");
    }

    const data = await res.json();
    setResponse(data.response);
    speakOutLoud(data.response);
  } catch (error) {
    const errorMsg = error.message.includes("unavailable")
      ? "Rev services are temporarily down. Please try again soon."
      : "Connection issue. Please check your network.";

    setResponse(errorMsg);
    speakOutLoud(errorMsg);
  }
};

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#121212",
        p: 2,
        overflow: "auto",
      }}
    >
      {/* Language Selector */}
      <FormControl
        sx={{ position: "absolute", top: 16, right: 16, minWidth: 120 }}
      >
        <InputLabel sx={{ color: "white" }}>Language</InputLabel>
        <Select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          label="Language"
          sx={{
            color: "white",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255, 255, 255, 0.23)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
            },
            ".MuiSvgIcon-root": {
              color: "white",
            },
          }}
        >
          <MenuItem value="en-US">English</MenuItem>
          <MenuItem value="hi-IN">Hindi</MenuItem>
          <MenuItem value="mr-IN">Marathi</MenuItem>
          <MenuItem value="es-ES">Spanish</MenuItem>
          <MenuItem value="fr-FR">French</MenuItem>
        </Select>
      </FormControl>

      {/* Main Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Card
          sx={{
            backgroundColor: "#1e1e1e",
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
            p: 3,
            textAlign: "center",
          }}
        >
          <CardContent>
            {/* Animated Robot Avatar */}
            <motion.div
              animate={{
                borderColor: isSpeaking
                  ? "#4CAF50"
                  : isRecording
                  ? "#F44336"
                  : "#4CAF50",
                scale: isSpeaking ? [1, 1.05, 1] : 1,
              }}
              transition={{
                borderColor: { duration: 0.3 },
                scale: { duration: 1, repeat: isSpeaking ? Infinity : 0 },
              }}
              style={{
                width: 120,
                height: 120,
                borderWidth: 4,
                borderStyle: "solid",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                overflow: "hidden",
              }}
            >
              <img
                src={robotFace}
                alt="Rev AI"
                style={{
                  width: "70%",
                  height: "70%",
                  objectFit: "contain",
                  filter: isSpeaking ? "hue-rotate(20deg)" : "none",
                }}
              />
            </motion.div>

            <Typography variant="h5" sx={{ color: "white", mb: 3 }}>
              <img
                src={robotFace}
                alt=""
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
              Talk to Rev
            </Typography>

            {/* Record Button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant="contained"
                color={isRecording ? "error" : "primary"}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  position: "relative",
                }}
              >
                {isRecording ? (
                  <>
                    <StopIcon sx={{ fontSize: 32 }} />
                    <CircularProgress
                      size={90}
                      thickness={2}
                      color="error"
                      sx={{
                        position: "absolute",
                        top: -5,
                        left: -5,
                        zIndex: 1,
                      }}
                    />
                  </>
                ) : (
                  <MicIcon sx={{ fontSize: 32 }} />
                )}
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Response Display */}
      <Box
        sx={{
          mt: 4,
          width: "100%",
          maxWidth: 600,
          backgroundColor: "#252525",
          borderRadius: 2,
          p: 3,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
        }}
      >
        <Typography variant="body1" sx={{ color: "#90caf9", mb: 1 }}>
          You: {transcript || "..."}
        </Typography>
        <Typography variant="body1" sx={{ color: "#a5d6a7" }}>
          Rev: {response || "Ask about Revolt electric bikes"}
        </Typography>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoiceInput;
