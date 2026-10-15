"use client";

import { Zap, ArrowUpRight, ArrowDownRight, Clock, Filter } from "lucide-react";
import { dealMomentum } from "../../lib/mockData";

export default function MomentumPage() {
  const totalValue = dealMomentum.reduce((sum, d) => {
    const num = parseFloat(d.value.replace(/[$,]/g, ""));
    return sum + num;
  }, 0);

  const hotDeals = dealMomentum.filter((d) => d.sentiment === "🔥").length;
  const coldDeals = dealMomentum.filter((d) => d.sentiment === "❄️").length;

  return (
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between animate-fade-up">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/15 to-purple-light/15 flex items-center justify-center"
            style={{ border: "1px solid var(--border-card)" }}
          >
            <Zap className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Deal Momentum
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {dealMomentum.length} active conversations in pipeline
            </p>
          </div>
        </div>
        <button
          className="glass-pill px-4 py-2 flex items-center gap-2 text-xs transition-all hover:opacity-80"
          style={{ color: "var(--text-muted)" }}
        >
          <Filter className="w-3.5 h-3.5" /> Filters
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up delay-1">
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Pipeline Value
          </p>
          <p className="text-2xl font-bold glow-number">
            ${totalValue.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 text-success" />
            <span className="text-xs text-success">+18.3% vs last week</span>
          </div>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Hot Deals
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {hotDeals} 🔥
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 text-success" />
            <span className="text-xs text-success">Ready to close</span>
          </div>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
            Cold Deals
          </p>
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {coldDeals} ❄️
          </p>
          <div className="flex items-center gap-1 mt-2">
            <ArrowDownRight className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs text-warning">Needs attention</span>
          </div>
        </div>
      </div>

      {/* Full Deal List */}
      <div className="glass-card p-5 animate-fade-up delay-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            All Active Deals
          </h3>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
          </span>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px] pr-1">
          {dealMomentum.map((deal, i) => (
            <div key={i} className="momentum-item">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{deal.sentiment}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {deal.name}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--text-dimmed)" }}>
                      {deal.company}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                    {deal.value}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    <Clock className="w-2.5 h-2.5" style={{ color: "var(--text-dimmed)" }} />
                    <p className="text-[10px]" style={{ color: "var(--text-dimmed)" }}>
                      {deal.lastActive}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="progress-bar flex-1">
                  <div className="progress-fill" style={{ width: `${deal.progress}%` }} />
                </div>
                <span className="text-[10px] min-w-[80px] text-right" style={{ color: "var(--text-muted)" }}>
                  {deal.stage}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
