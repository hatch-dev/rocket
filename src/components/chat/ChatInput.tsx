"use client";

import { useState } from "react";
const baseUrl = process.env.NEXT_PUBLIC_ASSET_BASE;
export  function ChatInput({ onSend }: any) {
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    console.log("Sending message:", input);

    const userMessage = input;
    setInput("");

    const res = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();

    console.log("AI reply:", data);

    onSend(userMessage, data.reply);
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <input className="chatInput"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
        style={{ flex: 1 }}
      />
      <button className="chatButton" onClick={handleSend}>Send</button>
    </div>
  );
}