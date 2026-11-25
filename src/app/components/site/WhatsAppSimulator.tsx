"use client";

import { useEffect, useRef, useState } from "react";

/*
 * The live WhatsApp chat simulator (moved here from the landing page in Step 4B so the
 * landing page and the WhatsApp AI Assistant page share one copy). Looks and behaves
 * exactly as before.
 */

interface ChatMsg {
  sender: "customer" | "ai" | "system";
  text: string;
  time: string;
}

// ── Conversation script — verbatim Pidgin/English sales close ──
const CHAT_SCRIPT: ChatMsg[] = [
  { sender: "customer", text: "Hello, I saw the premium velvet chesterfield sofa on your Instagram page. How much is it? I need it delivered to my showroom in Abuja.", time: "10:14 AM" },
  { sender: "ai",       text: "Good day! Thank you for reaching out to us. That premium velvet Chesterfield sofa is an absolute masterpiece—pure luxury. The price is ₦1,200,000, and it is readily available for immediate processing.", time: "10:15 AM" },
  { sender: "customer", text: "Ah, the price high small o. And how long will it take to reach Abuja? I have an event next week Thursday.", time: "10:17 AM" },
  { sender: "ai",       text: "I completely understand, my wrapper! But match the quality texturing and the solid hardwood frame structure, you go know say it's worth every single Kobo. For delivery down to Abuja, no shaking at all. Our secure logistics partners go deliver am straight to your doorstep within 3 days maximum. If we lock down the order now, it go reach your side before weekend self.", time: "10:19 AM" },
  { sender: "customer", text: "Okay dynamic! I like the assurance. How do I make payment to lock it down?", time: "10:21 AM" },
  { sender: "ai",       text: "Perfect choice! I dey send you our secure checkout link and invoice right now make we finalize everything sharp-sharp. Welcome to the premium club! 🚀", time: "10:22 AM" },
];

// Step timing config
const STEPS = [
  { action: "typing" },
  { action: "msg", idx: 1 },
  { action: "msg", idx: 2 },
  { action: "typing" },
  { action: "msg", idx: 3 },
  { action: "msg", idx: 4 },
  { action: "typing" },
  { action: "msg", idx: 5 },
  { action: "hold" },
  { action: "hold" },
  { action: "reset" },
] as const;

export default function WhatsAppSimulator() {
  const [simulationMessages, setSimulationMessages] = useState<ChatMsg[]>([CHAT_SCRIPT[0]]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastAppliedStep  = useRef<number>(-1);

  // Auto-scroll the inner chat box only — never touches window scroll
  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [simulationMessages, isTyping]);

  // Simulation loop — useRef gate ensures exactly-once execution per step
  useEffect(() => {
    lastAppliedStep.current = -1;

    const interval = setInterval(() => {
      lastAppliedStep.current = (lastAppliedStep.current + 1) % STEPS.length;
      const step = STEPS[lastAppliedStep.current];

      if (step.action === "reset") {
        setSimulationMessages([CHAT_SCRIPT[0]]);
        setIsTyping(false);
      } else if (step.action === "typing") {
        setIsTyping(true);
      } else if (step.action === "msg") {
        setIsTyping(false);
        const msg = CHAT_SCRIPT[step.idx];
        setSimulationMessages(prev => {
          if (prev.some(m => m.text === msg.text)) return prev;
          return [...prev, msg];
        });
      } else if (step.action === "hold") {
        // No-op — hold display
      }
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[420px] overflow-hidden shadow-2xl relative border border-white/10 animate-floating bg-white/[0.04] backdrop-blur-2xl rounded-[20px] pointer-events-auto z-30" style={{ height: '520px' }}>
      {/* WhatsApp header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#128C7E] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#128C7E] font-bold text-sm">B</div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-white">Bombin AI Assistant</span>
            <span className="text-[10px] text-emerald-100 font-medium">Active Auto-Closer</span>
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90 bg-white/15 border border-white/25 px-2 py-0.5 rounded-full">
          Example chat
        </span>
      </div>

      {/* Chat stream — locked, no page scroll */}
      <div
        ref={chatContainerRef}
        className="p-4 space-y-4 flex flex-col justify-start overflow-y-auto bg-[#ece5dd] scrollbar-none pointer-events-auto relative z-30 touch-action-manipulation"
        style={{ height: '420px', maxHeight: '420px', touchAction: 'manipulation' }}
      >
        {simulationMessages.map((msg, idx) => (
          <div
            key={`${idx}-${msg.time}`}
            style={{ touchAction: "manipulation" }}
            className={`flex flex-col max-w-[85%] chat-message pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer ${
              msg.sender === "customer" ? "self-start items-start" : "self-end items-end"
            }`}
          >
            <div
              className={`p-3.5 text-sm leading-relaxed text-slate-900 shadow-sm ${
                msg.sender === "customer"
                  ? "bg-white rounded-2xl rounded-tl-sm"
                  : "bg-[#dcf8c6] rounded-2xl rounded-tr-sm"
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
          </div>
        ))}

        {isTyping && (
          <div
            style={{ touchAction: "manipulation" }}
            className="self-end flex items-center gap-1.5 bg-[#dcf8c6] p-3 rounded-2xl rounded-tr-sm text-xs text-slate-700 shadow-sm pointer-events-auto relative z-30 touch-action-manipulation"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-75" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce delay-150" />
            <span>typing...</span>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="bg-white px-4 py-3 text-center text-xs text-slate-500 border-t border-slate-200 shrink-0 pointer-events-auto relative z-30">
        ⚡ Simulated Live WhatsApp Deal
      </div>
    </div>
  );
}
