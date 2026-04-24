"use client";

import { useState, useEffect } from "react";
import { ChatInput } from "@/components/chat/ChatInput";
export function ChatWindow({ userId, clientId, clientName }: any) {

  const [messages, setMessages] = useState<any[]>([]);

  // ================= LOAD MESSAGES WHEN CLIENT CHANGES =================
  // useEffect(() => {

  //   if (!clientId) return;
  //   const loadMessages = async () => {
  //     try {
  //       console.log("Loading messages for client:", clientId);

  //       const res = await fetch(`/rocket/api/chat?clientId=${clientId}&userId=${userId}`);
  //       const data = await res.json();

  //       console.log("Loaded messages:", data);

  //       setMessages(
  //         data.map((msg: any) => ({
  //           sender: msg.sender,
  //           text: msg.content
  //         }))
  //       );

  //     } catch (error) {
  //       console.log("LOAD MESSAGE ERROR:", error);
  //     }
  //   };

  //   loadMessages();

  // }, [clientId]);

useEffect(() => {
  setMessages([]); // clear old client messages

  if (!clientId) return;

  const loadMessages = async () => {
    try {
      const res = await fetch(`/rocket/api/chat?clientId=${clientId}&userId=${userId}`);
      const data = await res.json();

      setMessages(
        data.map((msg: any) => ({
          sender: msg.sender,
          text: msg.content
        }))
      );

    } catch (error) {
      console.log("LOAD ERROR:", error);
    }
  };

  loadMessages();

}, [clientId]);
  // ================= SEND MESSAGE =================
  const handleSend = async (userMessage: string) => {

    console.log("Sending message:", userMessage);

    // Show instantly
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage }
    ]);

    try {
      const res = await fetch(`/rocket/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: userMessage,
          userId,
          clientId
        })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: data.reply }
      ]);

    } catch (error) {
      console.log("SEND ERROR:", error);
    }
  };

  return (
    <div className="conatiner">

      <div className="title">
        <h1 style={{ padding: "10px", fontWeight: "bold" }}>
          Client: {clientName}
        </h1>
      </div>

      <div className="chatBody">

        <div style={{ height: "400px", overflowY: "auto", padding: "10px" }}>

          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                marginBottom: "10px"
              }}
            >
              <div
                style={{
                  maxWidth: "60%",
                  padding: "10px 15px",
                  borderRadius: "12px",
                  backgroundColor: msg.sender === "user" ? "#007bff" : "#2d2d2d",
                  color: "#fff"
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

        </div>

        <ChatInput onSend={handleSend} />

      </div>
    </div>
  );
}