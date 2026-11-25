"use client";

import { useEffect, useRef, useState } from "react";
import { naira } from "../../lib/pricing";

/** A Naira amount that glides to its new value when it changes (Step 4A). */
export default function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(value);
  const [pulse, setPulse] = useState(false);
  const from = useRef(value);
  const shownRef = useRef(value);

  useEffect(() => {
    const start = shownRef.current;
    if (start === value) return;
    from.current = start;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      shownRef.current = value;
      setShown(value);
      return;
    }
    setPulse(true);
    const t0 = performance.now();
    const D = 450;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / D);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = from.current + (value - from.current) * eased;
      shownRef.current = p < 1 ? v : value;
      setShown(shownRef.current);
      if (p < 1) raf = requestAnimationFrame(step);
      else setPulse(false);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <>
      {/* What screen readers hear: only the final price, once. */}
      <span className="sr-only" aria-live="polite">{naira(value)}</span>
      <span aria-hidden="true" className={`inline-block tabular-nums transition-[text-shadow] duration-300 ${pulse ? "[text-shadow:0_0_18px_rgba(1,196,250,0.55)]" : ""} ${className ?? ""}`}>
        {naira(shown === value ? value : Math.round(shown / 1000) * 1000)}
      </span>
    </>
  );
}
