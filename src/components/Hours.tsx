import { useTranslations } from "next-intl";
import { groupedHours, formatIntervals } from "@/lib/hours";

export function Hours({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  const t = useTranslations("common");
  const groups = groupedHours();
  const muted = tone === "light" ? "text-ivory/70" : "text-ink-2";
  const strong = tone === "light" ? "text-ivory" : "text-ink";
  return (
    <dl className={`grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 ${compact ? "text-sm" : ""}`}>
      {groups.map((g) => {
        const label =
          g.from === g.to
            ? t(`weekdaysShort.${g.from}`)
            : `${t(`weekdaysShort.${g.from}`)}–${t(`weekdaysShort.${g.to}`)}`;
        const closed = g.intervals.length === 0;
        return (
          <div key={g.from} className="contents">
            <dt className={`font-semibold ${strong}`}>{label}</dt>
            <dd className={`tabular ${closed ? muted : strong}`}>{formatIntervals(g.intervals, t("closed"))}</dd>
          </div>
        );
      })}
    </dl>
  );
}
