import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  hud,
  hudIndex,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  hud?: string;
  hudIndex?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      data-hud={hud}
      data-hud-index={hudIndex}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Reveals a heading line-by-line with a clipping mask. */
export function LineReveal({
  lines,
  className,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line + i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduced ? false : { y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, delay: delay + i * 0.09, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Counter({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduced]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

/** Button/link wrapper that leans slightly toward the pointer. */
export function Magnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ display: "inline-block" }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.4 }}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({
          x: (e.clientX - (r.left + r.width / 2)) * strength,
          y: (e.clientY - (r.top + r.height / 2)) * strength,
        });
      }}
      onPointerLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </motion.span>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*#@%";

/**
 * Decodes a string from noise into its real characters. Used for machine-ish
 * labels: status lines, section eyebrows, the boot readout.
 */
export function ScrambleText({
  text,
  className,
  delay = 0,
  speed = 26,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = useReducedMotion();
  const [out, setOut] = useState(reduced ? text : "");

  useEffect(() => {
    if (!inView || reduced) {
      if (reduced) setOut(text);
      return;
    }
    let frame = 0;
    let timeout = 0;
    const start = window.setTimeout(() => {
      timeout = window.setInterval(() => {
        frame += 1;
        const settled = Math.floor(frame / 2);
        setOut(
          text
            .split("")
            .map((char, i) => {
              if (i < settled || char === " ") return char;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join(""),
        );
        if (settled >= text.length) window.clearInterval(timeout);
      }, speed);
    }, delay * 1000);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(timeout);
    };
  }, [inView, reduced, text, delay, speed]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out || text.replace(/[^ ]/g, "\u00A0")}</span>
    </span>
  );
}

/**
 * An infinite strip. Two identical copies travel one period, so the seam is
 * never visible and the animation is pure CSS (cheap while scrolling).
 */
export function Marquee({
  items,
  className,
  itemClassName,
  separator = "/",
  duration = 32,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  separator?: string;
  duration?: number;
}) {
  const copy = (ariaHidden: boolean) => (
    <div aria-hidden={ariaHidden} className="flex shrink-0">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={`flex shrink-0 items-center gap-6 whitespace-nowrap ${itemClassName ?? ""}`}
        >
          <span>{item}</span>
          <span className="text-accent/40">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`group flex overflow-hidden ${className ?? ""}`}>
      <div
        className="marquee-track group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  );
}

/**
 * Pointer-tracked light for a panel. Returns a single prop to spread on any
 * element carrying the `spotlight` utility: it writes element-local CSS
 * variables directly, so a grid of cards can glow independently without a
 * single state update.
 */
export function useSpotlight() {
  return {
    onPointerMove: (event: ReactPointerEvent<HTMLElement>) => {
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--sx", `${event.clientX - rect.left}px`);
      el.style.setProperty("--sy", `${event.clientY - rect.top}px`);
    },
  };
}

/**
 * Weighted 3D lean toward the pointer. Motion values keep it off the React
 * render path; the spring brings it back to flat on exit.
 */
export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 180, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), spring);

  return (
    <motion.div
      className={className}
      style={{
        transformPerspective: 1100,
        rotateX: reduced ? 0 : rotateX,
        rotateY: reduced ? 0 : rotateY,
      }}
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
