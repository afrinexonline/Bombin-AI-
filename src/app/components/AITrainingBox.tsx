"use client";

import { Brain, Upload, Send } from "lucide-react";
import { useState } from "react";

/*
 * AI Training box. Saving and training are not built yet, so the buttons
 * are switched off and labelled "coming soon". Nothing pretends to save.
 */
export default function AITrainingBox() {
  const [vibeText, setVibeText] = useState("");

  return (
    <div className="glass-card p-5 animate-fade-up delay-4 flex flex-col" id="ai-training-box">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan/15 to-purple-light/15 flex items-center justify-center"
          style={{ border: "1px solid var(--border-card)" }}
        >
          <Brain className="w-4.5 h-4.5 text-cyan" />
        </div>
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            AI Training
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Teach your closer
          </p>
        </div>
      </div>

      {/* Vibe Textarea */}
      <div className="relative mb-3 flex-1">
        <textarea
          className="glass-textarea w-full h-full min-h-[120px] p-4 text-sm leading-relaxed"
          placeholder="Explain your vibe... How do you close deals? What tone should the AI use? Drop your personality here ✨"
          value={vibeText}
          onChange={(e) => setVibeText(e.target.value)}
          id="vibe-textarea"
        />
        {vibeText.length > 0 && (
          <span className="absolute bottom-3 right-3 text-[10px]" style={{ color: "var(--text-faint)" }}>
            {vibeText.length}/2000
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled
          className="btn-gradient px-4 py-2.5 flex items-center gap-2 text-xs font-medium flex-1 justify-center cursor-not-allowed opacity-50"
          id="save-vibe-btn"
        >
          <Send className="w-3.5 h-3.5" />
          Saving coming soon
        </button>

        <button
          type="button"
          disabled
          className="glass-pill px-4 py-2.5 flex items-center gap-2 text-xs cursor-not-allowed opacity-60"
          style={{ color: "var(--text-muted)" }}
          id="upload-chat-btn"
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Upload coming soon</span>
          <span className="sm:hidden">Soon</span>
        </button>
      </div>

      {/* Status */}
      <div className="mt-3 flex items-center gap-2 text-[11px]" style={{ color: "var(--text-dimmed)" }}>
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text-dimmed)" }} />
        <span>AI not trained yet • Training is coming soon</span>
      </div>
    </div>
  );
}
