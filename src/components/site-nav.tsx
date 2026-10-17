import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion-primitives";
import { OPEN_PALETTE } from "@/components/system/command-palette";

const NAV = [
  { to: "/", label: "HOME", desc: "Back to the start" },
  { to: "/work", label: "WORK", desc: "Selected websites & digital experiences" },
  { to: "/build", label: "BUILD", desc: "Products I'm creating" },
  { to: "/think", label: "THINK", desc: "Writing, ideas & experiments" },
  { to: "/teach", label: "TEACH", desc: "Technology & AI education" },
] as const;

const SECONDARY = [
  { to: "/about", label: "ABOUT", desc: "The person behind the work" },
  { to: "/lab", label: "THE LAB", desc: "Live experiments, unfinished on purpose" },
] as const;

/** macOS shows ⌘, every other keyboard shows CTRL. Resolved after mount so the
 * server-rendered markup and the client always agree. */
function useAppleKeyboard() {
  const [apple, setApple] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent + " " + (navigator.platform ?? "");
    setApple(/Mac|iPhone|iPad|iPod/.test(ua));
  }, []);
  return apple;
}

function openPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE));
}

function LagosClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Africa/Lagos",
          hour12: false,
        }).format(new Date()),
      );
    format();
    const id = window.setInterval(format, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="label-tech tnum hidden text-muted-foreground/70 lg:inline">LAGOS {time}</span>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const appleKeys = useAppleKeyboard();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`relative transition-all duration-500 ${
            scrolled
              ? "border-b border-border bg-background/80 backdrop-blur-xl"
              : "border-b border-transparent"
          }`}
        >
          <nav
            aria-label="Primary"
            className="container-x flex h-16 items-center justify-between gap-6 md:h-20"
          >
            <Link to="/" data-cursor="HOME" className="group flex items-center gap-3">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span className="font-display text-sm tracking-[0.2em] uppercase transition-colors group-hover:text-accent">
                Joshua Omotayo
              </span>
            </Link>

            <div
              className="hidden items-center gap-8 md:flex"
              onMouseLeave={() => setHovered(null)}
            >
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onMouseEnter={() => setHovered(item.label)}
                  data-cursor="link"
                  className="label-tech relative py-2 text-foreground/80 transition-colors hover:text-accent data-[status=active]:text-accent"
                >
                  {item.label}
                  {isActive(item.to) && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-px left-0 h-px w-full bg-accent"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </Link>
              ))}

              <button
                type="button"
                onClick={openPalette}
                data-cursor="OPEN"
                aria-label="Open command palette"
                className="label-tech hidden items-center gap-2 border border-border px-2.5 py-1.5 text-muted-foreground transition-colors hover:border-accent hover:text-accent lg:flex"
              >
                <kbd className="tnum font-mono">{appleKeys ? "⌘" : "CTRL"}</kbd>
                <span>K</span>
              </button>

              <LagosClock />

              <Magnetic>
                <Link
                  to="/contact"
                  data-cursor="START"
                  className="group inline-flex items-center gap-2 border border-border-strong px-4 py-2 label-tech text-foreground transition-colors hover:border-accent hover:text-accent"
                >
                  Let's build
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </Magnetic>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="label-tech text-foreground md:hidden"
            >
              {open ? "CLOSE" : "MENU"}
            </button>
          </nav>

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="hidden border-t border-border bg-background/80 backdrop-blur-xl md:block"
              >
                <p className="container-x py-2 label-tech text-accent">
                  {NAV.find((n) => n.label === hovered)?.desc}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll read: one hairline, drawn straight from the pointer bus. */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 h-px w-full origin-left bg-accent/80"
            style={{ transform: "scaleX(var(--scroll))" }}
          />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-background pt-24 pb-10 md:hidden"
          >
            <div className="container-x flex flex-1 flex-col">
              <ul className="flex-1 space-y-1">
                {[...NAV, ...SECONDARY].map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-border py-4"
                  >
                    <Link to={item.to} className="block">
                      <span className="flex items-baseline gap-4">
                        <span className="label-tech shrink-0 text-accent">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="display text-4xl">{item.label}</span>
                      </span>
                      <span className="mt-1 block pl-10 text-sm text-muted-foreground">
                        {item.desc}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="mt-6 flex items-center justify-between border border-accent px-5 py-4 text-accent label-tech"
              >
                Start a conversation <span>→</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
