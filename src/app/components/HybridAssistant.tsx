"use client";

import {
  Sparkles,
  Image as ImageIcon,
  Send,
  Camera,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

/*
 * AI Assistant panel.
 * The AI engine is not connected yet (M6), so this panel never shows
 * ready-made "AI" replies. The layout stays so the real AI can plug in later.
 */

type AssistantMode = "screenshot" | "closer" | "help";

const modeConfig = {
  screenshot: { label: "📸 Screenshot", hint: "Turn a chat screenshot into a reply" },
  closer: { label: "💰 Sales Closer", hint: "Get a closing reply for a customer message" },
  help: { label: "❓ App Help", hint: "Ask how to use Bombin AI" },
};

export const AI_NOT_CONNECTED = "AI not connected yet";

export default function HybridAssistant() {
  const [mode, setMode] = useState<AssistantMode>("screenshot");

  const ModeIcon = mode === "screenshot" ? ImageIcon : mode === "closer" ? MessageSquare : HelpCircle;

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
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-1 mb-3">
        {(Object.keys(modeConfig) as AssistantMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`mode-tab pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer ${mode === m ? "active" : ""}`}
            id={`mode-${m}`}
          >
            {modeConfig[m].label}
          </button>
        ))}
      </div>

      {/* Not-connected area (same place as the chat / drop zone) */}
      <div className="flex-1 min-h-[160px] max-h-[300px] flex flex-col mb-3">
        <div
          className="drop-zone flex-1 min-h-[120px] flex flex-col items-center justify-center gap-2.5 text-center px-3 cursor-default"
          id="screenshot-drop-zone"
        >
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-pill)", border: "1px solid var(--border-card)" }}>
            <ModeIcon className="w-5 h-5" style={{ color: "var(--text-faint)" }} />
          </div>
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            {AI_NOT_CONNECTED}
          </p>
          <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
            {modeConfig[mode].hint}. Coming soon.
          </p>
        </div>
      </div>

      {/* Text Input Bar (switched off until the AI is connected) */}
      <div className="flex items-center gap-2">
        {mode === "screenshot" && (
          <button
            type="button"
            disabled
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 cursor-not-allowed opacity-40"
            style={{ background: "var(--bg-pill)", border: "1px solid var(--border-card)" }}
            title={AI_NOT_CONNECTED}
          >
            <Camera className="w-4 h-4 text-cyan" />
          </button>
        )}
        <input
          type="text"
          disabled
          className="glass-input flex-1 px-4 py-2.5 text-sm cursor-not-allowed opacity-60"
          placeholder={AI_NOT_CONNECTED}
          id="assistant-input"
        />
        <button
          type="button"
          disabled
          className="btn-gradient w-9 h-9 rounded-lg flex items-center justify-center shrink-0 cursor-not-allowed opacity-30"
          id="assistant-send"
          aria-label={AI_NOT_CONNECTED}
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
