import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  CircularProgress,
  CssBaseline,
} from "@mui/material";
import { motion } from "framer-motion";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";
import robotFace from "../assets/robot-face.png";

const VoiceInput = () => {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState("");
  const recognitionRef = useRef(null);
  const theme = useTheme();

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

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          position: "fixed", // Changed to fixed to cover entire viewport
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
          margin: 0,
          overflow: "auto", // Changed to auto to allow scrolling if needed
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        //   style={{ width: "100%", maxWidth: "100%" }}
        >
          <Card
            sx={{
              width: "100%",
              maxWidth: 400,
              backgroundColor: "#1e1e1e",
              borderRadius: 4,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
              p: 3,
              textAlign: "center",
              margin: "0 auto",
              marginBottom: "2rem"
            }}
          >
            <CardContent>
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
                  borderRadius: "50%",
                  borderWidth: 4,
                  borderStyle: "solid",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={robotFace}
                  alt="Robot"
                  style={{
                    width: "70%",
                    height: "70%",
                    objectFit: "contain",
                    filter: isSpeaking ? "hue-rotate(20deg)" : "none",
                  }}
                />
              </motion.div>

              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{
                  color: "#ffffff",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  mb: 3,
                }}
              >
                <img
                  src={robotFace}
                  alt="Mini Icon"
                  style={{ width: 24, height: 24 }}
                />
                Talk to Rev
              </Typography>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  variant="contained"
                  color={isRecording ? "error" : "primary"}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    margin: "0 auto",
                    boxShadow: 3,
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
                          top: "-5px",
                          left: "-5px",
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

        <Box
          sx={{
            mt: 4,
            width: "100%",
            maxWidth: 600,
            backgroundColor: "#252525",
            borderRadius: 2,
            p: 3,
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
            margin: "0 auto",
          }}
        >
          <Typography variant="body1" sx={{ mb: 2, color: "#ffffff" }}>
            <strong style={{ color: "#90caf9" }}>You said:</strong>
            <span style={{ marginLeft: 8 }}>{transcript || "..."}</span>
          </Typography>
          <Typography variant="body1" sx={{ color: "#ffffff" }}>
            <strong style={{ color: "#a5d6a7" }}>Bot:</strong>
            <span style={{ marginLeft: 8 }}>
              {response || "Waiting for your message..."}
            </span>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default VoiceInput;
