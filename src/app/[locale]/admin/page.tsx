import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Header } from "@/components/Header";
import { AdminLogin } from "@/components/AdminLogin";
import { isAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";
import { todayZurich, formatReservationDate, slotsForDay } from "@/lib/booking";
import { site } from "@/data/site";
import { addWalkIn, blockDay, logout, markEventHandled, setStatus, unblockDay } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const STATUS_LABEL: Record<string, string> = { PENDING: "Eingegangen", CONFIRMED: "Bestätigt", SEATED: "Am Tisch", CANCELLED: "Storniert", NO_SHOW: "Nicht erschienen" };
const STATUS_STYLE: Record<string, string> = { PENDING: "bg-sand text-navy", CONFIRMED: "bg-teal text-ivory", SEATED: "bg-navy text-ivory", CANCELLED: "bg-ikat text-ivory", NO_SHOW: "bg-ink-3 text-ivory" };

export default async function AdminPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ day?: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const admin = await isAdmin();

  if (!admin) {
    return (
      <>
        <Header />
        <main className="container-page flex flex-1 items-center py-40"><AdminLogin /></main>
      </>
    );
  }

  const sp = await searchParams;
  const day = sp.day && /^\d{4}-\d{2}-\d{2}$/.test(sp.day) ? sp.day : todayZurich();
  const [reservations, blocked, events] = await Promise.all([
    prisma.reservation.findMany({ where: { day }, orderBy: { startsAt: "asc" } }),
    prisma.blockedDate.findMany({ orderBy: { day: "asc" }, where: { day: { gte: todayZurich() } } }),
    prisma.eventRequest.findMany({ where: { handled: false }, orderBy: { createdAt: "desc" }, take: 20 }),
  ]);
  const active = reservations.filter((r) => r.status !== "CANCELLED" && r.status !== "NO_SHOW");
  const guestsTotal = active.reduce((s, r) => s + r.guests, 0);
  const capacity = Math.floor(site.booking.seatsTotal * site.booking.onlineShare);
  const prev = new Date(new Date(day).getTime() - 86400000).toISOString().slice(0, 10);
  const next = new Date(new Date(day).getTime() + 86400000).toISOString().slice(0, 10);
  const slots = slotsForDay(day);

  return (
    <>
      <Header />
      <main className="container-page py-28 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-gold pb-4">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="display mt-1 text-3xl text-navy">Reservationen</h1>
          </div>
          <form action={logout}><button className="btn btn-outline !min-h-10 text-sm">Abmelden</button></form>
        </div>

        {/* Tagesnavigation */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={`?day=${prev}`} className="btn btn-outline !min-h-10 text-sm">← Vortag</a>
          <form className="flex items-center gap-2">
            <input type="date" name="day" defaultValue={day} className="field !min-h-10 w-auto" />
            <button className="btn btn-navy !min-h-10 text-sm">Anzeigen</button>
          </form>
          <a href={`?day=${next}`} className="btn btn-outline !min-h-10 text-sm">Folgetag →</a>
          <a href="?" className="text-sm font-semibold text-navy underline decoration-gold underline-offset-2">Heute</a>
          <span className="ml-auto text-sm text-ink-2 tabular">
            {day} · {active.length} Reservationen · {guestsTotal} Gäste (online buchbar: {capacity} pro Zeitfenster)
          </span>
        </div>

        {/* Liste */}
        <div className="mt-6 overflow-x-auto bg-ivory-2 shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-[0.1em] text-ink-2">
                <th className="px-4 py-3">Zeit</th><th className="px-4 py-3">Gäste</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Kontakt</th><th className="px-4 py-3">Notiz</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {reservations.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-3">Keine Reservationen an diesem Tag.</td></tr>}
              {reservations.map((r) => {
                const f = formatReservationDate(r.startsAt, "de");
                return (
                  <tr key={r.id} className={r.status === "CANCELLED" ? "opacity-50" : ""}>
                    <td className="px-4 py-3 font-semibold tabular text-navy">{f.time}</td>
                    <td className="px-4 py-3 tabular">{r.guests}</td>
                    <td className="px-4 py-3">{r.name}{r.occasion && <span className="block text-xs text-ink-3">{r.occasion}</span>}{r.source !== "web" && <span className="block text-xs text-ink-3">{r.source}</span>}</td>
                    <td className="px-4 py-3"><a href={`tel:${r.phone}`} className="text-navy">{r.phone}</a><span className="block text-xs text-ink-3">{r.email}</span></td>
                    <td className="max-w-[16rem] px-4 py-3 text-ink-2">{r.notes}</td>
                    <td className="px-4 py-3"><span className={`inline-block rounded-sm px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span></td>
                    <td className="px-4 py-3">
                      <form action={setStatus} className="flex items-center gap-1">
                        <input type="hidden" name="id" value={r.id} />
                        <select name="status" defaultValue={r.status} className="field !min-h-9 w-auto !py-1 text-xs">
                          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <button className="btn btn-navy !min-h-9 !px-3 text-xs">OK</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          {/* Telefonische Reservation erfassen */}
          <section className="bg-ivory-2 p-6 shadow-soft">
            <h2 className="display text-xl text-navy">Reservation erfassen</h2>
            <p className="mt-1 text-xs text-ink-3">Telefon oder Walk-in. Zählt gegen die Kapazität.</p>
            <form action={addWalkIn} className="mt-4 grid gap-3">
              <input type="date" name="day" defaultValue={day} required className="field !min-h-10" />
              <select name="time" required className="field !min-h-10" defaultValue={slots[0] ?? "18:00"}>
                {slots.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="number" name="guests" min={1} max={site.booking.seatsTotal} defaultValue={2} required className="field !min-h-10" placeholder="Gäste" />
              <input name="name" className="field !min-h-10" placeholder="Name" />
              <input name="phone" className="field !min-h-10" placeholder="Telefon" />
              <input name="email" type="email" className="field !min-h-10" placeholder="E-Mail (optional)" />
              <input name="notes" className="field !min-h-10" placeholder="Notiz" />
              <button className="btn btn-gold !min-h-10 text-sm">Speichern</button>
            </form>
          </section>

          {/* Sperrtage */}
          <section className="bg-ivory-2 p-6 shadow-soft">
            <h2 className="display text-xl text-navy">Sperrtage</h2>
            <p className="mt-1 text-xs text-ink-3">An Sperrtagen sind online keine Reservationen möglich.</p>
            <form action={blockDay} className="mt-4 flex flex-wrap gap-2">
              <input type="date" name="day" required className="field !min-h-10 w-auto" />
              <input name="reason" className="field !min-h-10 flex-1" placeholder="Grund (optional)" />
              <button className="btn btn-navy !min-h-10 text-sm">Sperren</button>
            </form>
            <ul className="mt-4 divide-y divide-line text-sm">
              {blocked.length === 0 && <li className="py-2 text-ink-3">Keine Sperrtage.</li>}
              {blocked.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 py-2">
                  <span><strong className="tabular">{b.day}</strong>{b.reason && <span className="text-ink-2"> · {b.reason}</span>}</span>
                  <form action={unblockDay}><input type="hidden" name="day" value={b.day} /><button className="text-xs font-semibold text-ikat">Freigeben</button></form>
                </li>
              ))}
            </ul>
          </section>

          {/* Anfragen */}
          <section className="bg-ivory-2 p-6 shadow-soft">
            <h2 className="display text-xl text-navy">Offene Anfragen</h2>
            <p className="mt-1 text-xs text-ink-3">Gruppen, Events, Catering.</p>
            <ul className="mt-4 divide-y divide-line text-sm">
              {events.length === 0 && <li className="py-2 text-ink-3">Keine offenen Anfragen.</li>}
              {events.map((e) => (
                <li key={e.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <strong>{e.name}</strong> · {e.type}{e.guests ? ` · ${e.guests} P.` : ""}{e.date ? ` · ${e.date}` : ""}
                      <span className="block text-xs text-ink-3"><a href={`mailto:${e.email}`}>{e.email}</a> · {e.phone}</span>
                      <p className="mt-1 whitespace-pre-wrap text-ink-2">{e.message}</p>
                    </div>
                    <form action={markEventHandled}><input type="hidden" name="id" value={e.id} /><button className="shrink-0 text-xs font-semibold text-teal-2">Erledigt</button></form>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
