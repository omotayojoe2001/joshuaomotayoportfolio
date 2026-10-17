import { useReducedMotion } from "motion/react";

/**
 * The ambient field: one fixed, layered backdrop shared by every surface.
 *
 * Static depth glows, a halo that tracks the pointer through CSS variables
 * (compositor only, no React state), the measured columns of the container
 * grid and a grain pass. Nothing here moves on a timer, so it costs almost
 * nothing while scrolling.
 */
export function AmbientField() {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className="grain pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background: reduced
          ? undefined
          : `radial-gradient(90rem 60rem at 12% -10%, oklch(0.658 0.096 189 / 7%), transparent 60%),
             radial-gradient(70rem 50rem at 92% 110%, oklch(0.658 0.096 189 / 5%), transparent 60%)`,
      }}
    >
      {/* Pointer halo: transform-only so the value can update every frame for free. */}
      <div
        className="absolute left-0 top-0 h-[38rem] w-[38rem] rounded-full bg-primary/[0.09] blur-[120px] will-change-transform"
        style={{ transform: "translate3d(calc(var(--px) - 19rem), calc(var(--py) - 19rem), 0)" }}
      />

      {/* Measured columns: the container grid, extended past every page. */}
      <div className="absolute inset-0 mx-auto hidden h-full max-w-[88rem] border-x border-border/40 md:block" />
    </div>
  );
}
