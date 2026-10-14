import { motion, useReducedMotion } from "motion/react";
import { ArrowLink, EmptyState } from "@/components/site-sections";
import { Reveal } from "@/components/motion-primitives";
import { useSettings, useVideos, type Video } from "@/lib/content";

function PlayGlyph() {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-accent bg-background/70 text-accent backdrop-blur transition-transform duration-500 group-hover:scale-110">
      <svg width="14" height="16" viewBox="0 0 14 16" fill="currentColor" aria-hidden>
        <path d="M0 0l14 8-14 8z" />
      </svg>
    </span>
  );
}

function VideoCard({ video }: { video: Video }) {
  return (
    <a
      href={video.video_url}
      target="_blank"
      rel="noreferrer"
      className="group block"
      aria-label={`Watch: ${video.title}`}
    >
      <div className="relative aspect-video overflow-hidden border border-border bg-surface">
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] group-hover:grayscale-0"
          />
        ) : (
          <div className="grid-bg h-full w-full" />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayGlyph />
        </div>
      </div>
      <h4 className="mt-4 text-base transition-colors group-hover:text-accent">{video.title}</h4>
      {video.description && (
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
      )}
    </a>
  );
}

/**
 * WATCH / LEARN — YouTube surface. The channel URL is configurable in the CMS
 * (site_settings.youtube_url); videos come from the `youtube_videos` table.
 */
export function VideoSection() {
  const { data: videos } = useVideos();
  const { data: settings } = useSettings();
  const reduced = useReducedMotion();
  const items = videos ?? [];
  const featured = items.find((v) => v.featured) ?? items[0];
  const rest = items.filter((v) => v.id !== featured?.id).slice(0, 3);
  const youtubeUrl = settings?.youtube_url || "";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="display max-w-xl text-4xl md:text-6xl">
          I BUILD IN PUBLIC.
          <br />
          <span className="text-accent">I TEACH IN PUBLIC.</span>
        </h2>
        {youtubeUrl ? (
          <ArrowLink href={youtubeUrl} tone="accent">
            Subscribe on YouTube
          </ArrowLink>
        ) : (
          <span className="label-tech text-muted-foreground/60">CHANNEL LINK COMING SOON</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-12">
          <EmptyState>Videos are coming soon.</EmptyState>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {featured && (
            <Reveal className="lg:col-span-7">
              <VideoCard video={featured} />
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
              {rest.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
