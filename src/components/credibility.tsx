import { Counter, Reveal } from "@/components/motion-primitives";

const STATS = [
  { value: 70, suffix: "+", label: "Websites built" },
  { value: 4, suffix: "+", label: "Global markets" },
] as const;

/**
 * High-impact credibility strip. Numbers animate when they enter the viewport.
 * The "ideas" stat is intentionally open-ended (∞) - not a fabricated count.
 */
export function Credibility() {
  return (
    <div className="grid gap-px border-y border-border bg-border sm:grid-cols-3">
      {STATS.map((s, i) => (
        <Reveal key={s.label} delay={i * 0.08} className="bg-background">
          <div className="flex flex-col gap-2 p-8 md:p-12">
            <span className="display text-6xl text-accent md:text-8xl">
              <Counter to={s.value} suffix={s.suffix} />
            </span>
            <span className="label-tech">{s.label}</span>
          </div>
        </Reveal>
      ))}
      <Reveal delay={0.16} className="bg-background">
        <div className="flex flex-col gap-2 p-8 md:p-12">
          <span className="display text-6xl text-accent md:text-8xl">∞</span>
          <span className="label-tech">Ideas being built</span>
        </div>
      </Reveal>
    </div>
  );
}
