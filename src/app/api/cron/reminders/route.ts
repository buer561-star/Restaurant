import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReminder } from "@/lib/reservation-mail";

export const dynamic = "force-dynamic";

/**
 * Erinnerungs-Mails ~24 h vor dem Termin. Auf Railway als Cron-Service stündlich aufrufen:
 *   curl -H "Authorization: Bearer $CRON_SECRET" https://<domain>/api/cron/reminders
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const secret = process.env.CRON_SECRET;
  if (!secret || auth !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const now = Date.now();
  const from = new Date(now + 22 * 3600000);
  const to = new Date(now + 26 * 3600000);
  const due = await prisma.reservation.findMany({
    where: { startsAt: { gte: from, lte: to }, status: { in: ["PENDING", "CONFIRMED"] }, reminderSentAt: null, source: "web" },
  });
  let sent = 0;
  for (const r of due) {
    try {
      await sendReminder(r);
      await prisma.reservation.update({ where: { id: r.id }, data: { reminderSentAt: new Date() } });
      sent++;
    } catch (e) {
      console.error("[reminder] failed", r.id, e);
    }
  }
  return NextResponse.json({ due: due.length, sent });
}
