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

  // ... (keep all your existing useEffect and functions exactly the same) ...

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default, // This will make entire background dark
        p: 2,
        width: "100vw", // Ensure full viewport width
        margin: 0,
      }}
    >
      <CssBaseline /> {/* This helps with consistent baseline styles */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: theme.palette.grey[900],
            borderRadius: 4,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            p: 3,
            textAlign: "center",
            margin: "0 auto", // Center the card horizontally
          }}
        >
          {/* ... (keep the exact same CardContent content) ... */}
        </Card>
      </motion.div>
      <Box
        sx={{
          mt: 4,
          width: "100%",
          maxWidth: 600,
          backgroundColor: theme.palette.grey[800],
          borderRadius: 2,
          p: 3,
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
          margin: "0 auto", // Center the response box horizontally
        }}
      >
        {/* ... (keep the exact same response content) ... */}
      </Box>
    </Box>
  );
};

export default VoiceInput;
