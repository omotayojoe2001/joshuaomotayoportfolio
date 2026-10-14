import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/motion-primitives";
import { EmptyState } from "@/components/site-sections";
import { ogImage } from "@/lib/og";
import type { Project } from "@/lib/content";

function span(_layout: string, _i: number) {
  // Joshua wants an even two-column grid - no single project spanning the row.
  return "md:col-span-6";
}

function ratio(_layout: string) {
  return "aspect-[4/3]";
}

function initials(title: string) {
  return title
    .replace(/[^\sA-Za-z0-9]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <EmptyState>
        Case studies are being written. New work lands here first -{" "}
        <Link to="/contact" className="text-accent link-underline">
          start a conversation
        </Link>{" "}
        in the meantime.
      </EmptyState>
    );
  }

  return (
    <div className="grid gap-x-6 gap-y-10 md:grid-cols-12">
      {projects.map((p, i) => (
        <Reveal key={p.id} className={span(p.layout, i)} delay={(i % 2) * 0.08}>
          <Link
            to="/work/$slug"
            params={{ slug: p.slug }}
            className="group block"
            aria-label={`View case study: ${p.title}`}
          >
            <div
              className={`relative overflow-hidden border border-border bg-surface ${ratio(p.layout)}`}
            >
              {p.featured_image || ogImage(p.url) ? (
                <img
                  src={p.featured_image || ogImage(p.url)}
                  alt={`${p.title} - ${p.category}`}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0"
                />
              ) : (
                <div className="grid-bg relative flex h-full w-full items-center justify-center overflow-hidden">
                  <span className="display select-none text-[clamp(3rem,9vw,7rem)] leading-none text-foreground/80">
                    {initials(p.title)}
                  </span>
                  {p.category ? (
                    <span className="absolute left-4 top-4 label-tech text-accent">
                      {p.category.toUpperCase()}
                    </span>
                  ) : null}
                </div>
              )}
              <span className="absolute right-4 bottom-4 translate-y-2 border border-accent bg-background/70 px-3 py-1.5 label-tech text-accent opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                VIEW →
              </span>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-6 border-t border-border pt-4">
              <div>
                <h3 className="display text-2xl md:text-3xl">{p.title}</h3>
                {p.description && (
                  <p className="mt-2 max-w-md text-sm text-muted-foreground">{p.description}</p>
                )}
              </div>
              <span className="shrink-0 label-tech">{p.year}</span>
            </div>
            <p className="mt-3 label-tech">
              {[p.category, p.location, p.technologies?.slice(0, 2).join(" / ")]
                .filter(Boolean)
                .join(" - ")}
            </p>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
