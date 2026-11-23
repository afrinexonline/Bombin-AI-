import Image from "next/image";

/*
 * Full-screen branded loader (Step 3C): just the logo mark with a soft cyan pulse.
 * Used while an email link is being checked, so nothing else (like the landing page)
 * ever flashes on screen. Dark and light theme, phone-friendly.
 */
export default function BrandLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[200] overflow-hidden flex items-center justify-center bg-black light:bg-[#F4F5F7]"
    >
      {/* Soft aura (decoration only) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] max-w-[120vw] h-[420px] rounded-full bg-[#01C4FA]/15 light:bg-[#01C4FA]/20 blur-[110px]" />
        <div className="absolute -bottom-40 -left-24 w-[380px] h-[380px] rounded-full bg-[#233067]/50 light:bg-[#233067]/15 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span className="pointer-events-none absolute inset-0 rounded-full border border-[#01C4FA]/40 animate-ping [animation-duration:2.2s]" aria-hidden="true" />
          <span className="pointer-events-none absolute inset-3 rounded-full bg-[#01C4FA]/10 blur-md animate-pulse" aria-hidden="true" />
          <Image
            src="/logo-mark.png"
            alt=""
            width={64}
            height={64}
            priority
            className="relative animate-pulse [animation-duration:2.2s] drop-shadow-[0_0_18px_rgba(1,196,250,0.55)]"
          />
        </div>
        <p className="text-sm font-medium tracking-wide text-white/60 light:text-[#233067]/70">{label}</p>
      </div>
    </div>
  );
}
