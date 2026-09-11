"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail, restaurantInbox, mailLayout } from "@/lib/email";

const schema = z.object({
  type: z.enum(["group", "private", "catering"]),
  date: z.string().max(20).optional().or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(500).optional(),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(5).max(3000),
  locale: z.enum(["de", "en", "tr"]).default("de"),
  // Honeypot gegen Bots
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EventFormState = { ok: boolean; error?: string } | null;

export async function submitEventRequest(_prev: EventFormState, formData: FormData): Promise<EventFormState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;

  try {
    await prisma.eventRequest.create({
      data: {
        type: d.type,
        date: d.date || null,
        guests: d.guests ?? null,
        name: d.name,
        phone: d.phone,
        email: d.email,
        message: d.message,
        locale: d.locale,
      },
    });
  } catch (e) {
    console.error("[event-request] db error", e);
    return { ok: false, error: "generic" };
  }

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] ?? c));
  const rows = [
    ["Art", d.type],
    ["Datum", d.date || "–"],
    ["Personen", d.guests ? String(d.guests) : "–"],
    ["Name", d.name],
    ["Telefon", d.phone],
    ["E-Mail", d.email],
    ["Sprache", d.locale],
  ]
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#7b8494">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
    .join("");
  const html = mailLayout(
    "Neue Gruppen-/Event-Anfrage",
    `<table role="presentation" cellpadding="0" cellspacing="0">${rows}</table><p style="margin-top:16px;white-space:pre-wrap">${esc(d.message)}</p>`,
    "Automatische Nachricht der Website. Antworten Sie direkt auf diese Mail, um den Gast zu erreichen."
  );
  await sendMail({
    to: restaurantInbox(),
    replyTo: d.email,
    subject: `Anfrage ${d.type}: ${d.name}${d.guests ? ` (${d.guests} P.)` : ""}`,
    html,
    text: `${rows.replace(/<[^>]+>/g, " ")}\n\n${d.message}`,
  });

  return { ok: true };
}
