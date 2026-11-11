export default function DemoDashboardLoading() {
  return (
    <div className="w-full space-y-5 animate-fade-in py-2">
      {/* Metric Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="glass-card p-5 h-28 flex flex-col justify-between animate-pulse"
          >
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="h-7 w-32 bg-white/15 rounded" />
            <div className="h-2 w-16 bg-white/10 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 glass-card p-6 h-80 flex flex-col items-center justify-center gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-cyan/20 border-t-cyan animate-spin" />
          <span className="text-xs text-white/50 font-medium tracking-wide">
            Loading demo view...
          </span>
        </div>
        <div className="lg:col-span-4 glass-card p-6 h-80 flex flex-col gap-3 animate-pulse">
          <div className="h-4 w-32 bg-white/10 rounded" />
          <div className="flex-1 w-full bg-white/5 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
