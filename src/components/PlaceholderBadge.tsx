import { useTranslations } from "next-intl";
import { SHOW_PLACEHOLDER_BADGES } from "@/data/images";

/** Kennzeichnet AI-generierte Platzhalterbilder. Verschwindet, sobald `placeholder` im Manifest auf false steht. */
export function PlaceholderBadge({ className = "" }: { className?: string }) {
  const t = useTranslations("common");
  if (!SHOW_PLACEHOLDER_BADGES) return null;
  return (
    <span
      title={t("placeholderHint")}
      className={`pointer-events-auto absolute left-2 top-2 z-10 rounded-sm bg-navy/80 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-ivory backdrop-blur-sm ${className}`}
    >
      {t("placeholderBadge")}
    </span>
  );
}
