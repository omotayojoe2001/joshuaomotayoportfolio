import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import {
  LineReveal,
  Marquee,
  ScrambleText,
  Tilt,
  useSpotlight,
} from "@/components/motion-primitives";
import { ArrowLink } from "@/components/site-sections";
import { useSettings } from "@/lib/content";

const READOUTS = [
  { value: "70+", label: "Websites built" },
  { value: "4", label: "Global markets" },
  { value: "WEB + AI", label: "One discipline" },
];

const TICKER = [
  "WEBSITES THAT CONVERT",
  "AI WHERE IT IS USEFUL",
  "PRODUCTS FROM IDEA TO LAUNCH",
  "TEACHING PEOPLE TO BUILD",
  "LAGOS / CANADA / UK / US",
  "BUILT IN PUBLIC",
];

export function Hero() {
  const reduced = useReducedMotion();
  const [photoFailed, setPhotoFailed] = useState(false);
  const spotlight = useSpotlight();
  const { data: settings } = useSettings();

  // Pointer parallax on motion values: the frame follows the cursor without
  // pushing a new state through React 60 times a second.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(useTransform(px, [-0.5, 0.5], [16, -16]), { stiffness: 60, damping: 18 });
  const y = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 60, damping: 18 });
  const rotate = useSpring(useTransform(py, [-0.5, 0.5], [-1.6, 1.6]), {
    stiffness: 60,
    damping: 18,
  });

  useEffect(() => {
    if (reduced) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      px.set(event.clientX / window.innerWidth - 0.5);
      py.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, px, py]);

  return (
    <section className="grain relative overflow-hidden pt-32 pb-0 md:pt-44 md:pb-0">
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
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 label-tech">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            <ScrambleText
              text="WEB DEVELOPER / AI BUILDER / EDUCATOR"
              className="text-foreground/80"
              delay={0.2}
            />
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
            {READOUTS.map((readout, i) => (
              <motion.div
                key={readout.label}
                initial={reduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 + i * 0.08, duration: 0.6 }}
              >
                <dt className="display text-xl tracking-tight text-foreground md:text-2xl">
                  {readout.value}
                </dt>
                <dd className="mt-1">{readout.label}</dd>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Portrait, framed like an instrument. */}
        <div className="relative min-h-[320px] lg:col-span-5 lg:min-h-[520px]">
          <div className="flex h-full items-center justify-center">
            <motion.div
              className="relative w-full max-w-sm"
              style={{ x: reduced ? 0 : x, rotate: reduced ? 0 : rotate }}
              initial={reduced ? false : { opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                opacity: { delay: 0.35, duration: 0.7 },
                default: { type: "spring", stiffness: 60, damping: 18 },
              }}
            >
              <motion.div className="relative" style={{ y: reduced ? 0 : y }}>
                <Tilt max={5} className="relative">
                  <div
                    {...spotlight}
                    data-cursor="VIEW"
                    className="spotlight hud-corners relative aspect-[4/5] overflow-hidden border border-border bg-surface shadow-2xl"
                  >
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
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />

                    <span className="absolute left-4 top-4 label-tech tnum text-[10px] text-foreground/70">
                      06.5244° N / 03.3792° E
                    </span>

                    <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 label-tech">
                      <span className="text-foreground">JOSHUA OMOTAYO</span>
                      <span className="inline-flex items-center gap-2 text-accent">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                        {settings?.availability_status
                          ? settings.availability_status.toUpperCase()
                          : "OPEN TO WORK"}
                      </span>
                    </figcaption>
                  </div>
                </Tilt>
              </motion.div>

              <span className="mt-3 hidden justify-between px-1 label-tech md:flex">
                <span>SELECTOR / OPERATOR</span>
                <span className="text-accent">REC ●</span>
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* The machine keeps running: one strip, one loop, no cost while scrolling. */}
      <div className="relative mt-16 border-y border-border py-3 md:mt-24">
        <Marquee
          items={TICKER}
          duration={38}
          itemClassName="label-tech text-muted-foreground"
          separator="●"
          className="mask-fade-r"
        />
      </div>
    </section>
  );
}
