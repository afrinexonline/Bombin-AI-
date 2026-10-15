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
      <div className="bg-ambient" />

      {/* Centered Container */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
