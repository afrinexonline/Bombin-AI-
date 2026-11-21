import { Inbox, type LucideIcon } from "lucide-react";

/**
 * Honest placeholder shown where real data will appear later.
 * Matches the glass style; sits inside an existing card.
 */
export default function EmptyState({
  title = "No data yet",
  message,
  icon: Icon = Inbox,
  className = "",
}: {
  title?: string;
  message?: string;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center gap-2 py-8 px-4 rounded-xl border border-dashed ${className}`}
      style={{ borderColor: "var(--border-card)" }}
    >
      <div
        className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan/10 to-purple-light/10 flex items-center justify-center"
        style={{ border: "1px solid var(--border-card)" }}
      >
        <Icon className="w-5 h-5 text-cyan/70" />
      </div>
      <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        {title}
      </p>
      {message && (
        <p className="text-xs max-w-xs" style={{ color: "var(--text-muted)" }}>
          {message}
        </p>
      )}
    </div>
  );
}
