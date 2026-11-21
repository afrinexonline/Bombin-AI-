"use client";

import {
  Sparkles,
  X,
  Camera,
  Send,
  MessageSquare,
  HelpCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";
import { AI_NOT_CONNECTED } from "./HybridAssistant";

/*
 * Floating AI button (mobile).
 * The AI engine is not connected yet (M6), so it never shows
 * ready-made "AI" replies. The layout stays for when the AI is live.
 */

type AssistantMode = "screenshot" | "closer" | "help";

const modeConfig = {
  screenshot: { label: "📸", fullLabel: "Screenshot", hint: "Turn a chat screenshot into a reply" },
  closer: { label: "💰", fullLabel: "Sales Closer", hint: "Get a closing reply for a customer message" },
  help: { label: "❓", fullLabel: "App Help", hint: "Ask how to use Bombin AI" },
};

export default function FAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AssistantMode>("screenshot");

  const ModeIcon = mode === "screenshot" ? ImageIcon : mode === "closer" ? MessageSquare : HelpCircle;

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
            </div>

            {/* Mode Tabs */}
            <div className="flex gap-1 mb-3">
              {(Object.keys(modeConfig) as AssistantMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`mode-tab flex-1 text-center pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer ${mode === m ? "active" : ""}`}
                >
                  {modeConfig[m].label} {modeConfig[m].fullLabel}
                </button>
              ))}
            </div>

            {/* Not-connected area */}
            <div className="flex-1 flex flex-col mb-3 min-h-[100px]">
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-4 text-center">
                <ModeIcon className="w-8 h-8" style={{ color: "var(--text-faint)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  {AI_NOT_CONNECTED}
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {modeConfig[mode].hint}. Coming soon.
                </p>
              </div>
            </div>

            {/* Input (switched off until the AI is connected) */}
            <div className="flex items-center gap-2">
              {mode === "screenshot" && (
                <button
                  type="button"
                  disabled
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 cursor-not-allowed opacity-40"
                  style={{ background: "var(--bg-pill)", border: "1px solid var(--border-card)" }}
                  aria-label={AI_NOT_CONNECTED}
                >
                  <Camera className="w-3.5 h-3.5 text-cyan" />
                </button>
              )}
              <input
                type="text"
                disabled
                className="glass-input flex-1 px-3 py-2 text-xs cursor-not-allowed opacity-60"
                placeholder={AI_NOT_CONNECTED}
              />
              <button
                type="button"
                disabled
                className="btn-gradient w-8 h-8 rounded-lg flex items-center justify-center shrink-0 cursor-not-allowed opacity-30"
                aria-label={AI_NOT_CONNECTED}
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
