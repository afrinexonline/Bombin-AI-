"use client";

import { revenueStats } from "../lib/mockData";

const delayClasses = ["delay-1", "delay-2", "delay-3", "delay-4"];

export default function RevenueCard() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {revenueStats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`glass-card p-5 shine-effect liquid-shimmer animate-fade-up ${delayClasses[i]}`}
            id={`stat-${stat.label.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/10 to-purple-light/10 flex items-center justify-center"
                style={{ border: "1px solid var(--border-card)" }}
              >
                <Icon className="w-5 h-5 text-cyan" />
              </div>
              <span className="text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                {stat.change}
              </span>
            </div>
            <p
              className="text-xs mb-1 uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              {stat.label}
            </p>
            <p
              className={`text-3xl font-bold tracking-tight stat-number ${
                stat.label === "Revenue Influenced" ? "glow-number" : ""
              }`}
              style={stat.label !== "Revenue Influenced" ? { color: "var(--text-primary)" } : {}}
            >
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
