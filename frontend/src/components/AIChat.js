"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello. I'm your Apex Recovery advisor — trained on burnout research, nervous system recovery, and real-world workplace strategies.\n\nYou can share **anything** here. Your story, your pain, what's happening at work or at home — relationship stress, financial pressure, health anxiety, whatever is weighing on you. I give specific, practical guidance tailored to your exact situation.\n\nWhat's going on for you right now?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Combined function passing dynamic arguments to eliminate closure race-conditions
  const handleSendMessage = async (textToSend) => {
    const targetContent = textToSend || input;
    if (!targetContent.trim()) return;

    const userMessage = { role: "user", content: targetContent };
    
    // Optimistically update the local chat screen array state
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput(""); // Clear field if typing manually
    setIsLoading(true);

    try {
      // Send the entire conversation trail context down to your Node server instance
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat`,
        {
          messages: [...messages, userMessage],
        }
      );

      const aiResponseContent = response.data.content?.[0]?.text || "I am here with you. Can you tell me a bit more about what's going on?";
      const aiMessage = { role: "assistant", content: aiResponseContent };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuick = (text) => {
    setInput(""); // Reset entry field variables
    handleSendMessage(text); // Pass directly to fire cleanly without waiting on state rerenders
  };

  return (
    <div className="ai-chat-section" role="main" aria-label="AI Advisor chat">
      <div className="ai-chat-header">
        <div className="ai-avatar" aria-hidden="true">
          <i className="ti ti-brain" style={{ color: "#fff", fontSize: "18px" }}></i>
        </div>
        <div>
          <div className="ai-name">Apex Recovery AI Advisor</div>
          <div className="ai-role">Burnout & recovery specialist · neuroscience-backed · always available</div>
        </div>
        <div className="ai-status">
          <div className="nav-badge" style={{ fontSize: "10px" }}>
            <span className="live-dot"></span> ONLINE
          </div>
        </div>
      </div>

      <div className="quick-prompts" aria-label="Quick question prompts">
        <button className="qp-btn" onClick={() => sendQuick("I feel exhausted and can't stop working even though I know I need rest. What should I do right now?")}>😴 Can't stop working</button>
        <button className="qp-btn" onClick={() => sendQuick("I feel emotionally numb and completely disconnected from my work. Is this burnout?")}>🧊 I feel numb</button>
        <button className="qp-btn" onClick={() => sendQuick("My sleep is completely broken. I wake up at 3am every night with my mind racing. Help.")}>🌙 Sleep broken</button>
        <button className="qp-btn" onClick={() => sendQuick("I've been having panic attacks at work. My chest tightens and I can't breathe. What can I do?")}>💨 Panic at work</button>
      </div>

      <div className="chat-messages" id="chat-messages" role="log" aria-live="polite" aria-label="Chat conversation">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role === "user" ? "msg-user" : ""}`}>
            <div 
              className={`msg-av ${msg.role === "user" ? "av-user" : "av-ai"}`} 
              style={{ 
                width: "28px", 
                height: "28px", 
                borderRadius: "8px", 
                flexShrink: 0, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", // Fixed layout property alignment here
                fontSize: "12px", 
                background: msg.role === "user" ? "#4B7BE5" : "#1A2744" 
              }}
            >
              {msg.role === "user" ? "You" : "AI"}
            </div>
            <div className={`msg-bubble ${msg.role === "user" ? "bubble-user" : "bubble-ai"}`}>
              {msg.content.split("\n").map((line, j) => (
                <span key={j}>{line}<br /></span>
              ))}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="msg">
            <div className="msg-av av-ai" style={{ width: "28px", height: "28px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", background: "#1A2744" }}>AI</div>
            <div className="msg-bubble bubble-ai">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          placeholder="Share what's going on... be as specific as you like."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { // Updated to onKeyDown for modern default prevention
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          rows={1}
        />
        <button className="chat-send" onClick={() => handleSendMessage()} disabled={isLoading}>
          <i className="ti ti-send"></i> Send
        </button>
      </div>
      <p style={{ fontSize: "10px", color: "var(--text3)", marginTop: "8px", textAlign: "center", position: "relative", zIndex: 1 }}>
        AI guidance is for wellness support only, not medical diagnosis. If in crisis, please contact a healthcare professional.
      </p>
    </div>
  );
}