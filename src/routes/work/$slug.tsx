import { createFileRoute, Link } from "@tanstack/react-router";
import { loadProject, loadProjects, type Project } from "@/lib/content";
import { ogImage } from "@/lib/og";
import { ArrowLink } from "@/components/site-sections";
import { Reveal } from "@/components/motion-primitives";

type LoaderData = {
  project: Project | null;
  next: { slug: string; title: string } | null;
};

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }): Promise<LoaderData> => {
    // Run both lookups concurrently instead of back-to-back, so a cold case
    // study waits for one round trip instead of two.
    const [project, list] = await Promise.all([loadProject(params.slug), loadProjects()]);

    let next: LoaderData["next"] = null;
    if (project && list.length > 1) {
      const idx = list.findIndex((p) => p.slug === project.slug);
      if (idx >= 0) {
        const n = list[(idx + 1) % list.length]!;
        next = { slug: n.slug, title: n.title };
      }
    }
    return { project, next };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    const title = p ? `${p.title} - Case Study · Joshua Omotayo` : "Case Study · Joshua Omotayo";
    const description =
      p?.description || "A selected case study by Joshua Omotayo - web developer and AI builder.";
    const meta: Record<string, string>[] = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
    ];
    if (p?.featured_image) meta.push({ property: "og:image", content: p.featured_image });
    return { meta };
  },
  component: CaseStudyPage,
});

function Block({ label, body, index }: { label: string; body?: string | null; index: number }) {
  if (!body || body.trim().length === 0) return null;
  const paragraphs = body.split(/\n{2,}|\n/).filter((s) => s.trim().length > 0);
  return (
    <Reveal
      className="grid gap-4 border-t border-border py-8 md:grid-cols-12"
      hud={label}
      hudIndex={String(index).padStart(2, "0")}
    >
      <h3 className="label-tech text-accent md:col-span-3">{label}</h3>
      <div className="space-y-4 md:col-span-9">
        {paragraphs.map((para, i) => (
          <p key={i} className="max-w-2xl text-base leading-relaxed text-muted-foreground">
            {para}
          </p>
        ))}
      </div>
    </Reveal>
  );
}

function CaseStudyPage() {
  const { project, next } = Route.useLoaderData();

  if (!project) {
    return (
      <div className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-32">
        <span className="label-tech text-accent">CASE STUDY</span>
        <h1 className="display mt-6 text-5xl md:text-7xl">NOT PUBLISHED YET.</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          This case study is still being written. Browse other work in the meantime.
        </p>
        <div className="mt-8">
          <ArrowLink to="/work">Back to work</ArrowLink>
        </div>
      </div>
    );
  }

  const meta = [
    { label: "CATEGORY", value: project.category },
    { label: "YEAR", value: project.year },
    { label: "CLIENT", value: project.client },
    { label: "LOCATION", value: project.location },
  ].filter((m) => m.value && m.value.length > 0);

  return (
    <article>
      {/* Reading progress: reuses the global --scroll bus, no per-frame React */}
      <div
        aria-hidden
        className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-accent/90"
        style={{ transform: "scaleX(var(--scroll))" }}
      />
      {/* Hero */}
      <header className="container-x pt-32 md:pt-44">
        <Link to="/work" className="label-tech link-underline text-accent">
          ← WORK
        </Link>
        <h1 className="display mt-8 text-[13vw] leading-[0.88] md:text-[7vw]">{project.title}</h1>
        {project.description && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 label-tech">
          {meta.map((m) => (
            <div key={m.label}>
              <div className="text-muted-foreground">{m.label}</div>
              <div className="mt-1 text-foreground">{m.value}</div>
            </div>
          ))}
        </div>
        {project.url && (
          <div className="mt-10">
            <ArrowLink href={project.url} tone="accent">
              Visit live site
            </ArrowLink>
          </div>
        )}
      </header>

      {/* Hero image */}
      <div className="container-x mt-14">
        <Reveal>
          <div className="relative aspect-[16/9] overflow-hidden border border-border bg-surface">
            {project.featured_image || ogImage(project.url) ? (
              <img
                src={project.featured_image || ogImage(project.url)}
                alt={project.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid-bg relative flex h-full w-full items-center justify-center overflow-hidden">
                <span className="display select-none text-[clamp(3.5rem,12vw,10rem)] leading-none text-foreground/80">
                  {project.title
                    .replace(/[^\sA-Za-z0-9]/g, " ")
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase() ?? "")
                    .join("")}
                </span>
                {project.category ? (
                  <span className="absolute left-5 top-5 label-tech text-accent">
                    {project.category.toUpperCase()}
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Body */}
      <div className="container-x mt-16 md:mt-24">
        <div className="grid gap-10 md:grid-cols-12">
          <aside className="md:col-span-3">
            <div className="md:sticky md:top-28">
              <h2 className="label-tech text-accent">TECHNOLOGIES</h2>
              {project.technologies.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <li key={t} className="border border-border px-3 py-1.5 label-tech">
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Added per project.</p>
              )}
            </div>
          </aside>

          <div className="md:col-span-9">
            <Block label="OVERVIEW" body={project.overview} index={1} />
            <Block label="THE PROBLEM" body={project.problem} index={2} />
            <Block label="APPROACH" body={project.approach} index={3} />
            <Block label="DESIGN DIRECTION" body={project.design_direction} index={4} />
            <Block label="DEVELOPMENT" body={project.development} index={5} />
            <Block label="OUTCOME" body={project.outcome} index={6} />
            <Block label="REFLECTION" body={project.reflection} index={7} />
          </div>
        </div>
      </div>

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <div className="container-x mt-16 grid gap-6 md:grid-cols-2">
          {project.gallery.map((src, i) => (
            <Reveal key={i} delay={(i % 2) * 0.08}>
              <div className="overflow-hidden border border-border bg-surface">
                <img
                  src={src}
                  alt={`${project.title} - screenshot ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                />
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Next project */}
      {next && (
        <div className="rule mt-20">
          <div className="container-x py-16 md:py-24">
            <span className="label-tech">NEXT PROJECT</span>
            <Link to="/work/$slug" params={{ slug: next.slug }} className="group mt-4 block">
              <span className="display block text-5xl transition-colors group-hover:text-accent md:text-8xl">
                {next.title}
              </span>
              <span className="mt-4 inline-block label-tech text-accent">VIEW CASE STUDY →</span>
            </Link>
          </div>
        </div>
      )}
    </article>
  );
}
