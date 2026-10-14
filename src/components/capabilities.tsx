import { motion, useReducedMotion } from "motion/react";
import { CAPABILITIES } from "@/lib/brand";

/**
 * "What I do" — unconventional capability cards.
 * Each card carries a teal sweep and an enlarging index on hover.
 */
export function Capabilities() {
  const reduced = useReducedMotion();

  return (
    <div>
      <h2 className="display max-w-3xl text-4xl md:text-6xl">
        I TURN IDEAS INTO <span className="text-accent">DIGITAL PRODUCTS.</span>
      </h2>

      <div className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2">
        {CAPABILITIES.map((c, i) => (
          <motion.article
            key={c.code}
            className="group relative overflow-hidden bg-background p-8 transition-colors duration-500 hover:bg-surface md:p-10"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* teal sweep */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/10 to-transparent transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
            />
            <div className="relative flex items-start justify-between">
              <span className="display text-5xl text-border-strong transition-colors duration-500 group-hover:text-accent md:text-6xl">
                {c.code}
              </span>
              <span className="mt-2 h-8 w-8 shrink-0 border border-border transition-colors duration-500 group-hover:border-accent" />
            </div>
            <h3 className="display relative mt-8 text-2xl md:text-3xl">{c.title}</h3>
            <p className="relative mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {c.body}
            </p>
            <div className="relative mt-6 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <span key={t} className="border border-border px-2.5 py-1 label-tech text-[10px]">
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
