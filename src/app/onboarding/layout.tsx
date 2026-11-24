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

      {/* Log out (Step 3E): small link in its own row, asks first. Always reachable during setup. */}
      <div className="relative z-30 max-w-2xl mx-auto flex justify-end px-3 pt-3">
        <LogOutButton variant="link" />
      </div>

      {/* Centered Container */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-2 pb-8 min-h-[calc(100vh-3.25rem)] flex flex-col items-center justify-center">
        <OnboardingGuard>{children}</OnboardingGuard>
      </div>
    </div>
  );
}
