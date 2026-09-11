import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? site.domain).replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/*/admin", "/api/", "/reservation/", "/en/reservations/", "/tr/rezervasyon/"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
