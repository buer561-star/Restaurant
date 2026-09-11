/** Langsam laufendes Band mit den Gerichten in Lateinschrift und uigurischer Schrift. */
const items: [string, string][] = [
  ["Leghmen", "لەغمەن"],
  ["Polu", "پولو"],
  ["Kawap", "كاۋاپ"],
  ["Manta", "مانتا"],
  ["Samsa", "سامسا"],
  ["Göshnan", "گۆشنان"],
  ["Chöchürä", "چۆچۈرە"],
  ["Chay", "چاي"],
];

export function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-gold/30 bg-navy-deep py-4 text-ivory" aria-hidden="true">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {row.map(([lat, uy], i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="display text-[0.95rem] tracking-[0.3em] text-gold">{lat}</span>
            <span className="uyghur text-[1.35rem] leading-none text-ivory/80">{uy}</span>
            <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
