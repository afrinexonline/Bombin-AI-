"use client";

import { Mic, Check, Globe } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

/* ═══════════════════════════════════════════════════
   Step 2 — Tone & Behavior Selection
   Brand voice personality & language picker
   ═══════════════════════════════════════════════════ */

const TONES = [
  {
    value: "the_professional",
    emoji: "💎",
    title: "The Professional",
    vibe: "Speaks with pure authority and facts. Perfect for high-quality, high-ticket items where customers ask deep technical questions.",
    bestFor: "High-end electronics, luxury goods, coaching, or corporate services."
  },
  {
    value: "the_warm_friend",
    emoji: "🤝",
    title: "The Warm Friend",
    vibe: "Soft, caring, and highly empathetic. Listens patiently to customer complaints and builds deep emotional trust.",
    bestFor: "Skincare, hair/beauty products, health supplements, or custom fashion."
  },
  {
    value: "the_hype_man",
    emoji: "🔥",
    title: "The Hype Man",
    vibe: "Upbeat, excited, and fast-paced. Uses high energy to create massive hype and drive urgent purchasing decisions!",
    bestFor: "Ready-to-wear clothing, flash sales, fast food, or trendy accessories."
  },
  {
    value: "the_fast_seller",
    emoji: "🎯",
    title: "The Fast Seller",
    vibe: "Direct, bold, and hyper-focused on the sale. Instantly handles doubts and guides the buyer straight to the payment link.",
    bestFor: "Pre-orders, highly competitive markets, and clearing out stock fast."
  }
];

export default function StepToneSelection() {
  const { data, updateField } = useOnboarding();

  return (
    <div className="space-y-6">
      {/* ── Premium Language Toggle ── */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 pt-2 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold leading-tight max-w-xl mx-auto" style={{
          background: "linear-gradient(to right, #00C9FF, #7B2FBE)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Do you want your AI employee to speak Pure street / Hyper-Local Pidgin?
        </h2>
        
        {/* Toggle Switch */}
        <button
          type="button"
          onClick={() => updateField("speakPidgin", !data.speakPidgin)}
          className={`relative w-16 h-8 rounded-full transition-all duration-300 shrink-0 border border-white/10 ${
            data.speakPidgin 
              ? "bg-purple-light shadow-[0_0_15px_rgba(123,47,190,0.6)]" 
              : "bg-white/10 shadow-none"
          }`}
        >
          <div 
            className={`absolute top-1 bottom-1 w-6 bg-white rounded-full transition-all duration-300 shadow-md ${
              data.speakPidgin ? "left-9" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* ── Behavior Selection ── */}
      <div className="pt-2">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              background: "rgba(0, 201, 255, 0.1)",
              border: "1px solid rgba(0, 201, 255, 0.15)",
            }}
          >
            <Mic size={18} className="text-cyan" />
          </div>
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Choose your brand behavior
            </h2>
            <p
              className="text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Your AI will match this personality in every conversation
            </p>
          </div>
        </div>

        {/* 2x2 Smart Behavior Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
          {TONES.map((tone) => {
            const isSelected = data.tonePreference === tone.value;

            return (
              <button
                key={tone.value}
                type="button"
                onClick={() => updateField("tonePreference", tone.value as any)}
                className={`tone-card p-3 text-left relative cursor-pointer flex flex-col transition-all duration-300 ${
                  isSelected ? "selected shadow-lg scale-[1.02] sm:scale-100" : ""
                }`}
                style={{
                  minHeight: "72px"
                }}
              >
                {/* Header (Always Visible) */}
                <div className="flex items-center gap-3 w-full">
                  <span className="text-2xl shrink-0 leading-none">
                    {tone.emoji}
                  </span>
                  <h3
                    className="text-sm font-semibold flex-1 leading-tight"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {tone.title}
                  </h3>
                  {isSelected && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(0, 201, 255, 0.15)",
                        border: "1px solid rgba(0, 201, 255, 0.4)",
                      }}
                    >
                      <Check size={10} className="text-cyan stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Active Expansion Engine */}
                <div 
                  className={`transition-all duration-300 overflow-hidden w-full ${
                    isSelected ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      <span className="font-semibold text-white">Vibe:</span> {tone.vibe}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-dimmed)" }}>
                      <span className="font-semibold text-white/70">Best For:</span> {tone.bestFor}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Intent Micro-Survey ── */}
      <div className="pt-6 border-t border-white/[0.06] space-y-4">
        <div>
          <h2
            className="text-base font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            What do you want your AI employee to do?
          </h2>
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Select one or multiple objectives for your AI
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {[
            {
              id: "sell_support",
              optionCode: "Option A",
              label: "Help sell products & Customer support",
            },
            {
              id: "book_appts",
              optionCode: "Option B",
              label: "Book appointments & consultations (Service-based)",
            },
            {
              id: "faq_leads",
              optionCode: "Option C",
              label: "Answer product FAQs & capture leads (E-commerce)",
            },
          ].map((opt) => {
            const isSelected = data.intentSelections?.includes(opt.id);

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  const current = data.intentSelections || [];
                  const updated = current.includes(opt.id)
                    ? current.filter((x) => x !== opt.id)
                    : [...current, opt.id];
                  updateField("intentSelections", updated);
                }}
                className={`tone-card p-4 text-left relative cursor-pointer w-full transition-all duration-200 hover:scale-[1.01] ${
                  isSelected ? "selected" : ""
                }`}
              >
                <div className="flex items-center gap-4 w-full">
                  {/* Circle Checkbox Widget */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      isSelected
                        ? "border-[#00C9FF] bg-[#00C9FF]/15 text-[#00C9FF]"
                        : "border-white/20 bg-transparent text-transparent"
                    }`}
                  >
                    <Check size={12} className="stroke-[3]" />
                  </div>
                  <div className="flex-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider block mb-0.5"
                      style={{ color: "var(--text-dimmed)" }}
                    >
                      {opt.optionCode}
                    </span>
                    <h3
                      className="text-sm font-semibold leading-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {opt.label}
                    </h3>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
