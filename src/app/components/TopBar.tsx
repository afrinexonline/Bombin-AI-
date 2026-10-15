"use client";

import { MessageCircle, Clock, Sun, Moon, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import WhatsAppModal from "./WhatsAppModal";
import Image from "next/image";
import { useOnboarding } from "../context/OnboardingContext";

export default function TopBar() {
  const [timeLeft, setTimeLeft] = useState(67321); // seconds (~18:42:01)
  const [showModal, setShowModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { data, updateField } = useOnboarding();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync connected state from context on mount
  useEffect(() => {
    setIsConnected(data.whatsappConnected);
  }, [data.whatsappConnected]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup auto-connect timeout on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleConnectClick = () => {
    if (isConnected) return;
    setShowModal(true);
    timerRef.current = setTimeout(() => {
      setShowModal(false);
      setIsConnected(true);
      updateField("whatsappConnected", true);
    }, 4000);
  };

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const formatted = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <>
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 lg:pl-[96px]">
        {/* Left — Title & Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Image
            src="/bombinai-logo.png"
            alt="BOMBIN AI Logo"
            width={44}
            height={44}
            className="h-10 w-auto object-contain drop-shadow-[0_0_12px_rgba(0,201,255,0.25)]"
            style={{ background: 'transparent', mixBlendMode: 'plus-lighter' }}
            quality={100}
            priority
          />
          <div>
            <h1 className="text-lg font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Dashboard
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              Welcome back — your AI is warmed up
            </p>
          </div>
        </div>

        {/* Right — Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            id="theme-toggle"
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className="theme-toggle-knob">
              {theme === "dark" ? (
                <Moon className="w-3 h-3 text-white" />
              ) : (
                <Sun className="w-3 h-3 text-white" />
              )}
            </div>
          </button>

          {/* Trial Status Pill */}
          <div className="glass-pill px-3 sm:px-4 py-2 flex items-center gap-2 text-sm" id="trial-status">
            <Clock className="w-3.5 h-3.5 text-cyan" />
            <span className="text-xs hidden sm:inline" style={{ color: "var(--text-muted)" }}>Trial</span>
            <span className="font-mono text-sm font-medium glow-text-sm">
              {formatted}
            </span>
            <span className="text-xs hidden sm:inline" style={{ color: "var(--text-dimmed)" }}>remaining</span>
          </div>

          {/* Connect WhatsApp Button / Connected Badge */}
          {isConnected ? (
            <div
              className="connected-badge px-4 py-2.5 flex items-center gap-2 text-sm"
              id="connect-whatsapp"
            >
              <Check className="w-4 h-4" />
              <span>✓ Connected</span>
            </div>
          ) : (
            <button
              onClick={handleConnectClick}
              className="flex items-center gap-2 text-sm whitespace-nowrap px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-[1.02]"
              id="connect-whatsapp"
              style={{
                background: "rgba(37, 211, 102, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(37, 211, 102, 0.4)",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 0 20px rgba(37, 211, 102, 0.2), 0 0 40px rgba(37, 211, 102, 0.1)",
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect WhatsApp</span>
            </button>
          )}
        </div>
      </header>

      {/* WhatsApp QR Modal */}
      <WhatsAppModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
