"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/data/site";

function isoDay(offset: number) {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Zurich" }).format(new Date(Date.now() + offset * 86400000));
}

/** Kurzer Einstieg in die Reservation: Datum und Personen, weiter geht es im vollen Formular. */
export function QuickBook({ initialDay }: { initialDay: string }) {
  const t = useTranslations("reservation");
  const tn = useTranslations("nav");
  const [day, setDay] = useState(initialDay);
  const [guests, setGuests] = useState(2);
  return (
    <form className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="qb-day" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gold">{t("stepDate")}</label>
        <input id="qb-day" type="date" value={day} min={isoDay(0)} max={isoDay(site.booking.maxDaysAhead)} onChange={(e) => e.target.value && setDay(e.target.value)} className="field border-ivory/20 bg-ivory/5 text-ivory [color-scheme:dark] focus:border-gold" />
      </div>
      <div>
        <label htmlFor="qb-guests" className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gold">{t("stepGuests")}</label>
        <select id="qb-guests" value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="field border-ivory/20 bg-ivory/5 text-ivory [color-scheme:dark] focus:border-gold">
          {Array.from({ length: site.booking.maxGuestsOnline }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n} className="text-ink">{t("guests", { count: n })}</option>
          ))}
        </select>
      </div>
      <Link href={{ pathname: "/reservation", query: { day, guests } }} className="btn btn-gold">{tn("book")}</Link>
    </form>
  );
}
