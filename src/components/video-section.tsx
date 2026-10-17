import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ArrowLink, EmptyState } from "@/components/site-sections";
import { Reveal, ScrambleText, useSpotlight } from "@/components/motion-primitives";
import { useSettings, useVideos, type Video } from "@/lib/content";
import { youTubeEmbed, youTubeId, youTubeThumb } from "@/lib/youtube";

function PlayGlyph({ large = false }: { large?: boolean }) {
  return (
    <span
      className={`relative flex items-center justify-center rounded-full border border-accent bg-background/70 text-accent backdrop-blur transition-transform duration-500 group-hover:scale-110 ${
        large ? "h-16 w-16" : "h-12 w-12"
      }`}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-accent/40 opacity-0 transition-all duration-700 group-hover:scale-125 group-hover:opacity-100"
      />
      <svg
        width={large ? 18 : 14}
        height={large ? 20 : 16}
        viewBox="0 0 14 16"
        fill="currentColor"
        aria-hidden
      >
        <path d="M0 0l14 8-14 8z" />
      </svg>
    </span>
  );
}

function VideoCard({
  video,
  index,
  total,
  featured,
  onPlay,
}: {
  video: Video;
  index: number;
  total: number;
  featured?: boolean;
  onPlay: () => void;
}) {
  const spotlight = useSpotlight();
  const poster = video.thumbnail || youTubeThumb(video.video_url);
  const id = youTubeId(video.video_url);

  return (
    <button
      type="button"
      onClick={onPlay}
      data-cursor="PLAY"
      {...spotlight}
      className="spotlight group block w-full text-left"
      aria-label={`Play lesson: ${video.title}`}
    >
      <div
        className={`relative overflow-hidden border border-border bg-surface ${
          featured ? "aspect-video" : "aspect-video"
        }`}
      >
        {poster ? (
          <img
            src={poster}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0"
          />
        ) : (
          <div className="grid-bg h-full w-full" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayGlyph large={!!featured} />
        </div>
        <span className="tnum absolute left-3 top-3 border border-border bg-background/70 px-2 py-1 label-tech text-[10px] text-accent backdrop-blur">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {id && (
          <span className="tnum absolute right-3 top-3 label-tech text-[10px] text-foreground/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {id}
          </span>
        )}
      </div>
      <h4 className="display mt-4 text-lg transition-colors group-hover:text-accent md:text-xl">
        {video.title}
      </h4>
      {video.description && (
        <p
          className={`mt-1 text-sm text-muted-foreground ${featured ? "line-clamp-3" : "line-clamp-2"}`}
        >
          {video.description}
        </p>
      )}
    </button>
  );
}

/**
 * WATCH / LEARN - the teaching surface. Lessons come from the `youtube_videos`
 * table and play in place: the visitor stays on the portfolio, the frame opens,
 * the lesson runs. The channel link stays configurable in the CMS.
 */
export function VideoSection() {
  const { data: videos } = useVideos();
  const { data: settings } = useSettings();
  const reduced = useReducedMotion();
  const [playing, setPlaying] = useState<Video | null>(null);

  const items = videos ?? [];
  const featured = items.find((video) => video.featured) ?? items[0];
  const rest = items.filter((video) => video.id !== featured?.id).slice(0, 3);
  const youtubeUrl = settings?.youtube_url || "";
  const embedId = playing ? youTubeId(playing.video_url) : null;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="display max-w-xl text-4xl md:text-6xl">
          I BUILD IN PUBLIC.
          <br />
          <span className="text-accent">I TEACH IN PUBLIC.</span>
        </h2>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <ScrambleText
            text={`${String(items.length).padStart(2, "0")} LESSONS LIVE`}
            className="label-tech tnum text-accent"
            speed={30}
          />
          {youtubeUrl ? (
            <ArrowLink href={youtubeUrl} tone="accent">
              Subscribe on YouTube
            </ArrowLink>
          ) : (
            <span className="label-tech text-muted-foreground/60">CHANNEL LINK COMING SOON</span>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-12">
          <EmptyState>Videos are coming soon.</EmptyState>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {featured && (
            <Reveal className="lg:col-span-7">
              <VideoCard
                video={featured}
                index={0}
                total={items.length}
                featured
                onPlay={() => setPlaying(featured)}
              />
            </Reveal>
          )}
          {rest.length > 0 && (
            <motion.div
              className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1"
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {rest.map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={i + 1}
                  total={items.length}
                  onPlay={() => setPlaying(video)}
                />
              ))}
            </motion.div>
          )}
        </div>
      )}

      <Dialog open={!!playing} onOpenChange={(next) => !next && setPlaying(null)}>
        <DialogContent className="max-w-5xl gap-0 overflow-hidden border-border-strong bg-black p-0 sm:rounded-none">
          <DialogTitle className="sr-only">{playing?.title ?? "Lesson"}</DialogTitle>
          <div className="relative aspect-video w-full bg-black">
            {embedId && (
              <iframe
                key={embedId}
                className="absolute inset-0 h-full w-full"
                src={youTubeEmbed(embedId)}
                title={playing?.title ?? "Lesson"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-background px-4 py-3 label-tech">
            <span className="text-foreground">{playing?.title}</span>
            {playing && (
              <a
                href={playing.video_url}
                target="_blank"
                rel="noreferrer"
                className="text-accent link-underline"
              >
                WATCH ON YOUTUBE →
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
