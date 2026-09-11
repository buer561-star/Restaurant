"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Hintergrund des Heros: Video, wenn vorhanden und erlaubt, sonst Foto mit langsamer Ken-Burns-Bewegung.
 * Das Video wird erst nach dem ersten Bild geladen, damit der Seitenaufbau nicht wartet.
 */
export function HeroMedia({ videoSrc, poster, alt }: { videoSrc?: string[]; poster: string; alt: string }) {
  const [useVideo, setUseVideo] = useState(false);
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoSrc) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    if (conn?.saveData || (conn?.effectiveType && /2g/.test(conn.effectiveType))) return;
    const id = requestAnimationFrame(() => setUseVideo(true));
    return () => cancelAnimationFrame(id);
  }, [videoSrc]);


  useEffect(() => {
    const v = videoRef.current;
    if (!v || !useVideo) return;
    const onCanPlay = () => {
      setReady(true);
      v.play().catch(() => setUseVideo(false));
    };
    v.addEventListener("canplay", onCanPlay);
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [useVideo]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-deep">
      <Image src={poster} alt={alt} fill priority fetchPriority="high" quality={60} sizes="100vw" className={`kenburns object-cover object-center transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`} />
      {useVideo && videoSrc && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          aria-hidden="true"
        >
          {videoSrc.map((src) => (
            <source key={src} src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          ))}
        </video>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgb(7_20_38/.92)_0%,rgb(7_20_38/.55)_45%,rgb(7_20_38/.25)_100%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-navy-deep/80 to-transparent" aria-hidden="true" />
    </div>
  );
}
