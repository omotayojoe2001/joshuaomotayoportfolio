import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/motion-primitives";
import { FigmaPlayer } from "@/components/figma-player";
import { ArrowLink } from "@/components/site-sections";
import { figmaEmbedsBySlug } from "@/lib/data/figma-embeds";

/**
 * The landing page's interactive centrepiece: a live Figma prototype that runs
 * inside the portfolio itself. Placed immediately after the hero so it is the
 * first thing a visitor meets after the opening statement.
 */
export function FeaturedPrototype() {
  const embed = figmaEmbedsBySlug["buffson-fitness-app"];
  if (!embed) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
      <Reveal className="lg:col-span-5">
        <span className="label-tech text-accent">{embed.eyebrow ?? "LIVE PROTOTYPE"}</span>
        <h2 className="display mt-4 text-4xl leading-[0.95] md:text-6xl">
          BUFFSON, <span className="text-accent">TAPABLE.</span>
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
          A fitness app I designed end to end in Figma - onboarding, plan, live set logging, streaks
          and progress. Not screenshots. The working prototype is embedded below and runs right here
          on the page. Click play and move through it the way you would on a phone.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ArrowLink href={embed.figmaUrl} tone="accent">
            Open in Figma
          </ArrowLink>
          <Link
            to="/work/$slug"
            params={{ slug: "buffson-fitness-app" }}
            data-cursor="READ"
            className="border border-border px-4 py-2 label-tech transition-colors hover:border-accent hover:text-accent"
          >
            Read the case study →
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-2 label-tech text-[10px] text-muted-foreground/70">
          {["PRODUCT DESIGN", "MOBILE UI", "DESIGN SYSTEM", "PROTOTYPING"].map((t) => (
            <span key={t} className="border border-border px-3 py-1.5">
              {t}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.08} className="lg:col-span-7">
        <div className="relative">
          <div className="mb-3 flex items-center justify-between gap-4">
            <span className="label-tech text-[10px] text-muted-foreground">
              BUFFSON FITNESS APP · FIGMA PROTO
            </span>
            <span className="tnum label-tech text-[10px] text-accent">v2 · UPDATED</span>
          </div>
          <FigmaPlayer
            src={embed.embedUrl}
            title={embed.title}
            eyebrow={embed.eyebrow ?? "FIGMA · LIVE PROTOTYPE"}
            aspect="aspect-[16/11]"
          />
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">
            Loads on click so the page stays fast. Once playing, click any frame or the left sidebar
            to walk the flows.
          </p>
        </div>
      </Reveal>
    </div>
  );
}
