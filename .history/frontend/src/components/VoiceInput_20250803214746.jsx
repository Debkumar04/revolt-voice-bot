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
  LinearProgress
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
  const [language, setLanguage] = useState("en-US");
  const [connectionStatus, setConnectionStatus] = useState("idle"); // 'idle' | 'connecting' | 'success' | 'error'
  const [networkError, setNetworkError] = useState(null);
  const recognitionRef = useRef(null);
  const apiTimeoutRef = useRef(null);

  // Test backend connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus("connecting");
        const res = await fetch("http://localhost:5000/api/gemini/test", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        
        if (!res.ok) throw new Error("Backend not responding");
        setConnectionStatus("success");
      } catch (err) {
        setConnectionStatus("error");
        setNetworkError("Cannot connect to Revolt services");
        console.error("Connection test failed:", err);
      }
    };
    
    testConnection();
    
    return () => {
      if (apiTimeoutRef.current) clearTimeout(apiTimeoutRef.current);
    };
  }, []);

  const sendToBackend = async (promptText) => {
    try {
      setConnectionStatus("connecting");
      setNetworkError(null);
      
      // Add timeout protection
      apiTimeoutRef.current = setTimeout(() => {
        throw new Error("Request timed out");
      }, 10000); // 10 second timeout

      const res = await fetch("http://localhost:5000/api/gemini", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Connection": "keep-alive"
        },
        body: JSON.stringify({
          prompt: promptText,
          language
        }),
      });

      clearTimeout(apiTimeoutRef.current);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Request failed");
      }

      const data = await res.json();
      setConnectionStatus("success");
      setResponse(data.response);
      speakOutLoud(data.response);
      
    } catch (error) {
      clearTimeout(apiTimeoutRef.current);
      setConnectionStatus("error");
      
      const errorMsg = error.message.includes("timed out")
        ? "Request timeout. Check your network speed."
        : error.message.includes("Failed to fetch")
        ? "Network error. Are you offline?"
        : "Service temporarily unavailable";
        
      setNetworkError(errorMsg);
      setResponse(errorMsg);
      speakOutLoud(errorMsg);
      console.error("API Error:", error);
    }
  };

  // ... (keep all other existing functions like startRecording, stopRecording, speakOutLoud) ...

  return (
    <Box sx={{ /* existing styles */ }}>
      {/* Connection Status Indicator */}
      {connectionStatus === "connecting" && (
        <LinearProgress sx={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0,
          height: 3
        }} />
      )}

      {/* Existing UI components... */}

      {/* Enhanced Error Display */}
      <Snackbar
        open={!!networkError}
        autoHideDuration={6000}
        onClose={() => setNetworkError(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          severity="error"
          sx={{ width: "100%" }}
          onClose={() => setNetworkError(null)}
        >
          {networkError}
          <Button 
            color="inherit" 
            size="small"
            onClick={() => window.location.reload()}
            sx={{ ml: 2 }}
          >
            Retry
          </Button>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoiceInput;