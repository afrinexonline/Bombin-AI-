import Image from "next/image";
import Link from "next/link";

/*
 * Brand-aura frame for the email screens (Step 3).
 * Glassmorphic card, logo mark with no box, brand cyan #01C4FA and navy #233067 only.
 * Works in dark and light theme and on a phone.
 */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10 bg-black light:bg-[#F4F5F7]">
      {/* Brand aura (decoration only) */}
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[560px] max-w-[140vw] h-[560px] rounded-full bg-[#01C4FA]/20 light:bg-[#01C4FA]/25 blur-[120px]" />
        <div className="absolute -bottom-40 -left-24 w-[460px] h-[460px] rounded-full bg-[#233067]/60 light:bg-[#233067]/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-24 w-[360px] h-[360px] rounded-full bg-[#01C4FA]/10 blur-[110px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer mx-auto mb-6 flex w-fit items-center gap-2"
          aria-label="Bombin AI home"
        >
          <Image src="/logo-mark.png" alt="" width={44} height={44} priority className="drop-shadow-[0_0_14px_rgba(1,196,250,0.45)]" />
          <span className="text-lg font-bold tracking-tight text-white light:text-[#233067]">Bombin AI</span>
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 sm:p-8 shadow-[0_0_40px_rgba(1,196,250,0.08)] backdrop-blur-2xl light:border-[#233067]/10 light:bg-white/70 light:shadow-[0_10px_40px_rgba(35,48,103,0.10)]">
          {children}
        </div>
      </div>
    </main>
  );
}

/* Shared text styles so every email screen looks the same. */
export const authTitle = "text-2xl font-bold text-center text-white light:text-[#233067]";
export const authText = "text-sm leading-relaxed text-center text-white/60 light:text-[#233067]/70";
export const authInput =
  "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-white/25 backdrop-blur-xl transition-colors focus:border-[#01C4FA]/60 focus:outline-none light:border-[#233067]/15 light:bg-white light:text-[#233067] light:placeholder-[#233067]/35";
export const authLink =
  "pointer-events-auto relative z-30 touch-action-manipulation cursor-pointer text-sm font-semibold text-[#01C4FA] hover:underline light:text-[#233067]";
