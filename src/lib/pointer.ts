/**
 * Pointer + scroll bus.
 *
 * One rAF-batched listener writes the live values onto :root as CSS variables
 * (--px, --py, --pxn, --pyn, --scroll). Consumers that need the raw numbers
 * (the cursor layer, the canvas field) subscribe imperatively instead of
 * putting per-frame state into React, so scrolling and hovering never cause a
 * re-render of the tree.
 */

export type PointerSample = { x: number; y: number; dx: number; dy: number };

type Listener = (sample: PointerSample) => void;

const listeners = new Set<Listener>();
const root = () => document.documentElement.style;

let sample: PointerSample = { x: 0, y: 0, dx: 0, dy: 0 };
let queued = false;
let installed = false;

function flush() {
  queued = false;
  const { innerWidth, innerHeight } = window;
  root().setProperty("--px", `${sample.x}px`);
  root().setProperty("--py", `${sample.y}px`);
  root().setProperty("--pxn", (sample.x / innerWidth - 0.5).toFixed(4));
  root().setProperty("--pyn", (sample.y / innerHeight - 0.5).toFixed(4));
  for (const listener of listeners) listener(sample);
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  sample = {
    x: event.clientX,
    y: event.clientY,
    dx: event.clientX - sample.x,
    dy: event.clientY - sample.y,
  };
  if (!queued) {
    queued = true;
    requestAnimationFrame(flush);
  }
}

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
  root().setProperty("--scroll", progress.toFixed(4));
}

/** Install the global listeners. Idempotent; returns a teardown for HMR. */
export function installPointerTracking() {
  if (installed || typeof window === "undefined") return () => {};
  installed = true;
  sample = { x: window.innerWidth / 2, y: window.innerHeight * 0.3, dx: 0, dy: 0 };
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  flush();
  onScroll();
  return () => {
    installed = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    listeners.clear();
  };
}

export function subscribePointer(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function currentPointer() {
  return sample;
}

/** True when the device has a real pointer, i.e. the cursor layer is worth drawing. */
export function hasFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}
