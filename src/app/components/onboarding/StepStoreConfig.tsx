"use client";

import { Store } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingContext";

/* ═══════════════════════════════════════════════════
   Step 1 — Store Configuration
   Business details & location
   ═══════════════════════════════════════════════════ */

const INDUSTRIES = [
  "Interior Design & Furniture",
  "Fashion & Clothing",
  "Electronics & Gadgets",
  "Food & Catering",
  "Real Estate",
  "Consulting & Services",
  "Beauty & Cosmetics",
  "Other",
];

const LABEL_CLASSES = "absolute left-4 top-3.5 text-sm transition-all duration-200 transform pointer-events-none origin-left text-[var(--text-muted)] peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-400 peer-focus:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-[-webkit-autofill]:-translate-y-4 peer-[-webkit-autofill]:scale-75 peer-[&:not(:placeholder-shown)]:-translate-y-4 peer-[&:not(:placeholder-shown)]:scale-75";

export default function StepStoreConfig() {
  const { data, updateField } = useOnboarding();

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "rgba(0, 201, 255, 0.1)",
            border: "1px solid rgba(0, 201, 255, 0.15)",
          }}
        >
          <Store size={18} className="text-cyan" />
        </div>
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Tell us about your business
          </h2>
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            This helps your AI understand your brand
          </p>
        </div>
      </div>

      {/* User Name (Split into First and Last) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative mb-6">
          <input
            type="text"
            required
            className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
            placeholder=" "
            value={data.firstName || ""}
            onChange={(e) => updateField("firstName", e.target.value)}
          />
          <label className={LABEL_CLASSES}>First Name</label>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            required
            className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
            placeholder=" "
            value={data.lastName || ""}
            onChange={(e) => updateField("lastName", e.target.value)}
          />
          <label className={LABEL_CLASSES}>Last Name</label>
        </div>
      </div>

      {/* Business Name */}
      <div className="relative mb-6">
        <input
          type="text"
          required
          className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
          placeholder=" "
          value={data.businessName || ""}
          onChange={(e) => updateField("businessName", e.target.value)}
        />
        <label className={LABEL_CLASSES}>Business Name</label>
      </div>

      {/* Business Email Address & Phone Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative mb-6">
          <input
            type="email"
            required
            className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
            placeholder=" "
            value={data.email || ""}
            onChange={(e) => updateField("email", e.target.value)}
          />
          <label className={LABEL_CLASSES}>Business Email Address</label>
        </div>
        <div className="relative mb-6">
          <input
            type="tel"
            required
            className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
            placeholder=" "
            value={data.phone || ""}
            onChange={(e) => updateField("phone", e.target.value)}
          />
          <label className={LABEL_CLASSES}>Phone Number</label>
        </div>
      </div>

      {/* Industry Type Dropdown */}
      <div className="space-y-3 relative mb-6">
        <div>
          <label
            className="block text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: "var(--text-muted)" }}
          >
            Industry Type
          </label>
          <select
            className="glass-select w-full px-4 py-3 text-sm"
            value={data.industryType || ""}
            onChange={(e) => updateField("industryType", e.target.value)}
          >
            <option value="" disabled>
              Select your industry
            </option>
            {INDUSTRIES.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Industry Input (explanation) */}
        {data.industryType === "Other" && (
          <div className="relative mb-6 animate-fade-in mt-4">
            <input
              type="text"
              required
              className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
              placeholder=" "
              value={data.customIndustry || ""}
              onChange={(e) => updateField("customIndustry", e.target.value)}
            />
            <label className={LABEL_CLASSES}>Please explain your industry</label>
          </div>
        )}
      </div>

      {/* Website URL (Optional) */}
      <div className="relative mb-6">
        <input
          type="url"
          className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
          placeholder=" "
          value={data.website || ""}
          onChange={(e) => updateField("website", e.target.value)}
        />
        <label className={LABEL_CLASSES}>Website URL (Optional)</label>
      </div>

      {/* Location */}
      <div className="relative mb-6">
        <input
          type="text"
          required
          className="peer glass-input w-full px-4 pt-[18px] pb-[8px] text-sm"
          placeholder=" "
          value={data.city || ""}
          onChange={(e) => updateField("city", e.target.value)}
        />
        <label className={LABEL_CLASSES}>Location</label>
        <p
          className="absolute -bottom-5 left-1 text-[10px]"
          style={{ color: "var(--text-dimmed)" }}
        >
          e.g. Port Harcourt, Lagos, Abuja
        </p>
      </div>
    </div>
  );
}
