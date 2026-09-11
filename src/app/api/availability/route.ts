import { NextResponse } from "next/server";
import { availabilityForDay, isValidDay } from "@/lib/booking";
import { site } from "@/data/site";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const day = searchParams.get("day") ?? "";
  const guests = Number(searchParams.get("guests") ?? "2");
  if (!isValidDay(day) || !Number.isInteger(guests) || guests < site.booking.minGuests || guests > site.booking.maxGuestsOnline) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const result = await availabilityForDay(day, guests);
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
