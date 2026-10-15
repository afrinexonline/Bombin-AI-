"use client";

import { User, Building2, MapPin, Mail, CreditCard, Landmark, Mic, Shield, Edit3 } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

const toneLabels: Record<string, string> = {
  corporate: "🏢 Professional Corporate",
  friendly: "🤝 Warm & Friendly",
  pidgin: "🔥 Street / Pidgin",
};

export default function ProfilePage() {
  const { data } = useOnboarding();

  const initials = data.userName
    ? data.userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "BA";

  const maskedAccount = data.accountNumber
    ? "****" + data.accountNumber.slice(-4)
    : null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="animate-fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(0,201,255,0.15), rgba(123,47,190,0.15))",
              border: "1px solid rgba(0,201,255,0.2)",
            }}
          >
            <User className="w-4.5 h-4.5 text-cyan" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
              Vendor Profile
            </h1>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Your complete business configuration
            </p>
          </div>
        </div>
      </div>

      {/* Avatar + Name Hero */}
      <div className="animate-fade-up delay-1 flex flex-col items-center gap-3 py-6">
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-2xl font-bold tracking-wide"
          style={{
            background: "linear-gradient(135deg, #00C9FF, #7B2FBE)",
            color: "white",
            boxShadow: "0 0 30px rgba(0,201,255,0.25), 0 0 60px rgba(123,47,190,0.15)",
          }}
        >
          {initials}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            {data.userName || "Bombin Vendor"}
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {data.businessName || "Business not configured"}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Business Info Card */}
        <div className="glass-card p-6 rounded-2xl relative animate-fade-up delay-2">
          <button
            className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
            style={{ background: "var(--bg-pill)", color: "var(--text-dimmed)" }}
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-4 h-4 text-cyan" />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Business Info
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-dimmed)" }}>
                Industry Type
              </p>
              <p className="text-sm font-medium" style={{ color: data.industryType ? "var(--text-secondary)" : "var(--text-dimmed)" }}>
                {data.industryType || "Not configured"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-dimmed)" }}>
                City Location
              </p>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm font-medium" style={{ color: data.city ? "var(--text-secondary)" : "var(--text-dimmed)" }}>
                  {data.city || "Not configured"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Settings Card */}
        <div className="glass-card p-6 rounded-2xl relative animate-fade-up delay-3">
          <button
            className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
            style={{ background: "var(--bg-pill)", color: "var(--text-dimmed)" }}
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-5">
            <Mic className="w-4 h-4 text-purple-light" />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Voice Settings
            </h3>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-dimmed)" }}>
              Tone Preference
            </p>
            <p className="text-sm font-medium" style={{ color: data.tonePreference ? "var(--text-secondary)" : "var(--text-dimmed)" }}>
              {data.tonePreference ? toneLabels[data.tonePreference] || data.tonePreference : "Not configured"}
            </p>
          </div>
        </div>

        {/* Financial Details Card */}
        <div className="glass-card p-6 rounded-2xl relative animate-fade-up delay-4">
          <button
            className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
            style={{ background: "var(--bg-pill)", color: "var(--text-dimmed)" }}
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-5">
            <Landmark className="w-4 h-4 text-success" />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Financial Details
            </h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-dimmed)" }}>
                Bank Name
              </p>
              <p className="text-sm font-medium" style={{ color: data.bankName ? "var(--text-secondary)" : "var(--text-dimmed)" }}>
                {data.bankName || "Not configured"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-dimmed)" }}>
                Account Name
              </p>
              <p className="text-sm font-medium" style={{ color: data.accountName ? "var(--text-secondary)" : "var(--text-dimmed)" }}>
                {data.accountName || "Not configured"}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-dimmed)" }}>
                Account Number
              </p>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm font-medium font-mono" style={{ color: maskedAccount ? "var(--text-secondary)" : "var(--text-dimmed)" }}>
                  {maskedAccount || "Not configured"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-dimmed)" }}>
                Payment Methods
              </p>
              {data.paymentMethods.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.paymentMethods.map((method) => (
                    <span
                      key={method}
                      className="glass-pill px-3 py-1 text-[11px] font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {method}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-dimmed)" }}>Not configured</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Card */}
        <div className="glass-card p-6 rounded-2xl relative animate-fade-up delay-5">
          <button
            className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
            style={{ background: "var(--bg-pill)", color: "var(--text-dimmed)" }}
            title="Edit"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-5">
            <Mail className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Contact
            </h3>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider mb-1" style={{ color: "var(--text-dimmed)" }}>
              Email Address
            </p>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm font-medium" style={{ color: data.email ? "var(--text-secondary)" : "var(--text-dimmed)" }}>
                {data.email || "Not configured"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
