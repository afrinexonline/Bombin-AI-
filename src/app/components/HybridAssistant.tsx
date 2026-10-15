"use client";

import {
  Sparkles,
  Copy,
  Check,
  Image as ImageIcon,
  Send,
  Camera,
  MessageSquare,
  HelpCircle,
  X,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";

type AssistantMode = "screenshot" | "closer" | "help";

const modeConfig = {
  screenshot: { label: "📸 Screenshot", placeholder: "Describe what's in the screenshot..." },
  closer: { label: "💰 Sales Closer", placeholder: "Paste the customer message to generate a closing response..." },
  help: { label: "❓ App Help", placeholder: "Ask anything about how to use Bombin AI..." },
};

const aiResponses: Record<AssistantMode, string[]> = {
  screenshot: [
    "Hey! Thanks for reaching out 😊 I see you're interested in our Premium plan — great choice! Based on what you've shared, I think the annual option gives you the best value. Want me to set that up for you? I can have everything ready in under 5 minutes. 🚀",
    "I can see the pricing breakdown in your screenshot. Let me suggest a counter-offer that addresses their budget concerns while maintaining our margins. Here's what I'd recommend...",
  ],
  closer: [
    "Perfect response for this situation: \"I completely understand your concern about the price. Let me show you the ROI our top clients are seeing — most recoup the investment within 30 days. Would a quick 10-minute walkthrough help?\" 🎯",
    "Here's a high-converting closing angle: \"What if I told you we could start with a smaller pilot to prove the value? No risk, just results. When's a good time to set that up?\" 💪",
  ],
  help: [
    "To connect your WhatsApp, click the green 'Connect WhatsApp' button in the top bar. You'll see a QR code — scan it with your WhatsApp app (Settings → Linked Devices → Link a Device). Once connected, Bombin AI will start analyzing your conversations automatically! 📱",
    "The Momentum Tracker shows your active deals ranked by closing probability. 🔥 means the deal is hot, 💬 means active conversation, and ❄️ means it needs attention. Click any deal to see the full conversation history.",
  ],
};

export default function HybridAssistant() {
  const [mode, setMode] = useState<AssistantMode>("screenshot");
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string; type?: "image" | "text" }[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const generateResponse = useCallback(
    (userContent: string, type: "image" | "text") => {
      setMessages((prev) => [...prev, { role: "user", content: userContent, type }]);
      setIsGenerating(true);
      setTimeout(() => {
        const responses = aiResponses[mode];
        const response = responses[Math.floor(Math.random() * responses.length)];
        setMessages((prev) => [...prev, { role: "ai", content: response }]);
        setIsGenerating(false);
        setTimeout(() => {
          scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
        }, 100);
      }, 1500 + Math.random() * 1000);
    },
    [mode]
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImagePreview(dataUrl);
        generateResponse(dataUrl, "image");
      };
      reader.readAsDataURL(file);
    },
    [generateResponse]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleSendText = () => {
    if (!textInput.trim()) return;
    generateResponse(textInput, "text");
    setTextInput("");
  };

  const handleCopy = (index: number, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const reset = () => {
    setImagePreview(null);
    setMessages([]);
    setIsGenerating(false);
    setTextInput("");
  };

  return (
    <div className="glass-card p-5 animate-fade-up delay-5 flex flex-col" id="hybrid-assistant">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan/15 to-purple-light/15 border flex items-center justify-center" style={{ borderColor: "var(--border-card)" }}>
            <Sparkles className="w-4.5 h-4.5 text-cyan" />
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              AI Assistant
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Screenshot • Close • Help
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={reset} className="text-xs transition-colors hover:opacity-80" style={{ color: "var(--text-dimmed)" }}>
            Clear
          </button>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 mb-3">
        {(Object.keys(modeConfig) as AssistantMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`mode-tab ${mode === m ? "active" : ""}`}
            id={`mode-${m}`}
          >
            {modeConfig[m].label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-[160px] max-h-[300px] overflow-y-auto flex flex-col gap-3 pr-1 mb-3"
      >
        {messages.length === 0 && !imagePreview ? (
          /* Empty State — Drop Zone */
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => mode === "screenshot" && fileInputRef.current?.click()}
            className={`drop-zone flex-1 min-h-[120px] flex flex-col items-center justify-center gap-2.5 ${isDragOver ? "drag-over" : ""}`}
            id="screenshot-drop-zone"
          >
            {mode === "screenshot" ? (
              <>
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-pill)", border: "1px solid var(--border-card)" }}>
                  <ImageIcon className="w-5 h-5" style={{ color: "var(--text-faint)" }} />
                </div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Drop a screenshot here
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
                  or click to browse • PNG, JPG
                </p>
              </>
            ) : mode === "closer" ? (
              <>
                <MessageSquare className="w-8 h-8" style={{ color: "var(--text-faint)" }} />
                <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
                  Paste a customer message below<br />
                  <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>AI will generate a closing response</span>
                </p>
              </>
            ) : (
              <>
                <HelpCircle className="w-8 h-8" style={{ color: "var(--text-faint)" }} />
                <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
                  Ask about Bombin AI<br />
                  <span className="text-[11px]" style={{ color: "var(--text-faint)" }}>Features, setup, tips & tricks</span>
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "ai" ? "" : "flex justify-end"}>
                {msg.role === "user" && msg.type === "image" ? (
                  <div className="chat-bubble-user p-2 max-w-[85%] rounded-xl overflow-hidden">
                    <img src={msg.content} alt="Uploaded" className="w-full rounded-lg max-h-[100px] object-cover object-top" />
                  </div>
                ) : msg.role === "user" ? (
                  <div className="chat-bubble-user p-3 max-w-[85%]">
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                      {msg.content}
                    </p>
                  </div>
                ) : (
                  <div className="chat-bubble p-4 max-w-[95%]">
                    <div className="flex items-start gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan mt-0.5 shrink-0" />
                      <span className="text-[10px] text-cyan/60 font-medium uppercase tracking-wider">
                        AI Response
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {msg.content}
                    </p>
                    <button
                      onClick={() => handleCopy(i, msg.content)}
                      className="mt-2.5 glass-pill px-3 py-1.5 flex items-center gap-1.5 text-[11px] transition-colors"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {copied === i ? (
                        <><Check className="w-3 h-3 text-success" /> Copied!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy</>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {isGenerating && (
              <div className="chat-bubble p-4 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-cyan animate-spin" />
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-cyan/40 rounded-full animate-bounce" style={{ animationDelay: "0s" }} />
                  <span className="w-2 h-2 bg-cyan/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-2 h-2 bg-cyan/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Thinking...</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Text Input Bar */}
      <div className="flex items-center gap-2">
        {mode === "screenshot" && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors"
            style={{ background: "var(--bg-pill)", border: "1px solid var(--border-card)" }}
            title="Upload screenshot"
          >
            <Camera className="w-4 h-4 text-cyan" />
          </button>
        )}
        <input
          type="text"
          className="glass-input flex-1 px-4 py-2.5 text-sm"
          placeholder={modeConfig[mode].placeholder}
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendText()}
          id="assistant-input"
        />
        <button
          onClick={handleSendText}
          disabled={!textInput.trim() || isGenerating}
          className="btn-gradient w-9 h-9 rounded-lg flex items-center justify-center shrink-0 disabled:opacity-30"
          id="assistant-send"
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
