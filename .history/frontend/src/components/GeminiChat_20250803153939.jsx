import { useState } from "react";
import BotChatCard from "./components/BotChatCard";
import { TextField, Button, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function GeminiChat() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1.2;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setChat([...chat, { from: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      const botReply = data.reply;

      setChat((prev) => [...prev, { from: "bot", text: botReply }]);
      speak(botReply);
    } catch (err) {
      console.error("Gemini error:", err);
      speak("Sorry, I couldn't respond.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Typography variant="h4" gutterBottom>
        🤖 Gemini Bot
      </Typography>

      <div className="space-y-2">
        {chat.map((msg, idx) =>
          msg.from === "bot" ? (
            <BotChatCard key={idx} message={msg.text} loading={false} />
          ) : (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-right"
            >
              <Typography
                variant="body2"
                sx={{
                  bgcolor: "#e0f7fa",
                  px: 2,
                  py: 1,
                  borderRadius: "15px",
                  display: "inline-block",
                }}
              >
                {msg.text}
              </Typography>
            </motion.div>
          )
        )}

        {loading && <BotChatCard loading />}
      </div>

      <div className="flex gap-2 mt-4">
        <TextField
          fullWidth
          label="Ask Gemini..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
}
