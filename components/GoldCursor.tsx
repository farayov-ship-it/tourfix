"use client";

import { useEffect, useRef } from "react";

type TrailPoint = { x: number; y: number; life: number };

/**
 * Tourism-style gold cursor trail — desktop only, respects reduced motion.
 */
export default function GoldCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const trail = useRef<TrailPoint[]>([]);
  const raf = useRef(0);
  const visible = useRef(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    document.documentElement.classList.add("gold-cursor-on");

    const canvas = canvasRef.current;
    const dot = dotRef.current;
    if (!canvas || !dot) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth * Math.min(window.devicePixelRatio, 2);
      canvas.height = window.innerHeight * Math.min(window.devicePixelRatio, 2);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(Math.min(window.devicePixelRatio, 2), 0, 0, Math.min(window.devicePixelRatio, 2), 0, 0);
    };
    resize();

    const onMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      visible.current = true;
      trail.current.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (trail.current.length > 28) trail.current.shift();
    };

    const onLeave = () => {
      visible.current = false;
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Fade trail
      const trailRgb =
        getComputedStyle(document.documentElement).getPropertyValue("--cursor-trail").trim() ||
        "212, 168, 83";

      for (let i = 0; i < trail.current.length; i++) {
        const p = trail.current[i];
        p.life *= 0.92;
        const t = i / trail.current.length;
        const r = 2 + t * 5;
        const alpha = p.life * 0.45 * t;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        g.addColorStop(0, `rgba(${trailRgb}, ${alpha})`);
        g.addColorStop(0.4, `rgba(${trailRgb}, ${alpha * 0.5})`);
        g.addColorStop(1, `rgba(${trailRgb}, 0)`);
        ctx.beginPath();
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      trail.current = trail.current.filter((p) => p.life > 0.04);

      // Soft cursor glow
      if (visible.current) {
        const { x, y } = pos.current;
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        dot.style.opacity = "1";

        const glow = ctx.createRadialGradient(x, y, 0, x, y, 18);
        glow.addColorStop(0, `rgba(${trailRgb}, 0.35)`);
        glow.addColorStop(1, `rgba(${trailRgb}, 0)`);
        ctx.beginPath();
        ctx.fillStyle = glow;
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fill();
      } else {
        dot.style.opacity = "0";
      }

      raf.current = requestAnimationFrame(draw);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);
    raf.current = requestAnimationFrame(draw);

    return () => {
      document.documentElement.classList.remove("gold-cursor-on");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9998] hidden md:block"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-3 w-3 rounded-full bg-gold-400 opacity-0 shadow-[0_0_12px_rgba(212,168,83,0.8)] mix-blend-screen transition-opacity duration-200 md:block"
        style={{ transform: "translate(-100px, -100px)" }}
      />
    </>
  );
}
