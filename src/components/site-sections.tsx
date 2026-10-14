import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Magnetic } from "@/components/motion-primitives";

export function Section({
  id,
  index,
  label,
  children,
  className = "",
}: {
  id?: string;
  index?: string;
  label?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`rule py-20 md:py-32 ${className}`}>
      <div className="container-x">
        {(index || label) && (
          <div className="mb-10 flex items-center gap-4 label-tech">
            {index && <span className="text-accent">{index}</span>}
            {label && <span>{label}</span>}
            <span className="h-px flex-1 bg-border" />
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export function ArrowLink({
  to,
  href,
  children,
  tone = "default",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  tone?: "default" | "accent";
}) {
  const cls = `group inline-flex items-center gap-3 border px-5 py-3 label-tech transition-colors ${
    tone === "accent"
      ? "border-accent text-accent hover:bg-accent hover:text-accent-foreground"
      : "border-border-strong text-foreground hover:border-accent hover:text-accent"
  }`;
  const inner = (
    <>
      {children}
      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </>
  );
  return (
    <Magnetic strength={0.18}>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className={cls}>
          {inner}
        </a>
      ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <Link to={to as any} className={cls}>
          {inner}
        </Link>
      )}
    </Magnetic>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rule flex min-h-40 items-center justify-center border-x border-b border-border p-10 text-center">
      <p className="max-w-md text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

export function PageHeader({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="container-x pt-32 pb-14 md:pt-44 md:pb-20">
      <div className="flex items-center gap-4 label-tech">
        <span className="text-accent">{index}</span>
        <span>{eyebrow}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
      <h1 className="display mt-8 text-[13vw] leading-[0.88] md:text-[7vw]">{title}</h1>
      {intro && (
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{intro}</p>
      )}
    </header>
  );
}
