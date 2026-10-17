import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { LineReveal, Magnetic, ScrambleText, useSpotlight } from "@/components/motion-primitives";

/**
 * The section frame used by every surface: a numbered rule that draws itself
 * in, and a `data-hud` read the instrument rail on the right picks up.
 */
export function Section({
  id,
  index,
  label,
  children,
  className = "",
}: {
  id?: string;
  index?: string;
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <section
      id={id}
      data-hud={label ?? ""}
      data-hud-index={index ?? ""}
      className={`rule py-20 md:py-32 ${className}`}
    >
      <div className="container-x">
        {(index || label) && (
          <div className="mb-10 flex items-center gap-4 label-tech">
            {index && (
              <motion.span
                className="tnum text-accent"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4 }}
              >
                {index}
              </motion.span>
            )}
            {label && (
              <motion.span
                initial={reduced ? false : { opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {label}
              </motion.span>
            )}
            <motion.span
              className="h-px flex-1 origin-left bg-border"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function ArrowLink({
  to,
  href,
  children,
  tone = "default",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  tone?: "default" | "accent";
}) {
  const spotlight = useSpotlight();
  const cls = `spotlight group inline-flex items-center gap-3 border px-5 py-3 label-tech transition-colors ${
    tone === "accent"
      ? "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
      : "border-border-strong text-foreground hover:border-accent hover:text-accent"
  }`;
  const inner = (
    <>
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </>
  );
  return (
    <Magnetic strength={0.18}>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          data-cursor="OPEN"
          {...spotlight}
          className={cls}
        >
          {inner}
        </a>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Link to={to as any} data-cursor="GO" {...spotlight} className={cls}>
          {inner}
        </Link>
      )}
    </Magnetic>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rule flex min-h-40 items-center justify-center border-x border-b border-border p-10 text-center">
      <p className="max-w-md text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

export function PageHeader({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  const reduced = useReducedMotion();
  const lines = title.split(/(?<=[.,!?])\s/);

  return (
    <header
      data-hud={eyebrow}
      data-hud-index={index}
      className="container-x relative pt-32 pb-14 md:pt-44 md:pb-20"
    >
      <div className="flex items-center gap-4 label-tech">
        <span className="tnum text-accent">{index}</span>
        <ScrambleText text={eyebrow} speed={22} />
        <motion.span
          className="h-px flex-1 origin-left bg-border"
          initial={reduced ? false : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <h1 className="display mt-8 text-[13vw] leading-[0.88] md:text-[7vw]">
        <LineReveal lines={lines.length > 1 ? lines : [title]} delay={0.1} />
      </h1>
      {intro && (
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.7 }}
          className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground"
        >
          {intro}
        </motion.p>
      )}
    </header>
  );
}
