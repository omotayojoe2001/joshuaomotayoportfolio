import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion-primitives";
import { ArrowLink } from "@/components/site-sections";
import { PRODUCTS, type ProductVisual } from "@/lib/brand";
import { useBuildProducts, type BuildProduct } from "@/lib/content";

/** Unified shape used by the card — sourced from the CMS or the brand fallback. */
type DisplayProduct = {
  key: string;
  name: string;
  url: string;
  domain: string;
  position: string;
  description: string;
  cta: string;
  visual: ProductVisual;
  index: string;
  image?: string | null;
  status?: string | null;
};

const VISUALS: ProductVisual[] = ["business", "assistant", "impact"];

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function fromCms(p: BuildProduct, i: number): DisplayProduct {
  const visual: ProductVisual = VISUALS.includes(p.visual as ProductVisual)
    ? (p.visual as ProductVisual)
    : (VISUALS[i % VISUALS.length] ?? "business");
  return {
    key: p.id,
    name: p.name,
    url: p.url || "#",
    domain: hostOf(p.url || ""),
    position: p.position || "",
    description: p.description || "",
    cta: p.cta || `Visit ${p.name}`,
    visual,
    index: String(i + 1).padStart(2, "0"),
    image: p.image,
    status: p.status,
  };
}

function fromBrand(): DisplayProduct[] {
  return PRODUCTS.map((p) => ({
    key: p.domain,
    name: p.name,
    url: p.url,
    domain: p.domain,
    position: p.position,
    description: p.description,
    cta: p.cta,
    visual: p.visual,
    index: p.index,
    image: "",
    status: "LIVE",
  }));
}

/** Abstract, on-brand product visuals — no stock imagery, no fabricated UI copy. */
function Visual({ kind }: { kind: ProductVisual }) {
  const reduced = useReducedMotion();

  if (kind === "business") {
    const bars = [42, 66, 51, 84, 60, 96];
    return (
      <div className="flex h-full flex-col justify-end gap-4 p-6">
        <div className="flex items-end justify-between label-tech text-[10px]">
          <span>GROWTH</span>
          <span className="text-accent">+▲</span>
        </div>
        <div className="flex h-28 items-end gap-2">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary/40 to-accent/70"
              initial={reduced ? false : { height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: reduced ? `${h}%` : undefined }}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {["REVENUE", "PIPELINE", "TASKS"].map((l) => (
            <div key={l} className="border border-border bg-background/40 p-2">
              <div className="h-1 w-6 bg-foreground/20" />
              <div className="mt-2 label-tech text-[8px]">{l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "assistant") {
    return (
      <div className="flex h-full flex-col justify-center gap-3 p-6">
        <div className="max-w-[75%] self-start border border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground">
          How do I improve this week's posts?
        </div>
        <div className="max-w-[80%] self-end border border-accent/40 bg-accent/10 px-3 py-2">
          <div className="label-tech mb-1.5 text-[9px] text-accent">GENREV AI</div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-accent"
                animate={reduced ? { opacity: 0.7 } : { opacity: [0.3, 1, 0.3] }}
                transition={
                  reduced ? { duration: 0 } : { repeat: Infinity, duration: 1.2, delay: i * 0.2 }
                }
              />
            ))}
          </div>
        </div>
        <div className="mt-1 flex gap-2 label-tech text-[9px]">
          <span className="border border-border px-2 py-1">SCHEDULE</span>
          <span className="border border-border px-2 py-1">CAPTION</span>
          <span className="border border-border px-2 py-1">ANALYTICS</span>
        </div>
      </div>
    );
  }

  // impact — a human-centered network of connected nodes
  const nodes = [
    { x: 50, y: 22 },
    { x: 20, y: 50 },
    { x: 80, y: 46 },
    { x: 34, y: 80 },
    { x: 68, y: 78 },
  ];
  return (
    <div className="grid-bg relative flex h-full items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {nodes.slice(1).map((n, i) => (
          <motion.line
            key={i}
            x1={nodes[0]!.x}
            y1={nodes[0]!.y}
            x2={n.x}
            y2={n.y}
            stroke="var(--primary)"
            strokeWidth="0.4"
            strokeOpacity="0.5"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.8 }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={i === 0 ? 3.4 : 2.2}
            fill={i === 0 ? "var(--accent)" : "var(--surface-2)"}
            stroke="var(--accent)"
            strokeWidth="0.4"
            initial={reduced ? false : { scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 120, damping: 14 }}
            style={{ transformOrigin: `${n.x}px ${n.y}px` }}
          />
        ))}
      </svg>
      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 label-tech text-[9px] text-accent">
        COMMUNITY
      </span>
    </div>
  );
}

function ProductCard({ product, i }: { product: DisplayProduct; i: number }) {
  const flip = i % 2 === 1;
  return (
    <Reveal delay={i * 0.05}>
      <article className="rule grid gap-0 border-x border-b border-border md:grid-cols-2">
        <div
          className={`relative min-h-[280px] border-border bg-surface/40 md:min-h-[360px] ${
            flip ? "md:order-2 md:border-l" : "md:border-r"
          }`}
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Visual kind={product.visual} />
          )}
          <span className="absolute left-4 top-4 label-tech text-accent">{product.index}</span>
          {product.status && (
            <span className="absolute right-4 top-4 border border-accent/40 bg-background/70 px-2 py-1 label-tech text-[10px] text-accent backdrop-blur">
              {product.status}
            </span>
          )}
        </div>
        <div className="flex flex-col justify-center gap-5 p-7 md:p-10">
          <span className="label-tech text-accent">{product.position}</span>
          <h3 className="display text-4xl md:text-5xl">{product.name}</h3>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>
          {product.domain && (
            <span className="font-mono text-xs text-muted-foreground/70">{product.domain}</span>
          )}
          <div>
            <ArrowLink href={product.url} tone="accent">
              {product.cta}
            </ArrowLink>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function ProductShowcase() {
  const { data } = useBuildProducts();
  const cms = data ?? [];
  const products = cms.length > 0 ? cms.map(fromCms) : fromBrand();
  return (
    <div className="border-t border-border">
      {products.map((p, i) => (
        <ProductCard key={p.key} product={p} i={i} />
      ))}
    </div>
  );
}
