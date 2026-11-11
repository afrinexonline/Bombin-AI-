"use client";

import { dealMomentum } from "../lib/mockData";

const deals = dealMomentum;

export default function MomentumTracker() {
  return (
    <div className="glass-card p-5 animate-fade-up delay-3 flex flex-col" id="momentum-tracker">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Live Deal Momentum
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {deals.length} active conversations
          </p>
        </div>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
        </span>
      </div>

      <div className="flex flex-col gap-2 overflow-y-auto max-h-[420px] pr-1 flex-1">
        {deals.map((deal, i) => (
          <div key={i} className="momentum-item">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span className="text-lg" role="img" aria-label="sentiment">
                  {deal.sentiment}
                </span>
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
                <p className="text-[10px]" style={{ color: "var(--text-dimmed)" }}>
                  {deal.lastActive}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="progress-bar flex-1">
                <div
                  className="progress-fill"
                  style={{ width: `${deal.progress}%` }}
                />
              </div>
              <span className="text-[10px] min-w-[60px] text-right" style={{ color: "var(--text-muted)" }}>
                {deal.stage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
