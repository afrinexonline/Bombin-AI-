"use client";

import { X, Smartphone, Shield, Wifi, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, onClose }: WhatsAppModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQrCode = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setQrCode(null);
    try {
      const response = await fetch('/api/whatsapp/connect', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok && data.qrCodeString) {
        setQrCode(data.qrCodeString);
      } else {
        setError(data.error || 'Failed to fetch QR Code');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchQrCode();
    }
  }, [isOpen, fetchQrCode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden animate-fade-up"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.4), 0 0 40px rgba(37, 211, 102, 0.1)",
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
                Link your business account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
            style={{ background: "var(--bg-pill)", color: "var(--text-muted)" }}
            id="close-whatsapp-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Section */}
        <div className="px-6 py-8 flex flex-col items-center gap-5">
          {/* QR Container with glowing effect */}
          <div
            className="w-[220px] h-[220px] rounded-2xl p-3 flex items-center justify-center relative overflow-hidden"
            style={{
              background: "white",
              boxShadow: "0 0 30px rgba(37, 211, 102, 0.2), 0 0 60px rgba(37, 211, 102, 0.15)",
              border: "2px solid rgba(37, 211, 102, 0.4)",
            }}
          >
            {isLoading || (!qrCode && !error) ? (
              <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center">
                <div className="w-full h-full bg-gradient-to-tr from-gray-200 via-gray-100 to-gray-200 animate-pulse flex flex-col items-center justify-center gap-3">
                   <div className="w-10 h-10 border-4 border-[#25D366]/30 border-t-[#25D366] rounded-full animate-spin"></div>
                   <p className="text-xs text-gray-500 font-medium text-center px-4">Generating secure token link...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center text-center gap-3 p-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <p className="text-xs text-red-500 font-medium">{error}</p>
                <button 
                  onClick={fetchQrCode}
                  className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Retry
                </button>
              </div>
            ) : qrCode ? (
              <Image
                src={qrCode.startsWith('data:') ? qrCode : `data:image/png;base64,${qrCode}`}
                alt="WhatsApp QR Code"
                width={196}
                height={196}
                className="rounded-lg"
                priority
              />
            ) : null}
          </div>

          {/* Scan Instructions */}
          <div className="text-center mt-2">
            <p className="text-sm leading-relaxed max-w-[300px] mx-auto font-medium" style={{ color: "var(--text-primary)" }}>
              Open WhatsApp on your phone &gt; Tap Menu or Settings &gt; Linked Devices &gt; Scan this QR Code to activate your Bombin AI Employee.
            </p>
          </div>

          {/* Status indicator */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full mt-1"
            style={{
              background: "var(--bg-pill)",
              border: "1px solid var(--border-pill)",
            }}
          >
            {isLoading ? (
               <span className="text-xs" style={{ color: "var(--text-muted)" }}>Connecting to Evolution API...</span>
            ) : error ? (
               <span className="text-xs text-red-500 font-medium">Connection Failed</span>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#25D366" }}></span>
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#25D366" }}></span>
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Waiting for scan...
                </span>
              </>
            )}
          </div>
        </div>

        {/* Footer — Security info */}
        <div
          className="px-6 py-4 flex items-center gap-4"
          style={{ borderTop: "1px solid var(--border-card)" }}
        >
          <div className="flex items-center gap-2 flex-1">
            <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: "#25D366" }} />
            <span className="text-[11px]" style={{ color: "var(--text-dimmed)" }}>
              End-to-end encrypted
            </span>
          </div>
          <div className="flex items-center gap-2 flex-1">
            <Wifi className="w-3.5 h-3.5 shrink-0" style={{ color: "#25D366" }} />
            <span className="text-[11px]" style={{ color: "var(--text-dimmed)" }}>
              Secure connection
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
