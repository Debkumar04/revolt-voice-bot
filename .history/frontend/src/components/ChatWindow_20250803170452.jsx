// components/ChatWindow.jsx
import { useState } from "react";
import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";
import LoadingDots from "./LoadingDots";
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
      {/* <div className="w-full max-w-xl p-4 bg-zinc-900 shadow-lg rounded-lg">
        <div className="h-[60vh] overflow-y-auto flex flex-col mb-4 px-2">
          {messages.map((msg, index) =>
            msg.sender === "bot" ? (
              <BotMessage key={index} text={msg.text} />
            ) : (
              <UserMessage key={index} text={msg.text} />
            )
          )}
          {loading && <LoadingDots />}
        </div> */}
        <VoiceInput onSend={handleNewMessage} />
      </div>
    </div>
  );
}
