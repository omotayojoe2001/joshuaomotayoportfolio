import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { LineReveal } from "@/components/motion-primitives";
import { ArrowLink } from "@/components/site-sections";

export function Hero() {
  const reduced = useReducedMotion();
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [photoFailed, setPhotoFailed] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setPointer({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <section className="grain relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24">
      <div
        aria-hidden
        className="grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_35%,black,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />

      <div className="container-x relative grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 label-tech">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            Web Developer • AI Builder • Technology Educator
          </div>

          <h1 className="display mt-8 text-[13.5vw] leading-[0.86] sm:text-[10vw] lg:text-[6.4vw]">
            <LineReveal lines={["I BUILD THE", "DIGITAL THINGS"]} />
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduced ? false : { y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                PEOPLE <span className="text-accent">REMEMBER.</span>
              </motion.span>
            </span>
          </h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground"
          >
            Websites, AI-powered experiences and digital products built from Nigeria for businesses
            and people around the world.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.62, duration: 0.8 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <ArrowLink to="/work" tone="accent">
              Explore my work
            </ArrowLink>
            <ArrowLink to="/contact">Let's build something</ArrowLink>
          </motion.div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-4 border-t border-border pt-6 label-tech">
            <div>
              <dt className="text-foreground">70+</dt>
              <dd className="mt-1">Websites built</dd>
            </div>
            <div>
              <dt className="text-foreground">4+</dt>
              <dd className="mt-1">Global markets</dd>
            </div>
            <div>
              <dt className="text-foreground">WEB + AI</dt>
              <dd className="mt-1">Discipline</dd>
            </div>
          </dl>
        </div>

        {/* Portrait */}
        <div className="relative min-h-[320px] lg:col-span-5 lg:min-h-[520px]">
          <div className="flex h-full items-center justify-center">
            <motion.div
              className="relative w-full max-w-sm"
              initial={reduced ? false : { opacity: 0, y: 30, scale: 0.97 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                x: reduced ? 0 : pointer.x * -18,
                rotate: reduced ? 0 : pointer.y * -2,
              }}
              transition={{
                opacity: { delay: 0.35, duration: 0.7 },
                y: { delay: 0.35, duration: 0.7 },
                default: { type: "spring", stiffness: 60, damping: 18 },
              }}
            >
              <div className="relative aspect-[4/5] overflow-hidden border border-border bg-surface shadow-2xl">
                {photoFailed ? (
                  <div className="grid-bg absolute inset-0" />
                ) : (
                  <img
                    src="/joshua.jpg"
                    alt="Joshua Omotayo"
                    loading="eager"
                    onError={() => setPhotoFailed(true)}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 label-tech">
                  <span className="text-foreground">JOSHUA OMOTAYO</span>
                  <span className="inline-flex items-center gap-2 text-accent">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    OPEN TO WORK
                  </span>
                </figcaption>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
