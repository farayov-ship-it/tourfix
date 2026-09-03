"use client";

import { useEffect, useState } from "react";

/** Thin “silk thread” progress along the top of the page */
export default function ScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setP(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[2px]"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 shadow-[0_0_10px_color-mix(in_srgb,var(--gold-500)_60%,transparent)] transition-[width] duration-75 ease-out"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}
