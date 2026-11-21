/**
 * A "₦" symbol that can be used anywhere a lucide icon is used
 * (same className sizing, e.g. "w-5 h-5 text-cyan").
 */
export default function NairaIcon({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center font-bold leading-none text-[1.1em] ${className}`}
    >
      ₦
    </span>
  );
}
