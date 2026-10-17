import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { PageHeader, Section, ArrowLink } from "@/components/site-sections";
import { ProjectGrid, ProjectIndex } from "@/components/project-cards";
import { useProjects } from "@/lib/content";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Selected Work - Joshua Omotayo" },
      {
        name: "description",
        content:
          "Selected websites and digital experiences built for businesses and people across Nigeria, Canada, the United Kingdom and the United States.",
      },
      { property: "og:title", content: "Selected Work - Joshua Omotayo" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: WorkPage,
});

type View = "GRID" | "INDEX";

function Toggle({
  options,
  value,
  onChange,
}: {
  options: View[];
  value: View;
  onChange: (next: View) => void;
}) {
  return (
    <div className="flex border border-border" role="group" aria-label="Reading mode">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={value === option}
          className={`label-tech px-4 py-2 transition-colors ${
            value === option
              ? "border-none bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-accent"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function WorkPage() {
  const { data: projects } = useProjects();
  const [view, setView] = useState<View>("GRID");
  const [filter, setFilter] = useState("ALL");
  const reduced = useReducedMotion();

  const all = useMemo(() => projects ?? [], [projects]);
  const categories = useMemo(
    () => ["ALL", ...(Array.from(new Set(all.map((p) => p.category).filter(Boolean))) as string[])],
    [all],
  );
  const shown = useMemo(
    () => (filter === "ALL" ? all : all.filter((p) => p.category === filter)),
    [all, filter],
  );

  return (
    <>
      <PageHeader
        index="01"
        eyebrow="WORK"
        title="SELECTED WORK"
        intro="Websites, web applications and digital experiences. Case studies appear here as they are written."
      />

      <Section>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                aria-pressed={filter === category}
                data-cursor="link"
                className={`label-tech border px-3 py-1.5 transition-colors ${
                  filter === category
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="tnum label-tech text-muted-foreground">
              {String(shown.length).padStart(2, "0")} / {String(all.length).padStart(2, "0")}
            </span>
            <Toggle options={["GRID", "INDEX"]} value={view} onChange={setView} />
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${view}-${filter}`}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {view === "GRID" ? <ProjectGrid projects={shown} /> : <ProjectIndex projects={shown} />}
          </motion.div>
        </AnimatePresence>
      </Section>

      <Section className="pt-0">
        <div className="border border-dashed border-border p-8 md:p-12">
          <span className="label-tech text-accent">A SELECTION, NOT EVERYTHING</span>
          <h2 className="display mt-4 max-w-2xl text-3xl md:text-5xl">
            THIS IS NOT ALL OF MY WORK.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            These are the projects that are written up and ready to show. My full body of work is
            much larger and includes{" "}
            <span className="text-foreground">
              AI chatbots, mobile applications and internal tools
            </span>{" "}
            that are not listed here - for example a Data Server mobile application still on my own
            device and not published to the Google Play Store. If there is something specific you
            want to see, ask and I will walk you through it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ArrowLink to="/contact" tone="accent">
              Ask to see more work
            </ArrowLink>
          </div>
        </div>
      </Section>
      <Section className="pt-0">
        <div className="flex flex-wrap items-center justify-between gap-6 border border-border p-8 md:p-12">
          <h2 className="display max-w-xl text-3xl md:text-5xl">HAVE A PROJECT LIKE THESE?</h2>
          <ArrowLink to="/contact" tone="accent">
            Start a conversation
          </ArrowLink>
        </div>
      </Section>
    </>
  );
}
