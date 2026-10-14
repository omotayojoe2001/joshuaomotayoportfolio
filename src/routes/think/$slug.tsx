import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/lib/content";
import { ArrowLink } from "@/components/site-sections";
import { Reveal } from "@/components/motion-primitives";

export const Route = createFileRoute("/think/$slug")({
  loader: async ({ params }) => {
    try {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", params.slug)
        .eq("published", true)
        .maybeSingle();
      return { article: (data as Article | null) ?? null };
    } catch {
      return { article: null };
    }
  },
  head: ({ loaderData }) => {
    const a = loaderData?.article;
    const title = a ? `${a.title} · Joshua Omotayo` : "Journal · Joshua Omotayo";
    const description =
      a?.excerpt || "Writing, ideas and experiments on web development, AI and building.";
    const meta: Record<string, string>[] = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "article" },
    ];
    if (a?.cover_image) meta.push({ property: "og:image", content: a.cover_image });
    return { meta };
  },
  component: ArticlePage,
});

/** Minimal, dependency-free renderer for plain-text / light-markdown content. */
function Prose({ content }: { content: string }) {
  const blocks = content.split(/\n{2,}/).filter((b) => b.trim().length > 0);
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={i} className="display mt-10 text-3xl md:text-4xl">
              {trimmed.slice(3)}
            </h2>
          );
        }
        if (trimmed.startsWith("# ")) {
          return (
            <h2 key={i} className="display mt-10 text-3xl md:text-4xl">
              {trimmed.slice(2)}
            </h2>
          );
        }
        const lines = trimmed.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-3 text-base leading-relaxed text-muted-foreground">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {l.trim().slice(2)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

function ArticleVideo({ url }: { url: string }) {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  const isYouTube = !!m || /youtu\.?be\.com/i.test(url);
  return (
    <div className="container-x mt-12">
      <Reveal>
        <div className="overflow-hidden border border-border bg-surface">
          {isYouTube && m ? (
            <iframe
              title="Watch the full video"
              src={`https://www.youtube.com/embed/${m[1]}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-[16/9] h-full w-full"
            />
          ) : isYouTube ? (
            <video controls src={url} className="aspect-[16/9] h-full w-full bg-black" />
          ) : (
            <video controls src={url} className="aspect-[16/9] h-full w-full bg-black" />
          )}
        </div>
      </Reveal>
      {isYouTube && (
        <div className="mt-4">
          <ArrowLink href={url} tone="accent">
            Watch the full video on YouTube
          </ArrowLink>
        </div>
      )}
    </div>
  );
}

function ArticlePage() {
  const { article } = Route.useLoaderData();

  if (!article) {
    return (
      <div className="container-x flex min-h-[70vh] flex-col items-start justify-center pt-32">
        <span className="label-tech text-accent">JOURNAL</span>
        <h1 className="display mt-6 text-5xl md:text-7xl">NOT PUBLISHED YET.</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          This piece is still being written. Browse the journal in the meantime.
        </p>
        <div className="mt-8">
          <ArrowLink to="/think">Back to the journal</ArrowLink>
        </div>
      </div>
    );
  }

  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article>
      <header className="container-x pt-32 md:pt-44">
        <Link to="/think" className="label-tech link-underline text-accent">
          ← THINK
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 label-tech">
          {article.category && (
            <span className="text-accent">{article.category.toUpperCase()}</span>
          )}
          {date && <span>{date}</span>}
          <span>{article.reading_time} MIN READ</span>
        </div>
        <h1 className="display mt-6 max-w-4xl text-[11vw] leading-[0.92] md:text-[5.5vw]">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        )}
      </header>

      {article.cover_image && (
        <div className="container-x mt-12">
          <Reveal>
            <div className="overflow-hidden border border-border bg-surface">
              <img
                src={article.cover_image}
                alt={article.title}
                className="aspect-[16/9] h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      )}

      {article.video_url && <ArticleVideo url={article.video_url} />}

      <div className="container-x mt-14 md:mt-20">
        <div className="grid gap-10 md:grid-cols-12">
          <aside className="md:col-span-3">
            <div className="md:sticky md:top-28">
              {article.tags.length > 0 && (
                <>
                  <h2 className="label-tech text-accent">TAGS</h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {article.tags.map((t) => (
                      <li key={t} className="border border-border px-3 py-1.5 label-tech">
                        {t}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </aside>
          <div className="md:col-span-9">
            {article.content ? (
              <Prose content={article.content} />
            ) : (
              <p className="text-lg text-muted-foreground">
                This article's content is being finalized.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rule mt-20">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-16 md:py-24">
          <h2 className="display max-w-xl text-3xl md:text-5xl">READ MORE / SAY HELLO</h2>
          <div className="flex flex-wrap gap-3">
            <ArrowLink to="/think">The journal</ArrowLink>
            <ArrowLink to="/contact" tone="accent">
              Start a conversation
            </ArrowLink>
          </div>
        </div>
      </div>
    </article>
  );
}
