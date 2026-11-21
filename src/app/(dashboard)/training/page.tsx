"use client";

import { Brain, Upload, Sparkles, Send, BookOpen, Lightbulb, MessageSquare } from "lucide-react";
import { useState } from "react";

/*
 * Training is not built yet: no module is trained, and saving/uploading
 * are switched off and labelled "coming soon". Nothing pretends to save.
 */
const trainingModules = [
  {
    title: "Objection Handling",
    description: "Teach your AI how to respond to common pricing and competitor objections.",
    icon: MessageSquare,
  },
  {
    title: "Product Knowledge",
    description: "Upload FAQs, feature lists, and product docs for accurate responses.",
    icon: BookOpen,
  },
  {
    title: "Closing Techniques",
    description: "Define your preferred closing styles — urgency, value-based, or consultative.",
    icon: Lightbulb,
  },
];

export default function TrainingPage() {
  const [vibeText, setVibeText] = useState("");

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center gap-3 animate-fade-up">
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/15 to-purple-light/15 flex items-center justify-center"
          style={{ border: "1px solid var(--border-card)" }}
        >
          <Brain className="w-5 h-5 text-cyan" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            AI Training Center
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Customize how your AI closes deals
          </p>
        </div>
      </div>

      {/* Training Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up delay-1">
        {trainingModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <div key={mod.title} className="glass-card p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div
                  className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan/10 to-purple-light/10 flex items-center justify-center"
                  style={{ border: "1px solid var(--border-card)" }}
                >
                  <Icon className="w-4.5 h-4.5 text-cyan" />
                </div>
                <span
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                  style={{ color: "var(--text-muted)", background: "var(--bg-pill)" }}
                >
                  Coming soon
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  {mod.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {mod.description}
                </p>
              </div>
              <p className="text-[10px] mt-auto" style={{ color: "var(--text-dimmed)" }}>
                Not set up yet
              </p>
            </div>
          );
        })}
      </div>

      {/* Vibe Training */}
      <div className="glass-card p-6 animate-fade-up delay-2">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-5 h-5 text-cyan" />
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Explain Your Vibe
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Tell the AI how you sell — your tone, style, and personality
            </p>
          </div>
        </div>

        <textarea
          className="glass-textarea w-full min-h-[160px] p-4 text-sm leading-relaxed mb-4"
          placeholder="I like to keep things casual and friendly. I never pressure clients — instead, I focus on showing value and creating urgency through limited-time offers. My tone is warm but confident..."
          value={vibeText}
          onChange={(e) => setVibeText(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled
            className="btn-gradient px-5 py-2.5 flex items-center gap-2 text-xs font-medium cursor-not-allowed opacity-50"
          >
            <Send className="w-3.5 h-3.5" /> Saving coming soon
          </button>
          <button
            type="button"
            disabled
            className="glass-pill px-4 py-2.5 flex items-center gap-2 text-xs cursor-not-allowed opacity-60"
            style={{ color: "var(--text-muted)" }}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload coming soon
          </button>
        </div>
      </div>
    </>
  );
}
