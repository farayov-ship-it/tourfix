"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function HeroBackground() {
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || window.innerWidth < 768) return;
    const timer = setTimeout(() => setShow3d(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // No big yellow orb — empty when WebGL off (photo + UI carry the look)
  if (!show3d) return null;

  return <HeroCanvas />;
}
