"use client";

import { useEffect, useRef, useState } from "react";

export function RocketChatWidget() {
  const prompts = [
    "Write 5 Meta Ads",
    "Create weekly report draft",
    "Summarize performance",
    "Generate outreach email",
  ];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([
    { role: "assistant", content: "Hi 👋 How can I help you?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        !target?.closest(".chat-popup") &&
        !target?.closest(".chat-float-btn") &&
        !target?.closest(".chat-prompts")
      ) {
        setOpen(false);
      }
    };

    if (open) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  const sendMessage = async (customInput?: string) => {
    const messageText =
      typeof customInput === "string" ? customInput : input;
    if (!messageText || !messageText.trim() || loading) return;

    const userMessage = { role: "user" as const, content: messageText };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant" as const, content: "This is a sample AI response." },
        ]);
        setLoading(false);
      }, 800);
    } catch {
      setLoading(false);
    }
  };

  const handlePromptClick = (text: string) => {
    void sendMessage(text);
  };

  return (
    <>
      <button className="chat-float-btn" onClick={() => setOpen(!open)}>
        💬
      </button>

      {open && (
        <div className="chat-popup">
          <div className="chat-popup-header">
            <span> Rocket AI</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-popup-body">
            {messages.map((msg, i) => (
              <div key={i} className={`msg ${msg.role}`}>
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="msg assistant">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="chat-prompts">
            {prompts.map((p) => (
              <button key={p} onClick={() => handlePromptClick(p)}>
                {p}
              </button>
            ))}
          </div>

          <div className="chat-popup-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") void sendMessage();
              }}
            />
            <button onClick={() => void sendMessage()}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

