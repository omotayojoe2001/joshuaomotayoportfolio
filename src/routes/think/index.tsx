import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, Section } from "@/components/site-sections";
import { ArticleList } from "@/components/article-list";
import { useArticles } from "@/lib/content";

export const Route = createFileRoute("/think/")({
  head: () => ({
    meta: [
      { title: "Think — The Journal · Joshua Omotayo" },
      {
        name: "description",
        content:
          "Writing, ideas and experiments on web development, AI, technology and building digital products.",
      },
      { property: "og:title", content: "Think — The Journal · Joshua Omotayo" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ThinkPage,
});

function ThinkPage() {
  const { data } = useArticles();
  const articles = data ?? [];
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) if (a.category) set.add(a.category);
    return Array.from(set).sort();
  }, [articles]);

  const filtered = category ? articles.filter((a) => a.category === category) : articles;

  return (
    <>
      <PageHeader
        index="03"
        eyebrow="THINK"
        title="THE JOURNAL"
        intro="Writing, ideas and experiments — web development, AI, technology and building."
      />
      <Section className="pt-0">
        {categories.length > 0 && (
          <div className="mb-12 flex flex-wrap gap-2">
            <FilterChip active={category === null} onClick={() => setCategory(null)}>
              All
            </FilterChip>
            {categories.map((c) => (
              <FilterChip key={c} active={category === c} onClick={() => setCategory(c)}>
                {c}
              </FilterChip>
            ))}
          </div>
        )}
        <ArticleList
          articles={filtered}
          emptyMessage={
            category
              ? "Nothing filed under this category yet."
              : "I'm writing. Check back soon."
          }
        />
      </Section>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-4 py-2 label-tech transition-colors ${
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border text-muted-foreground hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
