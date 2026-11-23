import OnboardingGuard from "../components/OnboardingGuard";
import LogOutButton from "../components/auth/LogOutButton";

/* ═══════════════════════════════════════════════════
   BOMBIN AI — Onboarding Layout
   Minimal full-screen centered layout for the wizard
   ═══════════════════════════════════════════════════ */

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="bg-ambient pointer-events-none z-0" />

      {/* Log out (Step 3D): always reachable, even halfway through setup */}
      <div className="absolute top-4 right-4 z-30">
        <LogOutButton variant="topbar" />
      </div>

      {/* Centered Container */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        <OnboardingGuard>{children}</OnboardingGuard>
      </div>
    </div>
  );
}
