"use client";

import {
  Sparkles,
  X,
  Camera,
  Send,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";

type AssistantMode = "screenshot" | "closer" | "help";

const modeConfig = {
  screenshot: { label: "📸", fullLabel: "Screenshot", placeholder: "Describe what's in the screenshot..." },
  closer: { label: "💰", fullLabel: "Sales Closer", placeholder: "Paste customer message..." },
  help: { label: "❓", fullLabel: "App Help", placeholder: "Ask about Bombin AI..." },
};

const aiResponses: Record<AssistantMode, string> = {
  screenshot:
    "I can see the pricing details! Here's a response: \"Great choice on the Premium plan! The annual option saves you 20% — want me to set that up right now? Takes less than 2 minutes.\" 🚀",
  closer:
    "Perfect closing angle: \"I totally get the hesitation. What if we started with a 14-day pilot? Zero risk, and you'll see results by day 3. When works best for a quick setup call?\" 🎯",
  help:
    "To connect WhatsApp, tap the green button at the top → scan the QR code from WhatsApp Settings → Linked Devices. Bombin will start analyzing your chats automatically! 📱",
};

export default function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("screenshot");
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string; type?: "image" | "text" }[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateResponse = useCallback(
    (userContent: string, type: "image" | "text") => {
      setMessages((prev) => [...prev, { role: "user", content: userContent, type }]);
      setIsGenerating(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: aiResponses[mode] },
        ]);
        setIsGenerating(false);
      }, 1500);
    },
    [mode]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => generateResponse(e.target?.result as string, "image");
      reader.readAsDataURL(file);
    },
    [generateResponse]
  );

  const handleSend = () => {
    if (!textInput.trim()) return;
    generateResponse(textInput, "text");
    setTextInput("");
  };

  const handleCopy = (i: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => {
    setMessages([]);
    setTextInput("");
    setIsGenerating(false);
  };

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fab pointer-events-auto relative z-30 cursor-pointer touch-action-manipulation"
        id="fab-assistant"
        aria-label="AI Assistant"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-[140px] right-3 left-3 z-50 glass-card p-4 animate-fade-up max-h-[65vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan/15 to-purple-light/15 flex items-center justify-center" style={{ border: "1px solid var(--border-card)" }}>
                  <Sparkles className="w-4 h-4 text-cyan" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    AI Assistant
                  </h3>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {modeConfig[mode].fullLabel} mode
                  </p>
                </div>
              </div>
              {messages.length > 0 && (
                <button onClick={reset} className="text-[11px]" style={{ color: "var(--text-dimmed)" }}>
                  Clear
                </button>
              )}
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-1 mb-3">
              {(Object.keys(modeConfig) as AssistantMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); reset(); }}
                  className={`mode-tab flex-1 text-center pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer ${mode === m ? "active" : ""}`}
                >
                  {modeConfig[m].label} {modeConfig[m].fullLabel}
                </button>
              ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 mb-3 min-h-[100px]">
              {messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-2 py-4">
                  {mode === "screenshot" ? (
                    <ImageIcon className="w-8 h-8" style={{ color: "var(--text-faint)" }} />
                  ) : mode === "closer" ? (
                    <MessageSquare className="w-8 h-8" style={{ color: "var(--text-faint)" }} />
                  ) : (
                    <HelpCircle className="w-8 h-8" style={{ color: "var(--text-faint)" }} />
                  )}
                  <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                    {mode === "screenshot"
                      ? "Upload a screenshot or type below"
                      : mode === "closer"
                      ? "Paste a customer message"
                      : "Ask about Bombin AI"}
                  </p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={msg.role === "ai" ? "" : "flex justify-end"}>
                    {msg.role === "user" && msg.type === "image" ? (
                      <div className="chat-bubble-user p-1.5 max-w-[80%] rounded-lg overflow-hidden">
                        <img src={msg.content} alt="Uploaded" className="w-full rounded-md max-h-[80px] object-cover" />
                      </div>
                    ) : msg.role === "user" ? (
                      <div className="chat-bubble-user p-2.5 max-w-[80%]">
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-primary)" }}>{msg.content}</p>
                      </div>
                    ) : (
                      <div className="chat-bubble p-3">
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{msg.content}</p>
                        <button
                          onClick={() => handleCopy(i, msg.content)}
                          className="mt-2 glass-pill px-2 py-1 flex items-center gap-1 text-[10px] pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {copied === i ? <><Check className="w-2.5 h-2.5 text-success" /> Copied</> : <><Copy className="w-2.5 h-2.5" /> Copy</>}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
              {isGenerating && (
                <div className="chat-bubble p-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan animate-spin" />
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-cyan/40 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-cyan/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 bg-cyan/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2">
              {mode === "screenshot" && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "var(--bg-pill)", border: "1px solid var(--border-card)" }}
                >
                  <Camera className="w-3.5 h-3.5 text-cyan" />
                </button>
              )}
              <input
                type="text"
                className="glass-input flex-1 px-3 py-2 text-xs"
                placeholder={modeConfig[mode].placeholder}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!textInput.trim() || isGenerating}
                className="btn-gradient pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer w-8 h-8 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-30"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
