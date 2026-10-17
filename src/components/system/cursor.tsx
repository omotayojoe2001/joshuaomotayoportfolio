import { useEffect, useRef, useState } from "react";
import { subscribePointer, hasFinePointer, type PointerSample } from "@/lib/pointer";

/**
 * The system cursor.
 *
 * Two rings: one locked to the pointer, one trailing it on a spring so the
 * surface feels weighted. Interactive elements opt in with `data-cursor`
 * ("link", "view", "play", "drag" or any short label) and the ring resolves to
 * that word. Only mounted for fine pointers and only when the visitor has not
 * asked for reduced motion.
 */

const SIZES: Record<string, number> = { default: 26, link: 44, drag: 58 };

export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hasFinePointer() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot || !label) return;

    let target = { x: -100, y: -100 };
    const eased = { x: -100, y: -100 };
    let mode = "default";
    let raf = 0;

    const unsubPointer = subscribePointer((sample: PointerSample) => {
      target = { x: sample.x, y: sample.y };
      dot.style.transform = `translate3d(${sample.x}px, ${sample.y}px, 0) translate(-50%, -50%)`;
    });

    const tick = () => {
      eased.x += (target.x - eased.x) * 0.18;
      eased.y += (target.y - eased.y) * 0.18;
      ring.style.transform = `translate3d(${eased.x}px, ${eased.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Delegated hover read: one listener for the whole document.
    const resolve = (element: Element | null) => {
      const host = element?.closest<HTMLElement>("[data-cursor]");
      const next = host?.dataset["cursor"] ?? "";
      if (next === mode) return;
      mode = next || "default";
      const size = SIZES[mode] ?? SIZES["link"];
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.dataset["mode"] = next ? "active" : "idle";
      // Reserve the ring for actions, print the word for anything more specific.
      label.textContent = next && next !== "link" && next !== "drag" ? next : "";
    };

    const onOver = (event: PointerEvent) => resolve(event.target as Element | null);
    const onOut = () => resolve(null);
    const onDown = () => {
      ring.dataset["pressed"] = "true";
    };
    const onUp = () => {
      ring.dataset["pressed"] = "false";
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerleave", onOut);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onUp);
    document.body.classList.add("cursor-owned");
    setEnabled(true);

    return () => {
      unsubPointer();
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onOut);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      document.body.classList.remove("cursor-owned");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={ringRef}
        data-mode="idle"
        data-pressed="false"
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border border-accent/70 bg-accent/5 transition-[width,height,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] data-[mode=active]:bg-accent/15 data-[pressed=true]:scale-90"
        style={{ width: 26, height: 26, opacity: 0.9 }}
      >
        <span
          ref={labelRef}
          className="label-tech tnum text-[8px] uppercase tracking-[0.14em] text-accent"
        />
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1 w-1 rounded-full bg-accent mix-blend-screen"
      />
    </div>
  );
}
