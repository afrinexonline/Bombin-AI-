"use client";

import { MessageSquare, Bot, User as UserIcon, Send, Keyboard } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  sender: "customer" | "ai";
  name?: string;
  text: string;
  time: string;
}

const preloadedMessages: Message[] = [
  { id: 1, sender: "customer", name: "Chief Okoro", text: "Good afternoon! I saw your Chesterfield collection on Instagram. I need two pieces for my Abuja mansion. What's the price and delivery timeline?", time: "2:14 PM" },
  { id: 2, sender: "ai", text: "Good afternoon, Chief! 🙏 Welcome to our showroom. Our Premium Chesterfield set goes for ₦1,200,000 per piece. For Abuja delivery, we handle logistics door-to-door within 5-7 working days. Would you like to see the leather swatches? I can send photos right away! 📸", time: "2:14 PM" },
  { id: 3, sender: "customer", name: "Mrs. Adebayo", text: "Pls how much for the consulting inspection fee for Port Harcourt? My friend said you people are good with interior design.", time: "2:31 PM" },
  { id: 4, sender: "ai", text: "Thank you ma! 😊 Our Consulting & Inspection fee for Port Harcourt is ₦50,000. This covers a full site assessment, mood board creation, and material recommendations. We can schedule a visit this week if you're available. Should I check our calendar? 📅", time: "2:31 PM" },
  { id: 5, sender: "customer", name: "Engr. Nnamdi", text: "Bros abeg, I wan furnish my new apartment for Lekki. Budget na around 5M. Wetin una fit do?", time: "3:05 PM" },
  { id: 6, sender: "ai", text: "My guy! 🔥 5M budget dey very correct o! For that range, we fit hook you up with: \n\n• Full living room set (Chesterfield + Ottoman) — ₦2.4M\n• Dining set (6-seater marble top) — ₦1.2M\n• Master bedroom ensemble — ₦1.1M\n• Delivery & installation — FREE\n\nTotal: ₦4.7M — you still get ₦300k change! 💰 Make I send you the catalog?", time: "3:05 PM" },
  { id: 7, sender: "customer", name: "Hajiya Fatima", text: "Salam. I want gold-accented curtains for 8 windows in my Kano home. Do you ship outside Lagos?", time: "3:22 PM" },
  { id: 8, sender: "ai", text: "Wa alaikum salam, Hajiya! 🌟 Yes ma, we ship nationwide. Our gold-accented luxury curtain sets start from ₦180,000 per window. For 8 windows, the total would be ₦1,440,000. We offer a 10% bulk discount, bringing it to ₦1,296,000. Kano delivery takes 7-10 working days. Shall I share fabric samples via WhatsApp? 🎨", time: "3:22 PM" },
];

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
          <p className="text-xs font-medium" style={{ color: isAutopilot ? "#00C9FF" : "#FFB300" }}>
            {isAutopilot
              ? "AI is handling all conversations"
              : "You are in control — type to respond"}
          </p>
        </div>
      </div>

      {/* Chat Timeline */}
      <div
        className="glass-card rounded-2xl overflow-hidden animate-fade-up delay-2"
        style={{ maxHeight: "calc(100vh - 360px)", minHeight: "400px" }}
      >
        <div className="overflow-y-auto p-5 space-y-5" style={{ maxHeight: "calc(100vh - 420px)", minHeight: "340px" }}>
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
              placeholder="Type a message to take over..."
              className="glass-input flex-1 px-4 py-2.5 text-sm rounded-xl"
              style={{ color: "var(--text-primary)" }}
            />
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
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
