import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import MobileNav from "../components/MobileNav";
import FAB from "../components/FAB";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function DemoDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative" style={{ background: "var(--bg-body)" }}>
      {/* Ambient Background */}
      <div className="bg-ambient pointer-events-none z-0" />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="relative z-10 lg:pl-[72px] pb-20 lg:pb-6">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="px-4 sm:px-6 space-y-5">
          {/* Interactive Demo Floating Notice */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-cyan/20 bg-gradient-to-r from-cyan/10 via-purple-500/10 to-transparent backdrop-blur-xl shadow-[0_0_20px_rgba(0,201,255,0.08)]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan"></span>
              </span>
              <span className="text-xs font-bold tracking-wider uppercase text-cyan flex items-center gap-1.5">
                <Sparkles size={13} className="text-cyan" /> Interactive Demo Mode
              </span>
              <span className="text-xs text-white/50 hidden md:inline">
                — Explore real-time analytics, AI closer simulator, and live catalog controls with zero setup.
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Link
                href="/"
                className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium text-white/60 hover:text-white border border-white/10 hover:bg-white/[0.06] transition-all flex items-center gap-1.5"
              >
                <ArrowLeft size={13} /> Back to Home
              </Link>
              <Link
                href="/onboarding"
                className="btn-gradient pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer px-4 py-1.5 rounded-lg text-xs font-bold text-white hover:scale-105 transition-all shadow-[0_0_12px_rgba(0,201,255,0.3)]"
              >
                Start Onboarding
              </Link>
            </div>
          </div>

          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Mobile FAB for Hybrid AI Assistant */}
      <FAB />
    </div>
  );
}
