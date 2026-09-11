"use server";

import { z } from "zod";
import { addMinutes } from "date-fns";
import { prisma } from "@/lib/prisma";
import { availabilityForDay, isValidDay, zurichDateTime, canCancel } from "@/lib/booking";
import { sendConfirmation, sendCancellation } from "@/lib/reservation-mail";
import { site } from "@/data/site";

const B = site.booking;

const schema = z.object({
  day: z.string().refine(isValidDay, "day"),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  guests: z.coerce.number().int().min(B.minGuests).max(B.maxGuestsOnline),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^[+0-9 ()/.-]{6,30}$/),
  email: z.string().trim().email().max(160),
  occasion: z.string().max(40).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  locale: z.enum(["de", "en", "tr"]).default("de"),
  consent: z.literal("on"),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type BookingResult =
  | { ok: true; token: string; email: string }
  | { ok: false; error: "invalid" | "slotTaken" | "generic" | "consentRequired" | "nameRequired" | "phoneInvalid" | "emailInvalid" };

export async function createReservation(_prev: BookingResult | null, formData: FormData): Promise<BookingResult> {
  const raw = Object.fromEntries(formData);
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const path = parsed.error.issues[0]?.path[0];
    if (path === "consent") return { ok: false, error: "consentRequired" };
    if (path === "name") return { ok: false, error: "nameRequired" };
    if (path === "phone") return { ok: false, error: "phoneInvalid" };
    if (path === "email") return { ok: false, error: "emailInvalid" };
    return { ok: false, error: "invalid" };
  }
  const d = parsed.data;

  // Verfügbarkeit serverseitig erneut prüfen (Doppelbuchungen vermeiden)
  const avail = await availabilityForDay(d.day, d.guests);
  const slot = avail.slots.find((s) => s.time === d.time);
  if (avail.closed || avail.blocked || !slot) return { ok: false, error: "invalid" };
  if (!slot.available) return { ok: false, error: "slotTaken" };

  const startsAt = zurichDateTime(d.day, d.time);
  const endsAt = addMinutes(startsAt, B.diningMinutes);

  try {
    const reservation = await prisma.$transaction(async (tx) => {
      // Innerhalb der Transaktion nochmals zählen, um Race Conditions abzufangen
      const overlapping = await tx.reservation.aggregate({
        _sum: { guests: true },
        where: { startsAt: { lt: endsAt }, endsAt: { gt: startsAt }, status: { in: ["PENDING", "CONFIRMED", "SEATED"] } },
      });
      const used = overlapping._sum.guests ?? 0;
      if (used + d.guests > Math.floor(B.seatsTotal * B.onlineShare)) throw new Error("SLOT_TAKEN");
      return tx.reservation.create({
        data: {
          startsAt,
          endsAt,
          day: d.day,
          guests: d.guests,
          name: d.name,
          phone: d.phone,
          email: d.email,
          locale: d.locale,
          occasion: d.occasion || null,
          notes: d.notes || null,
          status: "CONFIRMED",
        },
      });
    });
    await sendConfirmation(reservation);
    return { ok: true, token: reservation.cancelToken, email: reservation.email };
  } catch (e) {
    if (e instanceof Error && e.message === "SLOT_TAKEN") return { ok: false, error: "slotTaken" };
    console.error("[reservation] create failed", e);
    return { ok: false, error: "generic" };
  }
}

export async function cancelReservation(token: string): Promise<{ ok: boolean; error?: "tooLate" | "notFound" }> {
  const r = await prisma.reservation.findUnique({ where: { cancelToken: token } });
  if (!r) return { ok: false, error: "notFound" };
  if (r.status === "CANCELLED") return { ok: true };
  if (!canCancel(r.startsAt)) return { ok: false, error: "tooLate" };
  const updated = await prisma.reservation.update({ where: { id: r.id }, data: { status: "CANCELLED" } });
  await sendCancellation(updated);
  return { ok: true };
}
