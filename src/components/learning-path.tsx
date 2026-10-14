import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

const STAGES = [
  { label: "Idea", body: "Understanding the problem worth solving." },
  { label: "Web", body: "Building the interface and the experience." },
  { label: "AI", body: "Adding intelligence where it is genuinely useful." },
  { label: "Product", body: "Shaping it into something people can rely on." },
  { label: "Launch", body: "Shipping, measuring, and iterating in public." },
];

/**
 * An interactive learning path rather than a list.
 * Horizontal + animated on desktop, vertical on mobile.
 */
export function LearningPath() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  return (
    <div>
      <div
        className="relative"
        onMouseLeave={() => setActive(0)}
        role="list"
        aria-label="Learning path"
      >
        {/* connecting line */}
        <div className="absolute left-0 right-0 top-6 hidden h-px bg-border md:block" />
        <motion.div
          className="absolute left-0 top-6 hidden h-px bg-accent md:block"
          initial={reduced ? false : { width: 0 }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />

        <ol className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-4">
          {STAGES.map((s, i) => {
            const isActive = active === i;
            return (
              <li key={s.label} role="listitem">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={isActive}
                  className="group w-full text-left"
                >
                  <span className="flex items-center gap-3 md:block">
                    <span
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border font-mono text-xs transition-colors duration-300 md:mb-5 ${
                        isActive
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border-strong bg-background text-muted-foreground group-hover:border-accent group-hover:text-accent"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`display text-2xl transition-colors md:text-3xl ${
                        isActive ? "text-accent" : "text-foreground"
                      }`}
                    >
                      {s.label}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="rule mt-10 min-h-[4.5rem] border-x border-b border-border p-6">
        <motion.p
          key={active}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl text-sm leading-relaxed text-muted-foreground"
        >
          <span className="label-tech mr-3 text-accent">{STAGES[active]?.label}</span>
          {STAGES[active]?.body}
        </motion.p>
      </div>
    </div>
  );
}
