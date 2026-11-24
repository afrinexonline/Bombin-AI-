"use client";

import { useState, useRef, useEffect } from "react";
import { Landmark, ChevronDown, Info } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

/* ═══════════════════════════════════════════════════
   Step 3 — Payout & Financial Routing
   Bank details and payment method preferences
   ═══════════════════════════════════════════════════ */

const BANKS = [
  "Other Bank", "Access Bank", "Carbon", "Citibank", "EcoBank", "Eyowo Bank", "FairMoney MFB", "Fidelity Bank", 
  "First Bank of Nigeria (FBN)", "First City Monument Bank (FCMB)", "Globus Bank", "Guaranty Trust Bank (GTB)", 
  "Jaiz Bank", "Keystone Bank", "Kuda Bank", "Moniepoint MFB", "OPay", "Optimus Bank", "PalmPay", 
  "Parallex Bank", "Polaris Bank", "PremiumTrust Bank", "Providus Bank", "Rubies MFB", "Signature Bank", 
  "Stanbic IBTC Bank", "Standard Chartered Bank", "Sterling Bank", "SunTrust Bank", "TAJBank", 
  "Titan Trust Bank", "Union Bank", "United Bank for Africa (UBA)", "Unity Bank", 
  "VFD Microfinance Bank (Vbank)", "Wema Bank", "Zenith Bank", "Other Bank"
];

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "card_payment", label: "Card Payment" },
  { value: "payment_link", label: "Payment Link" }
];

const LABEL_CLASSES = "absolute left-4 top-3.5 text-sm transition-all duration-200 transform pointer-events-none origin-left text-[var(--text-muted)] peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-[#01C4FA] peer-focus:drop-shadow-[0_0_8px_rgba(1,196,250,0.6)] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-[-webkit-autofill]:-translate-y-4 peer-[-webkit-autofill]:scale-75 peer-[&:not(:placeholder-shown)]:-translate-y-4 peer-[&:not(:placeholder-shown)]:scale-75";

export default function StepPayoutConfig() {
  const { data, updateField, isBankDropdownOpen: isBankOpen, setBankDropdownOpen: setIsBankOpen } = useOnboarding();

  const [bankSearch, setBankSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBankOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePaymentMethod = (method: string) => {
    const current = data.paymentMethods || [];
    const updated = current.includes(method)
      ? current.filter((m) => m !== method)
      : [...current, method];
    updateField("paymentMethods", updated);
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 10-Digit NUBAN Ingress & Paste Sanitizer
    let sanitized = e.target.value.replace(/\D/g, "");
    if (sanitized.length > 10) {
      sanitized = sanitized.slice(0, 10);
    }
    updateField("accountNumber", sanitized);
  };

  const filteredBanks = BANKS.filter((b) => 
    b.toLowerCase().includes(bankSearch.toLowerCase())
  );

  return (
    <div className="overflow-visible h-full space-y-6 pb-12 pr-2">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(0, 230, 118, 0.1)",
            border: "1px solid rgba(0, 230, 118, 0.15)",
          }}
        >
          <Landmark size={18} className="text-success" />
        </div>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Set up your payout details
          </h2>
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Where should we route your revenue?
          </p>
        </div>
      </div>

      {/* Account Name */}
      <div className="relative mb-6">
        <input
          type="text"
          className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
          placeholder=" "
          name="accountName"
          data-field="accountName"
          autoComplete="name"
          value={data.accountName || ""}
          onChange={(e) => updateField("accountName", e.target.value)}
        />
        <label className={LABEL_CLASSES}>Account Name</label>
      </div>

      {/* Account Number */}
      <div className="relative mb-6">
        <div className="relative">
          <input
            type="tel"
            className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
            placeholder=" "
            name="accountNumber"
            data-field="accountNumber"
            inputMode="numeric"
            autoComplete="off"
            value={data.accountNumber || ""}
            onChange={handleAccountChange}
          />
          <label className={LABEL_CLASSES}>Account Number</label>
        </div>
        
        {/* Honest note: there is no real bank check yet */}
        <p className="flex items-start gap-1.5 mt-2 text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
          <Info size={13} className="shrink-0 mt-[1px] text-blue-400" />
          We save your account name and number exactly as you type them. Checking them with your bank is coming later, so please double-check they are correct.
        </p>
      </div>

      {/* Bank Selection */}
      <div className="space-y-3 relative z-[200] mb-6" ref={dropdownRef}>
        <label
          className="block text-xs font-medium uppercase tracking-wider mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          Bank
        </label>
        <div 
          className="glass-input w-full px-4 py-3 text-sm cursor-pointer flex justify-between items-center"
          onClick={() => setIsBankOpen(!isBankOpen)}
        >
          <span className={data.bankName ? "text-white" : "text-gray-400"}>
            {data.bankName || "Select your bank"}
          </span>
          <ChevronDown size={16} className={`transition-transform text-gray-400 ${isBankOpen ? "rotate-180" : ""}`} />
        </div>

        {isBankOpen && (
          <div className="absolute left-0 w-full z-[200] mt-2 rounded-xl bg-gradient-to-b from-[#1b2856]/[0.86] via-[#233067]/[0.82] to-[#0d4f73]/[0.8] backdrop-blur-2xl backdrop-saturate-150 border border-[#01C4FA]/40 shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_24px_rgba(1,196,250,0.22),inset_0_1px_0_rgba(255,255,255,0.08)] overflow-hidden animate-fade-in light:from-white/[0.88] light:via-white/[0.85] light:to-[#e3f7fe]/[0.85] light:border-[#01C4FA]/45 light:shadow-[0_12px_40px_rgba(35,48,103,0.18),0_0_20px_rgba(1,196,250,0.18)]">
            <div className="p-2 border-b border-white/5 light:border-[#233067]/10">
              <input 
                type="text" 
                placeholder="Search banks..." 
                className="w-full bg-black/25 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#01C4FA]/50 light:bg-white/70 light:border-[#233067]/15 light:text-[#233067] light:placeholder-[#233067]/40"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-52 overflow-y-auto overscroll-contain">
              {filteredBanks.length === 0 ? (
                <div className="px-4 py-3 text-sm text-white/70 text-center light:text-[#233067]/70">No banks found.</div>
              ) : (
                filteredBanks.map((bank, index) => (
                  <div
                    key={`${bank}-${index}`}
                    className="px-4 py-2.5 text-sm font-medium text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.6)] cursor-pointer hover:bg-[#01C4FA]/20 transition-colors light:text-[#233067] light:[text-shadow:0_1px_4px_rgba(255,255,255,0.9)]"
                    onClick={() => {
                      updateField("bankName", bank);
                      setIsBankOpen(false);
                      setBankSearch(""); // reset search
                    }}
                  >
                    {bank}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Conditional Bank Preference */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${data.bankName === "Other Bank" ? "max-h-28 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
          <div className="relative mb-6 mt-2">
            <input
              type="text"
              required={data.bankName === "Other Bank"}
              className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
              placeholder=" "
              name="customBank"
              data-field="customBank"
              value={data.customBank || ""}
              onChange={(e) => updateField("customBank", e.target.value)}
            />
            <label className={LABEL_CLASSES}>Type your bank name</label>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <label
          className="block text-xs font-medium uppercase tracking-wider mb-3"
          style={{ color: "var(--text-muted)" }}
        >
          Preferred Payment Methods
        </label>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="glass-checkbox"
                checked={(data.paymentMethods || []).includes(method.value)}
                onChange={() => togglePaymentMethod(method.value)}
              />
              <span
                className="text-sm group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-secondary)" }}
              >
                {method.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
