"use client";

import { CreditCard, Check, Sparkles, Zap } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/mo",
    features: ["500 AI responses/mo", "1 WhatsApp account", "Basic analytics", "Email support"],
    current: false,
    highlight: false,
  },
  {
    name: "Growth",
    price: "$79",
    period: "/mo",
    features: [
      "5,000 AI responses/mo",
      "3 WhatsApp accounts",
      "Advanced analytics",
      "Priority support",
      "Custom AI training",
      "Deal momentum tracking",
    ],
    current: true,
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "/mo",
    features: [
      "Unlimited AI responses",
      "10 WhatsApp accounts",
      "Full analytics suite",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "White-label option",
    ],
    current: false,
    highlight: false,
  },
];

export default function BillingPage() {
  return (
    <>
      {/* Page Header */}
      <div className="flex items-center gap-3 animate-fade-up">
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/15 to-purple-light/15 flex items-center justify-center"
          style={{ border: "1px solid var(--border-card)" }}
        >
          <CreditCard className="w-5 h-5 text-cyan" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Billing & Plans
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Manage your subscription and payment methods
          </p>
        </div>
      </div>

      {/* Current Plan Banner */}
      <div className="glass-card p-5 animate-fade-up delay-1">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan to-purple-light flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Current Plan: <span className="text-cyan">Growth</span>
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Trial ends in 18 hours • Renews at $79/mo
              </p>
            </div>
          </div>
          <button className="glass-pill px-4 py-2 text-xs font-medium transition-all hover:opacity-80" style={{ color: "var(--text-muted)" }}>
            Manage Payment Method
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-up delay-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`glass-card p-6 flex flex-col relative overflow-hidden ${
              plan.highlight ? "ring-1 ring-cyan/30" : ""
            }`}
          >
            {plan.highlight && (
              <div
                className="absolute top-0 right-0 px-3 py-1 text-[10px] font-semibold text-white rounded-bl-lg"
                style={{ background: "linear-gradient(135deg, #00C9FF, #7B2FBE)" }}
              >
                Current Plan
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-0.5">
                <span className="text-3xl font-bold glow-text-sm">{plan.price}</span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {plan.period}
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-2.5 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-success shrink-0" />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                plan.current
                  ? "glass-pill cursor-default"
                  : "btn-gradient hover:scale-[1.02]"
              }`}
              style={plan.current ? { color: "var(--text-muted)" } : {}}
              disabled={plan.current}
            >
              {plan.current ? "Current Plan" : "Upgrade"}
            </button>
          </div>
        ))}
      </div>

      {/* Invoice History */}
      <div className="glass-card p-5 animate-fade-up delay-3">
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          Recent Invoices
        </h3>
        <div className="flex flex-col gap-2">
          {[
            { date: "Apr 30, 2026", amount: "$79.00", status: "Paid" },
            { date: "Mar 30, 2026", amount: "$79.00", status: "Paid" },
            { date: "Feb 28, 2026", amount: "$79.00", status: "Paid" },
          ].map((inv, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 px-4 rounded-xl"
              style={{ background: "var(--bg-momentum)", border: "1px solid var(--border-momentum)" }}
            >
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {inv.date}
              </span>
              <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                {inv.amount}
              </span>
              <span className="text-[10px] text-success bg-success/10 px-2 py-0.5 rounded-full font-medium">
                {inv.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
