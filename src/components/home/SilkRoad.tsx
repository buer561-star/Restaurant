"use client";

import { useEffect, useRef } from "react";

type Stop = { key: string; label: string; uy: string; x: number; y: number };

/** Die Route von Kaşgar nach Winterthur als gezeichnete Linie. Zeichnet sich, sobald sie ins Bild kommt. */
export function SilkRoad({ stops, distance }: { stops: Stop[]; distance: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const path = svg.querySelector<SVGPathElement>("path[data-route]");
    if (!path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { path.style.strokeDashoffset = "0"; return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        path.style.transition = "stroke-dashoffset 2600ms cubic-bezier(.4,0,.2,1)";
        path.style.strokeDashoffset = "0";
        svg.querySelectorAll<SVGGElement>("g[data-stop]").forEach((g, i) => {
          g.style.transition = `opacity 600ms ease ${500 + i * 500}ms, transform 600ms ease ${500 + i * 500}ms`;
          g.style.opacity = "1"; g.style.transform = "translateY(0)";
        });
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  // Route: von rechts (Kaşgar) nach links (Winterthur), wie auf der Karte
  const d = stops.map((s, i) => (i === 0 ? `M ${s.x} ${s.y}` : `C ${stops[i - 1].x - 60} ${stops[i - 1].y - 40}, ${s.x + 60} ${s.y + 40}, ${s.x} ${s.y}`)).join(" ");

  return (
    <svg ref={ref} viewBox="0 0 1000 260" className="h-auto w-full" role="img" aria-label={stops.map((s) => s.label).join(" – ")}>
      <path d={d} data-route fill="none" stroke="var(--color-gold)" strokeWidth="1.5" strokeDasharray="6 8" />
      {stops.map((s, i) => (
        <g key={s.key} data-stop style={{ opacity: 0, transform: "translateY(8px)" }}>
          <circle cx={s.x} cy={s.y} r="5" fill="var(--color-navy-deep)" stroke="var(--color-gold)" strokeWidth="1.5" />
          <circle cx={s.x} cy={s.y} r="2" fill="var(--color-gold)" />
          <text x={s.x} y={s.y + (i % 2 === 0 ? 34 : -22)} textAnchor="middle" fill="var(--color-ivory)" style={{ font: "600 13px var(--font-sans)", letterSpacing: ".12em", textTransform: "uppercase" }}>{s.label}</text>
          <text x={s.x} y={s.y + (i % 2 === 0 ? 56 : -42)} textAnchor="middle" fill="rgb(245 239 227 / .6)" style={{ font: "400 16px var(--font-arabic)" }}>{s.uy}</text>
        </g>
      ))}
      <text x="500" y="250" textAnchor="middle" fill="var(--color-gold)" style={{ font: "500 14px var(--font-cinzel)", letterSpacing: ".3em" }}>{distance}</text>
    </svg>
  );
}
