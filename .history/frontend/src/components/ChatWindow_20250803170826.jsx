// components/ChatWindow.jsx
import { useState } from "react";
import VoiceInput from "./VoiceInput";

export default function ChatWindow() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-xl p-4 bg-zinc-900 shadow-lg rounded-lg">
        
        <VoiceInput onSend={handleNewMessage} />
      </div>
    </div>
  );
}
