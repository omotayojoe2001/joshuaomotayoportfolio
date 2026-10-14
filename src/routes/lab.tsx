import { createFileRoute } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { PageHeader, Section, EmptyState } from "@/components/site-sections";
import { useIsMobile } from "@/hooks/use-mobile";
import { useExperiments } from "@/lib/content";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "The Lab - Experiments · Joshua Omotayo" },
      {
        name: "description",
        content:
          "The Lab: experiments, AI prototypes, small interactions and unfinished ideas from Joshua Omotayo.",
      },
      { property: "og:title", content: "The Lab - Experiments · Joshua Omotayo" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LabPage,
});

// Loose scatter positions for the desktop bench.
const SPOTS = [
  { x: 1, y: 4, r: -3 },
  { x: 33, y: 0, r: 2 },
  { x: 64, y: 8, r: -2 },
  { x: 6, y: 46, r: 2 },
  { x: 38, y: 52, r: -2 },
  { x: 67, y: 46, r: 3 },
];

const STATUS_TONE: Record<string, string> = {
  EXPLORING: "text-primary",
  BUILDING: "text-accent",
  SHIPPED: "text-foreground",
};

function ExperimentCard({
  code,
  title,
  description,
  status,
  url,
  spot,
  draggable,
  index,
  constraints,
}: {
  code: string;
  title: string;
  description: string | null;
  status: string;
  url: string | null;
  spot: { x: number; y: number; r: number };
  draggable: boolean;
  index: number;
  constraints: React.RefObject<HTMLDivElement | null>;
}) {
  const reduced = useReducedMotion();
  const inner = (
    <>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="label-tech text-accent">EXPERIMENT {code}</span>
        <span className={`label-tech ${STATUS_TONE[status] ?? "text-muted-foreground"}`}>
          ● {status}
        </span>
      </div>
      <div className="p-5">
        <h3 className="display text-2xl">{title}</h3>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block label-tech link-underline text-accent"
          >
            OPEN →
          </a>
        )}
      </div>
    </>
  );

  if (!draggable) {
    return (
      <motion.div
        className="border border-border bg-surface/60"
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
      >
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute w-[280px] cursor-grab border border-border bg-surface/80 backdrop-blur-sm active:cursor-grabbing"
      style={{ left: `${spot.x}%`, top: `${spot.y}%`, rotate: spot.r }}
      drag
      dragConstraints={constraints}
      dragElastic={0.08}
      dragMomentum={false}
      whileDrag={{ scale: 1.03, zIndex: 30, rotate: 0 }}
      initial={reduced ? false : { opacity: 0, scale: 0.94 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      {inner}
    </motion.div>
  );
}

function LabPage() {
  const { data } = useExperiments();
  const isMobile = useIsMobile();
  const benchRef = useRef<HTMLDivElement>(null);
  const experiments = data ?? [];

  return (
    <>
      <PageHeader
        index="06"
        eyebrow="THE LAB"
        title="THE LAB"
        intro="Experiments, AI prototypes, small interactions and unfinished ideas. Drag them around."
      />

      <Section className="pt-0">
        {experiments.length === 0 ? (
          <EmptyState>No experiments logged yet. The lab is warming up.</EmptyState>
        ) : isMobile ? (
          <div className="grid gap-5 sm:grid-cols-2">
            {experiments.map((e, i) => (
              <ExperimentCard
                key={e.id}
                code={e.code}
                title={e.title}
                description={e.description}
                status={e.status}
                url={e.url}
                spot={SPOTS[i % SPOTS.length]!}
                draggable={false}
                index={i}
                constraints={benchRef}
              />
            ))}
          </div>
        ) : (
          <div
            ref={benchRef}
            className="grid-bg relative min-h-[620px] overflow-hidden border border-border bg-surface/20 p-4"
          >
            <span className="label-tech pointer-events-none absolute left-4 top-4 text-muted-foreground/50">
              DRAG THE CARDS
            </span>
            {experiments.map((e, i) => (
              <ExperimentCard
                key={e.id}
                code={e.code}
                title={e.title}
                description={e.description}
                status={e.status}
                url={e.url}
                spot={SPOTS[i % SPOTS.length]!}
                draggable
                index={i}
                constraints={benchRef}
              />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
