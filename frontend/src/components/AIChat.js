"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello. I'm your Apex Recovery advisor — trained on burnout research, nervous system recovery, and real-world workplace strategies.\n\nYou can share anything here. Your story, your pain, what's happening at work or at home — relationship stress, financial pressure, health anxiety, whatever is weighing on you. I give specific, practical guidance tailored to your exact situation.\n\nWhat's going on for you right now?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const targetContent = textToSend || input;
    if (!targetContent.trim() || isLoading) return;

    const userMessage = { role: "user", content: targetContent };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        messages: [...messages, userMessage]
      });

      const aiResponseContent = response.data.text || response.data.content?.[0]?.text || "I am here with you. Can you tell me more?";
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponseContent }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "I'm having trouble connecting. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendQuick = (text) => {
    setInput("");
    handleSendMessage(text);
  };

  const renderFormattedText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx}>{part.slice(2, -2)}</strong>;
      }
      return part.split('\n').map((line, lineIdx) => (
        <span key={`${idx}-${lineIdx}`}>{line}{lineIdx < part.split('\n').length - 1 && <br />}</span>
      ));
    });
  };

  return (
    <div className="ai-chat-section" role="main" aria-label="AI Advisor chat">
      <div className="ai-chat-header">
        <div className="ai-avatar"><i className="ti ti-brain"></i></div>
        <div>
          <div className="ai-name">Apex Recovery AI</div>
          <div className="ai-role">Burnout & recovery advisor</div>
        </div>
        <div className="nav-badge" style={{ fontSize: "10px" }}><span className="live-dot"></span> LIVE</div>
      </div>

      <div className="chat-messages" role="log" aria-live="polite">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role === "user" ? "msg-user" : ""}`}>
            <div className={`msg-av ${msg.role === "user" ? "av-user" : "av-ai"}`}>
              {msg.role === "user" ? "You" : "AI"}
            </div>
            <div className={`msg-bubble ${msg.role === "user" ? "bubble-user" : "bubble-ai"}`}>
              {renderFormattedText(msg.content)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="msg">
            <div className="msg-av av-ai">AI</div>
            <div className="msg-bubble bubble-ai">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          placeholder="Share what's on your mind..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
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
      <p style={{ fontSize: "10px", color: "var(--text3)", textAlign: "center", marginTop: "8px" }}>
        Not medical advice. Wellness support only.
      </p>
    </div>
  );
}