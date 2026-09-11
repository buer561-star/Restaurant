"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, isAdmin, passwordMatches } from "@/lib/admin-session";
import { sendCancellation } from "@/lib/reservation-mail";
import type { ReservationStatus } from "@prisma/client";

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const pw = String(formData.get("password") ?? "");
  if (!passwordMatches(pw)) return { error: "Falsches Passwort." };
  await createSession();
  revalidatePath("/admin");
  return { error: undefined };
}

export async function logout() {
  await destroySession();
  revalidatePath("/admin");
}

async function guard() {
  if (!(await isAdmin())) throw new Error("Nicht angemeldet");
}

export async function setStatus(formData: FormData) {
  await guard();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as ReservationStatus;
  const allowed: ReservationStatus[] = ["PENDING", "CONFIRMED", "SEATED", "CANCELLED", "NO_SHOW"];
  if (!allowed.includes(status)) return;
  const r = await prisma.reservation.update({ where: { id }, data: { status } });
  if (status === "CANCELLED") await sendCancellation(r);
  revalidatePath("/admin");
}

export async function addWalkIn(formData: FormData) {
  await guard();
  const { zurichDateTime } = await import("@/lib/booking");
  const { addMinutes } = await import("date-fns");
  const { site } = await import("@/data/site");
  const day = String(formData.get("day"));
  const time = String(formData.get("time"));
  const guests = Number(formData.get("guests"));
  const name = String(formData.get("name") ?? "").trim() || "Telefon";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^\d{2}:\d{2}$/.test(time) || !Number.isInteger(guests) || guests < 1) return;
  const startsAt = zurichDateTime(day, time);
  await prisma.reservation.create({
    data: {
      startsAt,
      endsAt: addMinutes(startsAt, site.booking.diningMinutes),
      day,
      guests,
      name,
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? "") || "keine@karahan.local",
      locale: "de",
      status: "CONFIRMED",
      source: "phone",
      notes: String(formData.get("notes") ?? "") || null,
    },
  });
  revalidatePath("/admin");
}

export async function blockDay(formData: FormData) {
  await guard();
  const day = String(formData.get("day"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
  await prisma.blockedDate.upsert({ where: { day }, create: { day, reason: String(formData.get("reason") ?? "") || null }, update: { reason: String(formData.get("reason") ?? "") || null } });
  revalidatePath("/admin");
}

export async function unblockDay(formData: FormData) {
  await guard();
  await prisma.blockedDate.delete({ where: { day: String(formData.get("day")) } }).catch(() => null);
  revalidatePath("/admin");
}

export async function markEventHandled(formData: FormData) {
  await guard();
  await prisma.eventRequest.update({ where: { id: String(formData.get("id")) }, data: { handled: true } });
  revalidatePath("/admin");
}
