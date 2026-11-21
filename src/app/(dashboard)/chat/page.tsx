"use client";

import { MessageSquare, Bot, User as UserIcon, Send, Keyboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmptyState from "../../components/EmptyState";

interface Message {
  id: number;
  sender: "customer" | "ai";
  name?: string;
  text: string;
  time: string;
}

// Real conversations arrive once WhatsApp and the AI engine are connected (M5/M6).
// Never show canned or fake AI replies to real users.
const preloadedMessages: Message[] = [];

export default function ChatPage() {
  const [isAutopilot, setIsAutopilot] = useState(true);
  const [messages] = useState<Message[]>(preloadedMessages);
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(0,201,255,0.15), rgba(123,47,190,0.15))",
              border: "1px solid rgba(0,201,255,0.2)",
            }}
          >
            <MessageSquare className="w-4.5 h-4.5 text-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Live Chat Monitor
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Watch your AI handle customer conversations in real-time
            </p>
          </div>
        </div>
      </div>

      {/* Toggle Bar */}
      <div className="glass-card p-4 rounded-2xl animate-fade-up delay-1">
        <div className="flex items-center justify-between gap-4">
          {/* Left Label */}
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan" />
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              AI Autopilot
            </span>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setIsAutopilot(!isAutopilot)}
            className={`autopilot-toggle ${isAutopilot ? "ai-mode" : "human-mode"}`}
            aria-label="Toggle autopilot mode"
          >
            <div className="autopilot-toggle-knob">
              {isAutopilot ? (
                <Bot className="w-3 h-3 text-white" />
              ) : (
                <Keyboard className="w-3 h-3 text-white" />
              )}
            </div>
          </button>

          {/* Right Label */}
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4" style={{ color: "var(--text-muted)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Human Takeover
            </span>
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-3 text-center">
          <p className="text-xs font-medium" style={{ color: "#FFB300" }}>
            AI chat not connected yet. This switch will work once WhatsApp is connected.
          </p>
        </div>
      </div>

      {/* Chat Timeline */}
      <div
        className="glass-card rounded-2xl overflow-hidden animate-fade-up delay-2"
        style={{ maxHeight: "calc(100vh - 360px)", minHeight: "400px" }}
      >
        <div className="overflow-y-auto p-5 space-y-5" style={{ maxHeight: "calc(100vh - 420px)", minHeight: "340px" }}>
          {messages.length === 0 && (
            <EmptyState
              title="AI chat not connected yet"
              icon={MessageSquare}
              message="Customer conversations will show here once your WhatsApp number is connected."
              className="min-h-[300px]"
            />
          )}
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.sender === "customer" ? "flex justify-start" : "flex justify-end"}`}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={`max-w-[85%] sm:max-w-[75%]`}>
                {/* Sender Label */}
                <div
                  className={`flex items-center gap-1.5 mb-1.5 ${msg.sender === "ai" ? "justify-end" : ""}`}
                >
                  {msg.sender === "customer" ? (
                    <>
                      <UserIcon className="w-3 h-3" style={{ color: "var(--text-muted)" }} />
                      <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                        {msg.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-cyan" />
                      <span className="text-[11px] font-semibold text-cyan">BOMBIN AI</span>
                    </>
                  )}
                  <span className="text-[10px]" style={{ color: "var(--text-dimmed)" }}>
                    {msg.time}
                  </span>
                </div>

                {/* Bubble */}
                <div
                  className={`${msg.sender === "customer" ? "chat-bubble-customer" : "chat-bubble-ai"} px-4 py-3`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-primary)" }}>
                    {msg.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar — only shown in Human Takeover mode */}
        {!isAutopilot && (
          <div
            className="px-4 py-3 flex items-center gap-3"
            style={{ borderTop: "1px solid var(--border-card)" }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Replying from here is coming soon"
              disabled
              className="glass-input flex-1 px-4 py-2.5 text-sm rounded-xl cursor-not-allowed opacity-60"
              style={{ color: "var(--text-primary)" }}
            />
            <button
              type="button"
              disabled
              aria-label="Sending is coming soon"
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-not-allowed opacity-50"
              style={{
                background: "linear-gradient(135deg, #00C9FF, #7B2FBE)",
                color: "white",
                boxShadow: "0 0 20px rgba(0,201,255,0.2)",
              }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
