"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Bewegtes Bild: stummer Loop, der erst lädt, wenn er ins Bild kommt, und pausiert, wenn er es verlässt.
 * Ohne Video, bei reduzierter Bewegung oder Datensparmodus bleibt das Standbild.
 */
export function LoopVideo({ sources, poster, alt, sizes, className = "", priority = false }: { sources?: string[]; poster: string; alt: string; sizes: string; className?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!sources?.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        const v = videoRef.current;
        if (e.isIntersecting) {
          setEnabled(true);
          v?.play().catch(() => undefined);
        } else {
          v?.pause();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [sources]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <Image src={poster} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`} />
      {enabled && sources && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onCanPlay={() => setReady(true)}
          aria-hidden="true"
        >
          {sources.map((src) => (
            <source key={src} src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          ))}
        </video>
      )}
    </div>
  );
}
