import { useState } from "react";
import { useSpotlight } from "@/components/motion-primitives";

/**
 * Click-to-load Figma prototype player.
 *
 * The Figma embed runtime is heavy (multiple hundred KB plus its own network
 * fan-out). Mounting it on first paint would fight the site's performance work,
 * so we render a poster surface and only swap in the iframe once a visitor
 * explicitly clicks Play. The same pattern the YouTube section already uses.
 */
export function FigmaPlayer({
  src,
  title,
  eyebrow = "FIGMA · LIVE PROTOTYPE",
  className = "",
  aspect = "aspect-[16/10]",
}: {
  src: string;
  title: string;
  eyebrow?: string;
  className?: string;
  aspect?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const spotlight = useSpotlight();

  return (
    <div
      className={`relative overflow-hidden border border-border bg-black ${aspect} ${className}`}
    >
      {playing ? (
        <>
          <iframe
            src={src}
            title={`${title} interactive Figma prototype`}
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-end p-3">
            <button
              type="button"
              onClick={() => setPlaying(false)}
              data-cursor="CLOSE"
              aria-label={`Stop previewing ${title}`}
              className="pointer-events-auto border border-border bg-background/80 px-3 py-1.5 label-tech backdrop-blur transition-colors hover:border-accent hover:text-accent"
            >
              CLOSE ✕
            </button>
          </div>
        </>
      ) : (
        <button
          type="button"
          {...spotlight}
          onClick={() => setPlaying(true)}
          data-cursor="PLAY"
          className="spotlight group absolute inset-0 grid place-items-center text-center"
          aria-label={`Play the ${title} prototype`}
        >
          <div className="grid-bg absolute inset-0 opacity-70" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            aria-hidden
          />
          <div className="relative z-10 flex flex-col items-center gap-4 px-6">
            <span className="label-tech text-accent">{eyebrow}</span>
            <span className="display max-w-md text-3xl leading-tight md:text-4xl">{title}</span>
            <span className="mt-2 inline-flex items-center gap-3 border border-accent px-5 py-2.5 label-tech text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
              <span aria-hidden className="text-[10px]">
                ▶
              </span>
              PLAY PROTOTYPE
            </span>
            <span className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Runs right here. No download, no login.
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
