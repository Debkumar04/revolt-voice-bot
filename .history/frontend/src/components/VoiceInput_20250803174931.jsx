import { useState, useEffect, useRef } from "react";
import robotFace from "../assets/robot-face.png";
import {
  Container,
  Paper,
  Box,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Mic, Stop } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/system";

// Styled components for a clean and reusable design
const AnimatedBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 96,
  height: 96,
  borderRadius: "50%",
  transition: "all 0.3s ease-in-out",
  marginBottom: theme.spacing(4),
}));

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  width: 64,
  height: 64,
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  boxShadow: theme.shadows[10],
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[15],
  },
}));

// Framer Motion variants for animations
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const iconVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 200 },
  },
};

const textVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

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
    if (isSpeaking) return "4px solid #4caf50"; // Green
    if (isRecording) return "4px solid #f44336"; // Red
    return "4px solid #4caf50";
  };

  const getMuiColor = () => {
    if (isSpeaking) return "success";
    if (isRecording) return "error";
    return "success";
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#fff",
      }}
    >
      <Container maxWidth="sm">
        <AnimatePresence>
          <motion.div
            key="card"
            initial="hidden"
            animate="visible"
            variants={cardVariants}
          >
            <Paper
              elevation={20}
              sx={{
                padding: { xs: 4, md: 6 },
                borderRadius: 4,
                textAlign: "center",
                backgroundColor: "#1e1e1e",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                backdropFilter: "blur(4px)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 4,
                }}
              >
                {/* Robot Logo with pulsating border animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{
                    scale: [0.8, 1, 0.8],
                    borderColor: isRecording
                      ? ["#f44336", "#f06292", "#f44336"]
                      : isSpeaking
                      ? ["#4caf50", "#66bb6a", "#4caf50"]
                      : "#4caf50",
                  }}
                  transition={{
                    duration: isRecording || isSpeaking ? 1.5 : 0.5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    border: getBorderColor(),
                    transition: "all 0.3s ease-in-out",
                  }}
                >
                  <motion.img
                    src={robotFace}
                    alt="Robot"
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "contain",
                      borderRadius: "50%",
                    }}
                    variants={iconVariants}
                  />
                </motion.div>
                <Typography
                  variant="h4"
                  component={motion.h1}
                  sx={{ mt: 2, mb: 4, fontWeight: 700 }}
                  variants={textVariants}
                >
                  Talk to Rev
                </Typography>
                <motion.div variants={textVariants}>
                  {/* Mic Button with Framer Motion animations */}
                  <AnimatedIconButton
                    onClick={isRecording ? stopRecording : startRecording}
                    component={motion.div}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    sx={{
                      backgroundColor: isRecording ? "#f44336" : "#2196f3",
                    }}
                  >
                    {isRecording ? (
                      <Stop fontSize="large" />
                    ) : (
                      <Mic fontSize="large" />
                    )}
                  </AnimatedIconButton>
                </motion.div>
              </Box>
            </Paper>
          </motion.div>
        </AnimatePresence>

        {/* Response section outside the card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Paper
            elevation={10}
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 4,
              backgroundColor: "#1e1e1e",
              color: "#e0e0e0",
              minHeight: 120,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" component="p" mb={1}>
              <Box component="strong" color="#90caf9">
                You said:
              </Box>{" "}
              {transcript || "..."}
            </Typography>
            <Typography variant="body1" component="p">
              <Box component="strong" color="#a5d6a7">
                Bot:
              </Box>{" "}
              {isSpeaking ? (
                <CircularProgress
                  color={getMuiColor()}
                  size={20}
                  sx={{ ml: 1 }}
                />
              ) : (
                response || "..."
              )}
            </Typography>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default VoiceInput;
