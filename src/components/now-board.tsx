import { motion, useReducedMotion } from "motion/react";
import { EmptyState } from "@/components/site-sections";
import { useNowItems } from "@/lib/content";

const STATUS_TONE: Record<string, string> = {
  BUILDING: "bg-accent",
  EXPLORING: "bg-primary",
  TEACHING: "bg-accent",
  LEARNING: "bg-primary",
  WRITING: "bg-accent",
  SHIPPING: "bg-accent",
};

function StatusDot({ status }: { status: string }) {
  const reduced = useReducedMotion();
  const tone = STATUS_TONE[status] ?? "bg-muted-foreground";
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      {!reduced && (
        <motion.span
          className={`absolute inline-flex h-full w-full rounded-full ${tone}`}
          animate={{ scale: [1, 2.4], opacity: [0.5, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
        />
      )}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${tone}`} />
    </span>
  );
}

/**
 * A live status board of what Joshua is currently doing.
 * Content is managed from the CMS (`now_items`).
 */
export function NowBoard() {
  const { data, isLoading } = useNowItems();

  if (isLoading) {
    return (
      <div className="rule grid gap-px border-x border-b border-border sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-6">
            <span className="h-2 w-2 animate-pulse rounded-full bg-border-strong" />
            <span className="h-3 w-40 animate-pulse bg-border" />
          </div>
        ))}
      </div>
    );
  }

  const items = data ?? [];
  if (items.length === 0) {
    return <EmptyState>Nothing logged right now. Check back soon.</EmptyState>;
  }

  return (
    <ul className="rule grid gap-px border-x border-b border-border sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="group flex items-center gap-4 bg-background p-6 transition-colors hover:bg-surface/50"
        >
          <StatusDot status={item.status} />
          <span className="text-sm text-foreground">{item.label}</span>
          <span className="ml-auto label-tech text-accent/80">{item.status}</span>
        </li>
      ))}
    </ul>
  );
}
