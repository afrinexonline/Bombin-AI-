"use client";

import { Smartphone, Shield, Clock } from "lucide-react";

/* ═══════════════════════════════════════════════════
   Step 4 — WhatsApp Handshake Link
   The real QR connection is not built yet (M5), so this step
   says so honestly. The page's own "Launch Dashboard" button
   saves onboarding and goes to the dashboard.
   ═══════════════════════════════════════════════════ */

export default function StepWhatsAppLink() {
  return (
    <div className="space-y-6 text-center">
      {/* Section Title */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(37, 211, 102, 0.1)",
            border: "1px solid rgba(37, 211, 102, 0.15)",
          }}
        >
          <Smartphone size={18} className="text-whatsapp" />
        </div>
        <div className="text-left">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Connect your WhatsApp Business Line
          </h2>
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Final step — link your number to activate AI
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div
        className="glass-card-static p-5 text-left text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        <p className="mb-2">
          <strong style={{ color: "var(--text-primary)" }}>How it works:</strong>
        </p>
        <ol className="list-decimal list-inside space-y-1.5" style={{ color: "var(--text-muted)" }}>
          <li>Open WhatsApp on your phone</li>
          <li>Go to <strong>Settings → Linked Devices</strong></li>
          <li>Tap <strong>Link a Device</strong> and scan the QR code</li>
          <li>Your AI assistant starts replying to customers</li>
        </ol>
      </div>

      {/* Coming-soon panel (same place and size as the future QR code) */}
      <div className="flex justify-center py-4">
        <div
          className="rounded-2xl p-6 w-[248px] h-[248px] flex flex-col items-center justify-center gap-3"
          style={{
            background: "rgba(37, 211, 102, 0.06)",
            border: "2px dashed rgba(37, 211, 102, 0.35)",
            boxShadow: "0 0 60px rgba(0, 201, 255, 0.08)",
          }}
        >
          <Clock size={40} style={{ color: "#25D366" }} />
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            WhatsApp connection coming soon
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            You can finish setup now and connect your number from the dashboard when it&apos;s ready.
          </p>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-3">
        <span
          className="relative inline-flex rounded-full h-3 w-3"
          style={{ background: "var(--text-dimmed)" }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Not connected yet
        </span>
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Shield size={14} style={{ color: "var(--text-dimmed)" }} />
        <span
          className="text-xs"
          style={{ color: "var(--text-dimmed)" }}
        >
          Nothing is linked until you scan the QR code yourself
        </span>
      </div>
    </div>
  );
}
