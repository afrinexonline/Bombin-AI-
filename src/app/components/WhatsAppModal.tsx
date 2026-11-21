"use client";

import { X, Smartphone, Shield, WifiOff, Clock } from "lucide-react";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in cursor-pointer"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden animate-fade-up z-10"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 40px rgba(37, 211, 102, 0.15)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-card)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(37, 211, 102, 0.15)",
                border: "1px solid rgba(37, 211, 102, 0.25)",
              }}
            >
              <Smartphone className="w-4.5 h-4.5" style={{ color: "#25D366" }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Connect WhatsApp
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Link your business number
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80 cursor-pointer pointer-events-auto"
            style={{ background: "var(--bg-pill)", color: "var(--text-muted)" }}
            id="close-whatsapp-modal"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Coming-soon Section (replaces the QR code until the real connection is built) */}
        <div className="px-6 py-6 flex flex-col items-center gap-4">
          {/* Placeholder box, same size and frame as the future QR code */}
          <div
            className="w-[200px] h-[200px] rounded-2xl p-2.5 flex flex-col items-center justify-center gap-3 relative overflow-hidden"
            style={{
              background: "rgba(37, 211, 102, 0.06)",
              boxShadow: "0 0 30px rgba(37, 211, 102, 0.12)",
              border: "2px dashed rgba(37, 211, 102, 0.35)",
            }}
          >
            <Clock className="w-10 h-10" style={{ color: "#25D366" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
              QR code coming soon
            </span>
          </div>

          {/* Headline & Explanation */}
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              WhatsApp connection coming soon
            </p>
            <p className="text-xs text-white/50 leading-relaxed max-w-[320px] mx-auto">
              We&apos;re still building the secure link to WhatsApp. When it&apos;s ready you&apos;ll scan a QR code here to connect your business number.
            </p>
          </div>

          {/* Status Indicator */}
          <div
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full"
            style={{
              background: "var(--bg-pill)",
              border: "1px solid var(--border-pill)",
            }}
          >
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--text-dimmed)" }}></span>
            <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Not connected
            </span>
          </div>

          {/* Close Action Button */}
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-medium border border-white/10 hover:bg-white/[0.08] transition-all cursor-pointer pointer-events-auto text-white/70 hover:text-white"
          >
            Close
          </button>
        </div>

        {/* Footer — Security info */}
        <div
          className="px-6 py-3 flex items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border-card)" }}
        >
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-dimmed)" }} />
            <span className="text-[11px]" style={{ color: "var(--text-dimmed)" }}>
              Nothing is linked yet
            </span>
          </div>
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-dimmed)" }} />
            <span className="text-[11px]" style={{ color: "var(--text-dimmed)" }}>
              No messages are read
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
