import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion-primitives";
import { MARKETS } from "@/lib/brand";

// Hub-and-spoke geography: Nigeria at the hub, client markets on the spokes.
const HUB = { x: 200, y: 250 };
const SPOKES = [
  { code: "CA", x: 62, y: 74, bend: 150 },
  { code: "GB", x: 200, y: 44, bend: 120 },
  { code: "US", x: 338, y: 92, bend: 250 },
];

function ConnectionMap() {
  const reduced = useReducedMotion();
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Client reach map">
      <defs>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* faint latitude grid */}
      {[60, 120, 180, 240].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="var(--border)" strokeWidth="0.5" />
      ))}
      {[80, 160, 240, 320].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="300" stroke="var(--border)" strokeWidth="0.5" />
      ))}

      <circle cx={HUB.x} cy={HUB.y} r="70" fill="url(#hubGlow)" />

      {SPOKES.map((s, i) => {
        const path = `M ${HUB.x} ${HUB.y} Q ${s.bend} ${(HUB.y + s.y) / 2 - 40} ${s.x} ${s.y}`;
        return (
          <g key={s.code}>
            <path d={path} fill="none" stroke="var(--border-strong)" strokeWidth="0.75" />
            <motion.path
              d={path}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.9 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.2 + i * 0.18, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.circle
              cx={s.x}
              cy={s.y}
              r="4"
              fill="var(--background)"
              stroke="var(--accent)"
              strokeWidth="1.2"
              initial={reduced ? false : { scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.18, type: "spring", stiffness: 140, damping: 12 }}
              style={{ transformOrigin: `${s.x}px ${s.y}px` }}
            />
            <text
              x={s.x}
              y={s.y - 12}
              textAnchor="middle"
              className="label-tech"
              fill="var(--muted-foreground)"
              fontSize="9"
            >
              {s.code}
            </text>
          </g>
        );
      })}

      {/* hub */}
      <motion.circle
        cx={HUB.x}
        cy={HUB.y}
        r="6"
        fill="var(--accent)"
        initial={reduced ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
        style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
      />
      {!reduced && (
        <motion.circle
          cx={HUB.x}
          cy={HUB.y}
          r="6"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1"
          animate={{ scale: [1, 4], opacity: [0.6, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
          style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
        />
      )}
      <text
        x={HUB.x}
        y={HUB.y + 24}
        textAnchor="middle"
        className="label-tech"
        fill="var(--foreground)"
        fontSize="10"
      >
        NIGERIA — HUB
      </text>
    </svg>
  );
}

export function GlobalReach() {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <Reveal className="lg:col-span-6">
        <h2 className="display text-4xl md:text-6xl">
          BUILT FROM NIGERIA.
          <br />
          <span className="text-accent">USED AROUND THE WORLD.</span>
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          Global technology can be built from anywhere. Websites and products designed and developed
          from Nigeria for clients and audiences across four markets.
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 lg:grid-cols-2">
          {MARKETS.map((m) => (
            <li key={m.code} className="group bg-background p-5 transition-colors hover:bg-surface">
              <span className="text-xl" aria-hidden>
                {m.flag}
              </span>
              <p className="mt-3 text-sm text-foreground">{m.country}</p>
              <p className="label-tech mt-1 text-[10px]">{m.note}</p>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={0.1} className="lg:col-span-6">
        <div className="relative aspect-[4/3] w-full border border-border bg-surface/30">
          <ConnectionMap />
        </div>
      </Reveal>
    </div>
  );
}
