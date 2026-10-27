import { useEffect, useRef, useState } from "react";
import { useSpotlight } from "@/components/motion-primitives";

/**
 * Click-to-load Figma prototype player.
 *
 * Figma's embed runtime is heavy: their WebGL engine plus the design file
 * itself can take a minute or two to paint the first frame. Mounting the
 * iframe on first page paint would fight the site's performance work, so we
 * render a poster surface and only swap in the iframe once a visitor clicks
 * Play. Once mounted the iframe stays alive (hidden when "closed") so
 * re-opening in the same session is instant, and a clear loading state covers
 * the wait so the frame never looks broken.
 */
export function FigmaPlayer({
  src,
  title,
  eyebrow = "FIGMA · LIVE PROTOTYPE",
  fallbackUrl,
  className = "",
  aspect = "aspect-[16/10]",
}: {
  src: string;
  title: string;
  eyebrow?: string;
  fallbackUrl?: string;
  className?: string;
  aspect?: string;
}) {
  // `mounted`: iframe exists in the DOM (survives close so re-open is instant).
  // `playing`: iframe is visible; poster is hidden.
  // `booted`:  iframe's onLoad fired; hide our loading overlay.
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [booted, setBooted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spotlight = useSpotlight();

  // Tick the "still waiting" hint so a slow boot reads as progress, not failure.
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (!playing || booted) return;
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [playing, booted]);

  const showLoader = playing && !booted;

  const start = () => {
    setMounted(true);
    setPlaying(true);
  };

  const hint =
    elapsed < 3
      ? "Starting Figma runtime..."
      : elapsed < 12
        ? "Loading prototype assets..."
        : elapsed < 30
          ? "Figma is warming up. This can take a minute."
          : "Still loading. You can wait, or open directly in Figma.";

  return (
    <div
      className={`relative overflow-hidden border border-border bg-black ${aspect} ${className}`}
    >
      {mounted && (
        <iframe
          src={src}
          title={`${title} interactive Figma prototype`}
          allowFullScreen
          onLoad={() => setBooted(true)}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            playing ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      )}

      {showLoader && (
        <div
          aria-live="polite"
          className="absolute inset-0 grid place-items-center bg-black/85 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-4 px-6 text-center">
            <span className="label-tech text-accent">LOADING FIGMA</span>
            <span
              aria-hidden
              className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent"
            />
            <span className="max-w-xs text-sm leading-relaxed text-muted-foreground">{hint}</span>
            {elapsed >= 20 && fallbackUrl && (
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="OPEN"
                className="border border-accent px-4 py-2 label-tech text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                OPEN IN FIGMA →
              </a>
            )}
          </div>
        </div>
      )}

      {playing && !showLoader && (
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-end p-3">
          <button
            type="button"
            onClick={() => setPlaying(false)}
            data-cursor="CLOSE"
            aria-label={`Hide prototype preview`}
            className="pointer-events-auto border border-border bg-background/80 px-3 py-1.5 label-tech backdrop-blur transition-colors hover:border-accent hover:text-accent"
          >
            CLOSE ✕
          </button>
        </div>
      )}

      {!playing && (
        <button
          type="button"
          {...spotlight}
          onClick={start}
          data-cursor="PLAY"
          className="spotlight group absolute inset-0 grid place-items-center text-center"
          aria-label={mounted ? `Resume ${title} prototype` : `Play the ${title} prototype`}
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
              {mounted ? "RESUME PROTOTYPE" : "PLAY PROTOTYPE"}
            </span>
            <span className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              {mounted
                ? "Already loaded. Click to jump back in instantly."
                : "Runs right here. First play takes a minute, after that it is instant."}
            </span>
          </div>
        </button>
      )}
    </div>
  );
}
