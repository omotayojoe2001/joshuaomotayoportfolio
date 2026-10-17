import { Link } from "@tanstack/react-router";
import { Reveal, Tilt, useSpotlight } from "@/components/motion-primitives";
import { EmptyState } from "@/components/site-sections";
import { ogImage } from "@/lib/og";
import type { Project } from "@/lib/content";

function initials(title: string) {
  return title
    .replace(/[^\sA-Za-z0-9]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** https://www.genrev.ng/pricing -> genrev.ng/pricing, for the address bar. */
function domain(url: string) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

function Visual({ project, className }: { project: Project; className: string }) {
  const src = project.featured_image || ogImage(project.url);
  return src ? (
    <img
      src={src}
      alt={`${project.title} - ${project.category}`}
      loading="lazy"
      className={`h-full w-full object-cover grayscale transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0 ${className}`}
    />
  ) : (
    <div className={`grid-bg relative flex h-full w-full items-center justify-center ${className}`}>
      <span className="display select-none text-[clamp(2.5rem,7vw,5.5rem)] leading-none text-foreground/80">
        {initials(project.title)}
      </span>
    </div>
  );
}

/** The hairline browser chrome every card is framed in: this is a web developer's
 *  portfolio, so the work is shown where it actually runs. */
function BrowserChrome({ project, index }: { project: Project; index: number }) {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-surface/60 px-3 py-2">
      <span className="flex items-center gap-1.5" aria-hidden>
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
      </span>
      <span className="label-tech tnum truncate text-[10px] text-muted-foreground/80">
        {project.url ? domain(project.url) : project.slug}
      </span>
      <span className="tnum ml-auto label-tech text-[10px] text-accent/80">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const spotlight = useSpotlight();

  return (
    <Tilt max={3.5}>
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        data-cursor="VIEW"
        {...spotlight}
        className="spotlight group block border border-border bg-background transition-colors duration-500 hover:border-border-strong"
        aria-label={`View case study: ${project.title}`}
      >
        <BrowserChrome project={project} index={index} />

        <div className="relative aspect-[16/10] overflow-hidden bg-surface">
          <Visual project={project} className="" />
          <span className="absolute left-4 top-4 label-tech text-[10px] text-accent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {project.category ? project.category.toUpperCase() : "WEB"}
          </span>
          <span className="absolute right-4 bottom-4 translate-y-2 border border-accent bg-background/70 px-3 py-1.5 label-tech text-accent opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            CASE STUDY →
          </span>
        </div>

        <div className="mt-0 border-t border-border p-5">
          <div className="flex items-baseline justify-between gap-6">
            <h3 className="display text-xl transition-colors duration-300 group-hover:text-accent md:text-2xl">
              {project.title}
            </h3>
            <span className="tnum shrink-0 label-tech">{project.year}</span>
          </div>
          {project.description && (
            <p className="mt-2 line-clamp-2 max-w-md text-sm text-muted-foreground">
              {project.description}
            </p>
          )}
          <p className="mt-3 label-tech text-[10px] text-muted-foreground/70">
            {[project.location, project.technologies?.slice(0, 2).join(" / ")]
              .filter(Boolean)
              .join(" - ")}
          </p>
        </div>
      </Link>
    </Tilt>
  );
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
      {projects.map((project, i) => (
        <Reveal key={project.id} className="md:col-span-6" delay={(i % 2) * 0.08}>
          <ProjectCard project={project} index={i} />
        </Reveal>
      ))}
    </div>
  );
}

/**
 * The same catalogue read as an index: one row per project, the preview rising
 * out of the row on hover. Denser, faster to scan, and it proves the interface
 * can hold two different readings of one data set.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return <EmptyState>Nothing published in this view yet.</EmptyState>;
  }

  return (
    <ul className="rule border-x border-b border-border">
      {projects.map((project, i) => (
        <li key={project.id} className="border-b border-border last:border-b-0">
          <Link
            to="/work/$slug"
            params={{ slug: project.slug }}
            data-cursor="OPEN"
            className="group relative flex items-center gap-4 overflow-hidden px-4 py-5 transition-colors duration-500 hover:bg-surface/60 md:gap-6 md:px-6 md:py-7"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
            />
            <span className="tnum label-tech w-8 shrink-0 text-accent/80">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="display min-w-0 flex-1 truncate text-xl transition-colors duration-300 group-hover:text-accent md:text-3xl">
              {project.title}
            </span>
            <span className="label-tech hidden w-40 shrink-0 text-muted-foreground md:block">
              {project.category}
            </span>
            <span className="label-tech hidden w-28 shrink-0 text-muted-foreground/70 lg:block">
              {project.location}
            </span>
            <span className="tnum label-tech w-12 shrink-0 text-right">{project.year}</span>
            <span className="relative hidden h-16 w-24 shrink-0 overflow-hidden border border-border bg-surface opacity-0 transition-all duration-500 group-hover:opacity-100 md:block">
              <Visual project={project} className="" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
