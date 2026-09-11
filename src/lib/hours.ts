import { site } from "@/data/site";

export type Interval = { open: string; close: string };

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function hoursForWeekday(weekday: number): Interval[] {
  return site.hours[weekday] ?? [];
}

/** Gruppiert gleiche Öffnungszeiten aufeinanderfolgender Tage, z.B. "Di–Do 11:30–14:00, 17:30–22:00" */
export function groupedHours(): { from: number; to: number; intervals: Interval[] }[] {
  const order = [1, 2, 3, 4, 5, 6, 0];
  const groups: { from: number; to: number; intervals: Interval[] }[] = [];
  for (const d of order) {
    const iv = hoursForWeekday(d);
    const last = groups[groups.length - 1];
    if (last && JSON.stringify(last.intervals) === JSON.stringify(iv)) {
      last.to = d;
    } else {
      groups.push({ from: d, to: d, intervals: iv });
    }
  }
  return groups;
}

export function formatIntervals(iv: Interval[], closedLabel: string): string {
  if (iv.length === 0) return closedLabel;
  return iv.map((i) => `${i.open}–${i.close}`).join(", ");
}

/** Aktueller Wochentag in Europe/Zurich */
export function zurichWeekday(date = new Date()): number {
  const s = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Zurich", weekday: "short" }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(s);
}
