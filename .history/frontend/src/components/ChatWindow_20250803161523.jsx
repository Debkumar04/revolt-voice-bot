// --- components/ChatWindow.jsx ---
import { useState } from "react";
import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import VoiceInput from "./VoiceInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);

  const handleUserMessage = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  const handleBotMessage = (text) => {
    setMessages((prev) => {
      const updated = [...prev];
      if (text === null) {
        // loading
        return [...prev, { sender: "bot", text: null }];
      }
      updated[updated.length - 1] = { sender: "bot", text };
      return [...updated];
    });
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🎙️ Voice Chat with Gemini</h2>
      <div className="h-[400px] overflow-y-auto bg-white border rounded p-4">
        {messages.map((msg, idx) =>
          msg.sender === "user" ? (
            <UserMessage key={idx} message={msg.text} />
          ) : (
            <BotMessage key={idx} message={msg.text} isLoading={!msg.text} />
          )
        )}
      </div>
      <VoiceInput
        onUserMessage={handleUserMessage}
        onBotMessage={handleBotMessage}
      />
    </div>
  );
}
