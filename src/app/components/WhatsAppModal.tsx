"use client";

import { X, Smartphone, Shield, Wifi } from "lucide-react";
import Image from "next/image";

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

        {/* QR Code Section */}
        <div className="px-6 py-6 flex flex-col items-center gap-4">
          {/* QR Container */}
          <div
            className="w-[200px] h-[200px] rounded-2xl p-2.5 flex items-center justify-center relative overflow-hidden"
            style={{
              background: "white",
              boxShadow: "0 0 30px rgba(37, 211, 102, 0.25), 0 0 60px rgba(37, 211, 102, 0.15)",
              border: "2px solid rgba(37, 211, 102, 0.4)",
            }}
          >
            <Image
              src="/qr-placeholder.png"
              alt="WhatsApp QR Code"
              width={180}
              height={180}
              className="rounded-lg object-contain"
              priority
            />
          </div>

          {/* Headline & Instructions */}
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Scan with WhatsApp to link your business number
            </p>
            <p className="text-xs text-white/50 leading-relaxed max-w-[320px] mx-auto">
              Open WhatsApp &gt; Settings or Menu (⋮) &gt; Linked Devices &gt; Point camera at this QR code.
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
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#25D366" }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#25D366" }}></span>
            </span>
            <span className="text-xs font-medium" style={{ color: "#25D366" }}>
              Ready • Waiting for scan
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
            <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: "#25D366" }} />
            <span className="text-[11px]" style={{ color: "var(--text-dimmed)" }}>
              End-to-end encrypted
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-3.5 h-3.5 shrink-0" style={{ color: "#25D366" }} />
            <span className="text-[11px]" style={{ color: "var(--text-dimmed)" }}>
              Direct TLS connection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
