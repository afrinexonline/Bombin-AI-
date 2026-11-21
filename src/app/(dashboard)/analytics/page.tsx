import AnalyticsSection from "../../components/AnalyticsSection";
import { BarChart3 } from "lucide-react";
import { analyticsSummary } from "../../lib/dashboardData";

export const metadata = {
  title: "Analytics — BOMBIN AI",
};

export default function AnalyticsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="flex items-center gap-3 animate-fade-up">
        <div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/15 to-purple-light/15 flex items-center justify-center"
          style={{ border: "1px solid var(--border-card)" }}
        >
          <BarChart3 className="w-5 h-5 text-cyan" />
        </div>
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            Sales Analytics
          </h2>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Performance metrics and closing insights
          </p>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-up delay-1">
        {analyticsSummary.map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
            {stat.value ? (
              <p className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                {stat.value}
              </p>
            ) : (
              <p className="text-sm font-medium pt-1" style={{ color: "var(--text-dimmed)" }}>
                No data yet
              </p>
            )}
            {stat.change && <span className="text-xs text-success">{stat.change}</span>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <AnalyticsSection />
    </>
  );
}
