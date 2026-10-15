"use client";

import { useState, useRef, useEffect } from "react";
import { Landmark, Loader2, CheckCircle2, ChevronDown } from "lucide-react";
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

const LABEL_CLASSES = "absolute left-4 top-3.5 text-sm transition-all duration-200 transform pointer-events-none origin-left text-[var(--text-muted)] peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-400 peer-focus:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-[-webkit-autofill]:-translate-y-4 peer-[-webkit-autofill]:scale-75 peer-[&:not(:placeholder-shown)]:-translate-y-4 peer-[&:not(:placeholder-shown)]:scale-75";

export default function StepPayoutConfig() {
  const { data, updateField, isBankDropdownOpen: isBankOpen, setBankDropdownOpen: setIsBankOpen } = useOnboarding();

  const [bankSearch, setBankSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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

  // Name Resolution Engine Simulation
  useEffect(() => {
    if (data.bankName && data.accountNumber?.length === 10) {
      setIsVerifying(true);
      setIsVerified(false);
      const timer = setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsVerifying(false);
      setIsVerified(false);
    }
  }, [data.bankName, data.accountNumber]);

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
            maxLength={10}
            value={data.accountNumber || ""}
            onChange={handleAccountChange}
          />
          <label className={LABEL_CLASSES}>Account Number</label>
        </div>
        
        {/* Simulated Name Resolution */}
        {(isVerifying || isVerified) && (
          <div className="absolute right-3 top-[14px] flex items-center gap-2 text-[11px] font-medium animate-fade-in pointer-events-none">
            {isVerifying ? (
              <>
                <Loader2 size={14} className="animate-spin text-purple-400" />
                <span className="text-purple-400">Verifying...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span className="text-emerald-400 max-w-[120px] sm:max-w-[150px] truncate" title={`✓ Account Verified: ${data.userName || data.businessName || "Business Owner"}`}>
                  ✓ Account Verified: {data.userName || data.businessName || "Business Owner"}
                </span>
              </>
            )}
          </div>
        )}
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
          <div className="absolute left-0 w-full z-[200] mt-2 rounded-xl bg-blue-950/60 backdrop-blur-xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] overflow-hidden animate-fade-in">
            <div className="p-2 border-b border-white/5">
              <input 
                type="text" 
                placeholder="Search banks..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                value={bankSearch}
                onChange={(e) => setBankSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-52 overflow-y-auto overscroll-contain">
              {filteredBanks.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">No banks found.</div>
              ) : (
                filteredBanks.map((bank, index) => (
                  <div
                    key={`${bank}-${index}`}
                    className="px-4 py-2.5 text-sm text-slate-100 cursor-pointer hover:bg-blue-500/20 transition-colors"
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
