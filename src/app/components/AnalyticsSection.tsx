"use client";

import { useState, useEffect } from "react";
import { BarChart3, PieChart as PieChartIcon } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Period = "weekly" | "monthly" | "yearly";
type ChartView = "area" | "bar";

const weeklyData = [
  { name: "Mon", sales: 4200, deals: 5 },
  { name: "Tue", sales: 3800, deals: 3 },
  { name: "Wed", sales: 6100, deals: 7 },
  { name: "Thu", sales: 5400, deals: 6 },
  { name: "Fri", sales: 7800, deals: 9 },
  { name: "Sat", sales: 3200, deals: 2 },
  { name: "Sun", sales: 2100, deals: 1 },
];

const monthlyData = [
  { name: "Wk 1", sales: 18400, deals: 12 },
  { name: "Wk 2", sales: 24200, deals: 17 },
  { name: "Wk 3", sales: 19800, deals: 14 },
  { name: "Wk 4", sales: 28600, deals: 22 },
];

const yearlyData = [
  { name: "Jan", sales: 42000, deals: 34 },
  { name: "Feb", sales: 38000, deals: 28 },
  { name: "Mar", sales: 51000, deals: 42 },
  { name: "Apr", sales: 48000, deals: 38 },
  { name: "May", sales: 55000, deals: 45 },
  { name: "Jun", sales: 62000, deals: 52 },
  { name: "Jul", sales: 58000, deals: 47 },
  { name: "Aug", sales: 67000, deals: 55 },
  { name: "Sep", sales: 71000, deals: 60 },
  { name: "Oct", sales: 65000, deals: 53 },
  { name: "Nov", sales: 78000, deals: 65 },
  { name: "Dec", sales: 82000, deals: 70 },
];

const doughnutData = [
  { name: "Deals Closed", value: 42, color: "#00C9FF" },
  { name: "Pending", value: 28, color: "#7B2FBE" },
  { name: "Follow-ups", value: 18, color: "#FFB300" },
  { name: "Lost", value: 12, color: "#FF5252" },
];

const dataMap: Record<Period, typeof weeklyData> = {
  weekly: weeklyData,
  monthly: monthlyData,
  yearly: yearlyData,
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="glass-card-static px-3 py-2 text-xs"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-card)" }}
    >
      <p className="font-medium mb-1" style={{ color: "var(--text-primary)" }}>{label}</p>
      <p style={{ color: "#00C9FF" }}>Sales: ${payload[0].value.toLocaleString()}</p>
      {payload[1] && <p style={{ color: "#7B2FBE" }}>Deals: {payload[1].value}</p>}
    </div>
  );
};

export default function AnalyticsSection() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [chartView, setChartView] = useState<ChartView>("area");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-[300px] animate-pulse bg-zinc-900/50 rounded-xl" />;
  }

  const data = dataMap[period];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 animate-fade-up delay-5">
      {/* Main Chart */}
      <div className="lg:col-span-8 glass-card p-5" id="sales-chart">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan/15 to-purple-light/15 flex items-center justify-center"
              style={{ border: "1px solid var(--border-card)" }}
            >
              <BarChart3 className="w-4.5 h-4.5 text-cyan" />
            </div>
            <div>
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Sales Performance
              </h2>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Revenue & deals overview
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Chart View Toggle */}
            <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: "var(--bg-pill)" }}>
              <button
                onClick={() => setChartView("area")}
                className={`pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer px-2 py-1 rounded-md text-[11px] transition-all ${
                  chartView === "area" ? "bg-cyan/15 text-cyan" : ""
                }`}
                style={{ touchAction: "manipulation", ...(chartView !== "area" ? { color: "var(--text-muted)" } : {}) }}
              >
                Area
              </button>
              <button
                onClick={() => setChartView("bar")}
                className={`pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer px-2 py-1 rounded-md text-[11px] transition-all ${
                  chartView === "bar" ? "bg-cyan/15 text-cyan" : ""
                }`}
                style={{ touchAction: "manipulation", ...(chartView !== "bar" ? { color: "var(--text-muted)" } : {}) }}
              >
                Bar
              </button>
            </div>

            {/* Period Tabs */}
            <div className="flex gap-0.5">
              {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`period-tab pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer ${period === p ? "active" : ""}`}
                  style={{ touchAction: "manipulation" }}
                  id={`period-${p}`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="w-full min-w-0 relative h-[300px] min-h-[300px] flex-1"
          style={{ width: "100%", height: "100%" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartView === "area" ? (
              <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C9FF" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#00C9FF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="dealsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B2FBE" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#7B2FBE" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#00C9FF"
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                  animationDuration={800}
                />
                <Area
                  type="monotone"
                  dataKey="deals"
                  stroke="#7B2FBE"
                  strokeWidth={2}
                  fill="url(#dealsGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                <defs>
                  <linearGradient id="barSalesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00C9FF" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#00C9FF" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="barDealsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7B2FBE" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#7B2FBE" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" fill="url(#barSalesGrad)" radius={[4, 4, 0, 0]} animationDuration={800} />
                <Bar dataKey="deals" fill="url(#barDealsGrad)" radius={[4, 4, 0, 0]} animationDuration={1000} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="lg:col-span-4 glass-card p-5" id="closing-categories">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan/15 to-purple-light/15 flex items-center justify-center"
            style={{ border: "1px solid var(--border-card)" }}
          >
            <PieChartIcon className="w-4.5 h-4.5 text-cyan" />
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Closing Categories
            </h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Deal distribution
            </p>
          </div>
        </div>

        <div
          className="w-full min-w-0 relative h-[220px] min-h-[220px] flex-1 mb-4"
          style={{ width: "100%", height: "100%" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={doughnutData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                animationDuration={800}
                stroke="none"
              >
                {doughnutData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [`${value}%`, String(name)]}
                contentStyle={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  backdropFilter: "blur(10px)",
                  color: "var(--text-primary)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5">
          {doughnutData.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {item.name}
                </span>
              </div>
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
