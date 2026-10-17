import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

type Hud = { index: string; label: string };

/**
 * Right-hand instrument rail: which section you are in, how far down the page
 * you are, and the local time at the studio. The fill and the marker read the
 * --scroll variable written by the pointer bus, so the rail moves on scroll
 * without a single React render.
 */
export function ScrollRail() {
  const [hud, setHud] = useState<Hud>({ index: "01", label: "STANDBY" });
  const [clock, setClock] = useState("");

  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Track whichever registered section is crossing the reading band.
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-hud]"));
    if (nodes.length === 0) {
      setHud({ index: "01", label: "STANDBY" });
      return;
    }

    const read = () => {
      const band = window.innerHeight * 0.42;
      let current = nodes[0]!;
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= band) current = node;
      }
      const index = current.dataset["hudIndex"] ?? "";
      const label = current.dataset["hud"] ?? "";
      setHud((prev) => (prev.index === index && prev.label === label ? prev : { index, label }));
    };

    read();
    const observer = new IntersectionObserver(read, { rootMargin: "-20% 0px -40% 0px" });
    nodes.forEach((node) => observer.observe(node));
    window.addEventListener("scroll", read, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", read);
    };
  }, [pathname]);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Africa/Lagos",
          hour12: false,
        }).format(new Date()),
      );
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-7 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-5 xl:flex"
    >
      <span className="label-tech tnum text-accent">{hud.index}</span>

      <div className="relative h-[34vh] w-px bg-border">
        <div
          className="absolute inset-x-0 top-0 origin-top bg-accent/70"
          style={{ height: "calc(var(--scroll) * 100%)" }}
        />
        <span
          className="absolute -left-[3.5px] h-[8px] w-[8px] rotate-45 border border-accent bg-background"
          style={{ top: "calc(var(--scroll) * 100%)" }}
        />
      </div>

      <span className="flex h-24 items-end overflow-hidden">
        <span
          key={hud.label}
          className="label-tech animate-[fade-up_0.5s_var(--ease-out-expo)] whitespace-nowrap [writing-mode:vertical-rl]"
        >
          {hud.label}
        </span>
      </span>

      <span className="label-tech tnum text-muted-foreground/70">WAT {clock}</span>
    </div>
  );
}
