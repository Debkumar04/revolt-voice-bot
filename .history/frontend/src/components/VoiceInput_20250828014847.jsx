// components/VoiceInput/VoiceInput.jsx
import { useState } from "react";
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
import { getRevoltInstructions } from "./Instructions/RevoltInstructions";
import { useSpeechRecognition } from "../";
import { useSpeechSynthesis } from "./Instructions/useSpeechSynthesis";

const VoiceInput = () => {
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [response, setResponse] = useState("");
  const [language, setLanguage] = useState("en-US");
  const [error, setError] = useState(null);

  const { isSpeaking, speakOutLoud, cancelSpeech } =
    useSpeechSynthesis(language);

  const recognitionRef = useSpeechRecognition(
    language,
    (text) => {
      setTranscript(text);
      sendToBackend(text);
    },
    (err) => setError(err),
    () => setIsRecording(false)
  );

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

  const sendToBackend = async (promptText) => {
    try {
      setResponse("Processing...");

      const res = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${getRevoltInstructions(language)}\n\nUser: ${promptText}`,
          language,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Request failed");
      }

      const data = await res.json();
      setResponse(data.response);
      speakOutLoud(data.response);
    } catch (err) {
      const errorMsg = err.message.includes("429")
        ? "Server busy. Please try later"
        : `Error: ${err.message}`;
      setError(errorMsg);
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
          Deb's Rev: {response || "Ask about Revolt electric bikes"}
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
