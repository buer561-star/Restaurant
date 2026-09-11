import { addMinutes, differenceInMinutes } from "date-fns";
import { TZDate } from "@date-fns/tz";
import { site } from "@/data/site";
import { prisma } from "@/lib/prisma";
import { hoursForWeekday, toMinutes, fromMinutes } from "@/lib/hours";

export const TZ = "Europe/Zurich";
const B = site.booking;

/** "YYYY-MM-DD" + "HH:mm" in Europe/Zurich → UTC Date */
export function zurichDateTime(day: string, time: string): Date {
  const [y, m, d] = day.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  return new Date(new TZDate(y, m - 1, d, hh, mm, 0, TZ).getTime());
}

export function todayZurich(): string {
  return new TZDate(Date.now(), TZ).toISOString().slice(0, 10);
}

export function weekdayOf(day: string): number {
  const [y, m, d] = day.split("-").map(Number);
  return new TZDate(y, m - 1, d, 12, 0, 0, TZ).getDay();
}

export function isValidDay(day: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return false;
  const today = todayZurich();
  if (day < today) return false;
  const max = new TZDate(Date.now() + B.maxDaysAhead * 86400000, TZ).toISOString().slice(0, 10);
  return day <= max;
}

/** Alle theoretisch buchbaren Startzeiten eines Tages (ohne Belegung). */
export function slotsForDay(day: string): string[] {
  const intervals = hoursForWeekday(weekdayOf(day));
  const out: string[] = [];
  for (const iv of intervals) {
    const open = toMinutes(iv.open);
    const last = toMinutes(iv.close) - B.lastSeatingBeforeCloseMinutes;
    for (let m = open; m <= last; m += B.slotMinutes) out.push(fromMinutes(m));
  }
  return out;
}

export type SlotAvailability = { time: string; available: boolean; seatsLeft: number };

/**
 * Verfügbarkeit pro Slot: Summe der Gäste aller Reservationen, deren Belegung
 * das Fenster [slot, slot + diningMinutes) überschneidet, gegen die Online-Kapazität.
 */
export async function availabilityForDay(day: string, guests: number): Promise<{ closed: boolean; blocked: boolean; slots: SlotAvailability[] }> {
  const slots = slotsForDay(day);
  if (slots.length === 0) return { closed: true, blocked: false, slots: [] };

  const blocked = await prisma.blockedDate.findUnique({ where: { day } });
  if (blocked) return { closed: false, blocked: true, slots: [] };

  const dayStart = zurichDateTime(day, "00:00");
  const dayEnd = addMinutes(dayStart, 24 * 60 + B.diningMinutes);
  const existing = await prisma.reservation.findMany({
    where: { startsAt: { lt: dayEnd }, endsAt: { gt: dayStart }, status: { in: ["PENDING", "CONFIRMED", "SEATED"] } },
    select: { startsAt: true, endsAt: true, guests: true },
  });

  const capacity = Math.floor(B.seatsTotal * B.onlineShare);
  const now = Date.now();
  const minStart = now + B.minLeadMinutes * 60000;

  const result = slots.map((time) => {
    const start = zurichDateTime(day, time);
    const end = addMinutes(start, B.diningMinutes);
    const used = existing
      .filter((r) => r.startsAt < end && r.endsAt > start)
      .reduce((sum, r) => sum + r.guests, 0);
    const seatsLeft = capacity - used;
    const tooSoon = start.getTime() < minStart;
    return { time, available: !tooSoon && seatsLeft >= guests, seatsLeft: Math.max(0, seatsLeft) };
  });
  return { closed: false, blocked: false, slots: result };
}

export function canCancel(startsAt: Date): boolean {
  return differenceInMinutes(startsAt, new Date()) >= B.cancelUntilMinutesBefore;
}

export function formatReservationDate(date: Date, locale: string): { date: string; time: string } {
  const tag = locale === "de" ? "de-CH" : locale === "tr" ? "tr-TR" : "en-GB";
  return {
    date: new Intl.DateTimeFormat(tag, { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date),
    time: new Intl.DateTimeFormat(tag, { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(date),
  };
}
