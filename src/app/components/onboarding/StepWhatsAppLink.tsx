"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Smartphone, Shield } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

/* ═══════════════════════════════════════════════════
   Step 4 — WhatsApp Handshake Link
   QR-based connection flow
   ═══════════════════════════════════════════════════ */

export default function StepWhatsAppLink() {
  const router = useRouter();
  const { updateFields } = useOnboarding();

  const handleConnect = () => {
    updateFields({ completed: true, whatsappConnected: true });
    router.push("/dashboard");
  };

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
          <li>Tap <strong>Link a Device</strong> and scan the QR code below</li>
          <li>Your AI assistant will activate instantly</li>
        </ol>
      </div>

      {/* QR Code Placeholder */}
      <div className="flex justify-center py-4">
        <div
          className="rounded-2xl p-6 inline-block"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 0 60px rgba(0, 201, 255, 0.1)",
          }}
        >
          <Image
            src="/qr-placeholder.png"
            alt="WhatsApp QR"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-center gap-3">
        <span className="relative flex h-3 w-3">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ background: "#25D366" }}
          />
          <span
            className="relative inline-flex rounded-full h-3 w-3"
            style={{ background: "#25D366" }}
          />
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Ready to connect...
        </span>
      </div>

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        className="btn-gradient px-8 py-3 text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
      >
        Isolate Link Check
      </button>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <Shield size={14} style={{ color: "var(--text-dimmed)" }} />
        <span
          className="text-xs"
          style={{ color: "var(--text-dimmed)" }}
        >
          End-to-end encrypted connection
        </span>
      </div>
    </div>
  );
}
