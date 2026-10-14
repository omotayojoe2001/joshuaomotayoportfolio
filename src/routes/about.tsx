import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { PageHeader, Section, ArrowLink } from "@/components/site-sections";
import { Reveal } from "@/components/motion-primitives";
import { GlobalReach } from "@/components/global-reach";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Who is Joshua? · Joshua Omotayo" },
      {
        name: "description",
        content:
          "Joshua Omotayo is a web developer, technology educator and digital product builder from Nigeria, building websites and products for a global audience.",
      },
      { property: "og:title", content: "About — Who is Joshua? · Joshua Omotayo" },
      { property: "og:type", content: "profile" },
    ],
  }),
  component: AboutPage,
});

const CYCLE = ["BUILDING", "TEACHING", "EXPERIMENTING", "LAUNCHING"];

function CycleMarquee() {
  const reduced = useReducedMotion();
  const row = [...CYCLE, ...CYCLE, ...CYCLE];
  return (
    <div className="relative overflow-hidden border-y border-border py-6">
      <motion.div
        className="flex w-max items-center gap-8"
        animate={reduced ? { x: "0%" } : { x: ["0%", "-33.333%"] }}
        transition={reduced ? { duration: 0 } : { repeat: Infinity, duration: 22, ease: "linear" }}
      >
        {row.map((word, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="display text-3xl whitespace-nowrap md:text-5xl">{word}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
        ))}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

function Portrait() {
  const [failed, setFailed] = useState(false);
  return (
    <Reveal delay={0.1}>
      <figure className="group relative aspect-[4/5] overflow-hidden border border-border bg-surface">
        {!failed ? (
          // Drop your photo at public/joshua.jpg and it appears here automatically.
          <img
            src="/joshua.jpg"
            alt="Joshua Omotayo"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <>
            {/* Placeholder portrait area — replace by adding public/joshua.jpg. */}
            <div className="grid-bg absolute inset-0" />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_30%,rgba(25,167,160,0.16),transparent)] opacity-70 transition-opacity duration-700 group-hover:opacity-100"
            />
          </>
        )}
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-border bg-background/70 px-5 py-4 backdrop-blur">
          <span className="label-tech">JOSHUA OMOTAYO</span>
          {!failed && <span className="label-tech text-accent">PORTRAIT</span>}
          {failed && <span className="label-tech text-accent">ADD VIA /joshua.jpg</span>}
        </figcaption>
      </figure>
    </Reveal>
  );
}

function AboutPage() {
  return (
    <>
      <PageHeader index="05" eyebrow="ABOUT" title="WHO IS JOSHUA?" />

      <Section className="pt-0">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="display text-2xl leading-snug md:text-4xl">
                A web developer, technology educator and digital product builder from Nigeria.
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
                <p className="max-w-xl">
                  Joshua Omotayo builds websites for businesses and organizations across Nigeria,
                  Canada, the United Kingdom and the United States.
                </p>
                <p className="max-w-xl">
                  He has built more than 70 websites and continues to explore the intersection of
                  web development, artificial intelligence and digital products — building for
                  clients and shipping products of his own.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-10 flex flex-wrap gap-3">
                <ArrowLink to="/work" tone="accent">
                  See the work
                </ArrowLink>
                <ArrowLink to="/contact">Work together</ArrowLink>
              </div>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Portrait />
          </div>
        </div>
      </Section>

      {/* The cycle */}
      <CycleMarquee />

      <Section index="01" label="REACH">
        <GlobalReach />
      </Section>

      <Section index="02" label="STORY">
        <Reveal>
          <h2 className="display max-w-3xl text-4xl md:text-6xl">
            BUILDING FROM HERE.
            <br />
            <span className="text-accent">BUILDING FOR EVERYWHERE.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Where a product is built matters less than the quality of the thinking behind it. Global
            technology can be built from anywhere — and the work speaks for itself.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
