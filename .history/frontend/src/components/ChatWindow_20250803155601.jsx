import { Box, CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import ChatMessage from "./ChatMessage";
import VoiceInput from "./VoiceInput";
import { useSpeechRecognition } from "../hooks/useSpeech";
import { speakText } from "../utils/speakText";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { startListening, listening } = useSpeechRecognition(
    async (userText) => {
      setMessages((prev) => [...prev, { text: userText, isUser: true }]);
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userText }),
        });
        const data = await res.json();
        const reply = data.response;
        setMessages((prev) => [...prev, { text: reply, isUser: false }]);
        speakText(reply);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { text: "❌ Failed to get response.", isUser: false },
        ]);
      } finally {
        setLoading(false);
      }
    }
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h5" gutterBottom>
        🎙️ Gemini Voice Bot
      </Typography>
      <Box
        sx={{
          bgcolor: "#f5f5f5",
          borderRadius: 2,
          p: 2,
          minHeight: "300px",
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <ChatMessage key={i} {...msg} />
        ))}
        {loading && <CircularProgress size={24} />}
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <VoiceInput onClick={startListening} listening={listening} />
      </Box>
    </Box>
  );
}
