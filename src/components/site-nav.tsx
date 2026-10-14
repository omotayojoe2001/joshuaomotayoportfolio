import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion-primitives";

const NAV = [
  { to: "/", label: "HOME", desc: "Back to the start" },
  { to: "/work", label: "WORK", desc: "Selected websites & digital experiences" },
  { to: "/build", label: "BUILD", desc: "Products I'm creating" },
  { to: "/think", label: "THINK", desc: "Writing, ideas & experiments" },
  { to: "/teach", label: "TEACH", desc: "Technology & AI education" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

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

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "border-b border-border bg-background/80 backdrop-blur-xl"
              : "border-b border-transparent"
          }`}
        >
          <nav
            aria-label="Primary"
            className="container-x flex h-16 items-center justify-between gap-6 md:h-20"
          >
            <Link
              to="/"
              className="font-display text-sm tracking-[0.2em] uppercase hover:text-accent transition-colors"
            >
              Joshua Omotayo
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
                  className="label-tech text-foreground/80 transition-colors hover:text-accent data-[status=active]:text-accent"
                >
                  {item.label}
                </Link>
              ))}
              <Magnetic>
                <Link
                  to="/contact"
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
                {NAV.map((item, i) => (
                  <motion.li
                    key={item.to}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-border py-4"
                  >
                    <Link to={item.to} className="block">
                      <span className="display block text-4xl">{item.label}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{item.desc}</span>
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="flex gap-6 py-4 label-tech"
                >
                  <Link to="/about">ABOUT</Link>
                  <Link to="/lab">THE LAB</Link>
                </motion.li>
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
