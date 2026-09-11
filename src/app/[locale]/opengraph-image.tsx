import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/data/site";

export const alt = "Karahan Uigur Restaurant Winterthur";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tagline = site.tagline[(locale as keyof typeof site.tagline) in site.tagline ? (locale as keyof typeof site.tagline) : "de"];
  const photo = await readFile(join(process.cwd(), "public/images/og-base.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b1f3a", color: "#f5efe3", fontFamily: "serif" }}>
        <img src={photoSrc} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,31,58,0.2), rgba(11,31,58,0.95))" }} />
        <div style={{ position: "absolute", left: 72, bottom: 72, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 8, color: "#c9a227", textTransform: "uppercase" }}>Winterthur</div>
          <div style={{ fontSize: 112, letterSpacing: 10, marginTop: 8, fontWeight: 700 }}>KARAHAN</div>
          <div style={{ fontSize: 30, letterSpacing: 6, color: "#2a9d9f", textTransform: "uppercase" }}>Uigur Restaurant</div>
          <div style={{ fontSize: 34, marginTop: 28, color: "#f5efe3", opacity: 0.9 }}>{tagline}</div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, display: "flex" }}>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} style={{ display: "flex", flex: 1 }}>
              <div style={{ flex: 2, background: "#b3312d" }} />
              <div style={{ flex: 1, background: "#c9a227" }} />
              <div style={{ flex: 2, background: "#0b1f3a" }} />
              <div style={{ flex: 1, background: "#2a9d9f" }} />
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
