import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion-primitives";
import { EmptyState } from "@/components/site-sections";
import type { Article } from "@/lib/content";

function formatDate(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** Large editorial treatment for a single featured article. */
export function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Reveal>
      <Link to="/think/$slug" params={{ slug: article.slug }} className="group block">
        <div className="relative aspect-[16/9] overflow-hidden border border-border bg-surface">
          {article.cover_image ? (
            <img
              src={article.cover_image}
              alt={article.title}
              loading="lazy"
              className="h-full w-full object-cover grayscale transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
            />
          ) : (
            <div className="grid-bg flex h-full w-full items-center justify-center">
              <span className="label-tech">FEATURED — {article.category ?? "WRITING"}</span>
            </div>
          )}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 label-tech">
          <span className="text-accent">FEATURED</span>
          {article.category && <span>{article.category.toUpperCase()}</span>}
          <span>{formatDate(article.published_at)}</span>
          <span>{article.reading_time} MIN READ</span>
        </div>
        <h3 className="display mt-3 text-3xl transition-colors group-hover:text-accent md:text-5xl">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        )}
      </Link>
    </Reveal>
  );
}

/** A single editorial row in the journal list. */
function ArticleRow({ article, i }: { article: Article; i: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: Math.min(i, 6) * 0.04 }}
    >
      <Link
        to="/think/$slug"
        params={{ slug: article.slug }}
        className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-t border-border py-6 transition-colors hover:bg-surface/30 md:grid-cols-12"
      >
        <div className="label-tech md:col-span-3">
          <span className="text-accent">{formatDate(article.published_at)}</span>
        </div>
        <div className="md:col-span-7">
          <h3 className="display text-2xl transition-colors group-hover:text-accent md:text-3xl">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{article.excerpt}</p>
          )}
        </div>
        <div className="flex items-center justify-between gap-4 label-tech md:col-span-2 md:justify-end">
          <span>{article.reading_time} MIN</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </Link>
    </motion.div>
  );
}

export function ArticleList({
  articles,
  emptyMessage = "I'm writing. Check back soon.",
}: {
  articles: Article[];
  emptyMessage?: string;
}) {
  if (articles.length === 0) return <EmptyState>{emptyMessage}</EmptyState>;

  const showFeatured = articles.find((a) => a.featured) ?? articles[0]!;
  const list = articles.filter((a) => a.id !== showFeatured.id);

  return (
    <div>
      <FeaturedArticle article={showFeatured} />
      {list.length > 0 && (
        <div className="mt-14">
          {list.map((a, i) => (
            <ArticleRow key={a.id} article={a} i={i} />
          ))}
          <div className="border-t border-border" />
        </div>
      )}
    </div>
  );
}
