import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  text,
  tone = "dark",
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  const titleColor = tone === "light" ? "text-ivory" : "text-navy";
  const textColor = tone === "light" ? "text-ivory/75" : "text-ink-2";
  const eyebrowColor = tone === "light" ? "text-gold" : "text-gold-2";
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className={`eyebrow ${eyebrowColor}`}>{eyebrow}</p>}
      <Tag className={`display mt-3 ${Tag === "h1" ? "text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem]" : "text-[1.75rem] sm:text-[2.2rem]"} ${titleColor}`}>
        {title}
      </Tag>
      {text && <p className={`serif mt-5 text-[1.1rem] leading-relaxed ${textColor}`}>{text}</p>}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}
