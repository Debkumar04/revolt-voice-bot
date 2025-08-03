// components/ChatWindow.jsx
import { useState } from "react";
import VoiceInput from "./VoiceInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleNewMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
    setLoading(msg.sender === "user");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-xl p-4 bg-zinc-900 shadow-lg rounded-lg">
        
        <VoiceInput onSend={handleNewMessage} />
      </div>
    </div>
  );
}
