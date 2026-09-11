import { IkatBand } from "./IkatBand";

/** Kompakter Seitenkopf für Unterseiten. */
export function PageHero({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <>
      <section className="bg-navy pb-14 pt-32 text-ivory sm:pb-18 sm:pt-40">
        <div className="container-page">
          {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
          <h1 className="display mt-3 text-[2.2rem] sm:text-[3rem]">{title}</h1>
          {lead && <p className="serif mt-5 max-w-2xl text-[1.1rem] leading-relaxed text-ivory/80 sm:text-[1.2rem]">{lead}</p>}
        </div>
      </section>
      <IkatBand />
    </>
  );
}
