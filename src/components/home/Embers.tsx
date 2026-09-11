"use client";

import { useEffect, useRef } from "react";

/** Langsam aufsteigende Glutpunkte über dem Hero. Sehr leicht, pausiert ausserhalb des Bilds und bei reduzierter Bewegung. */
export function Embers({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let running = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    type P = { x: number; y: number; r: number; v: number; a: number; w: number; t: number };
    let ps: P[] = [];
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      const n = Math.round((canvas.clientWidth * canvas.clientHeight) / 22000);
      ps = Array.from({ length: Math.min(n, 70) }, () => spawn(true));
    };
    const spawn = (anywhere = false): P => ({
      x: Math.random() * canvas.width,
      y: anywhere ? Math.random() * canvas.height : canvas.height + 10,
      r: (0.6 + Math.random() * 1.6) * dpr,
      v: (0.15 + Math.random() * 0.35) * dpr,
      a: 0.15 + Math.random() * 0.5,
      w: (Math.random() - 0.5) * 0.3 * dpr,
      t: Math.random() * Math.PI * 2,
    });
    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of ps) {
        p.t += 0.01;
        p.y -= p.v;
        p.x += p.w + Math.sin(p.t) * 0.2 * dpr;
        const fade = Math.min(1, (canvas.height - p.y) / (canvas.height * 0.3)) * Math.min(1, p.y / (canvas.height * 0.25));
        ctx.beginPath();
        ctx.fillStyle = `rgba(230, 200, 90, ${p.a * Math.max(0, fade)})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.y < -10) Object.assign(p, spawn());
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting;
      if (running) raf = requestAnimationFrame(tick);
      else cancelAnimationFrame(raf);
    });
    resize();
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
