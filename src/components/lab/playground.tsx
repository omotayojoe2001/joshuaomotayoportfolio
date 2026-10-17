import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * The Lab's live canvas: a pointer-reactive particle field.
 *
 * Everything runs on the canvas 2D context inside a single rAF loop, so the
 * React tree never re-renders per frame. The only state that reaches React is
 * the throttled readout (FPS / count) and the user-chosen mode, both of which
 * change at human speed. The field reads the live theme accent straight off
 * :root so it always matches the rest of the machine.
 */

type Mode = "ATTRACT" | "REPEL" | "ORBIT";
const MODES: Mode[] = ["ATTRACT", "REPEL", "ORBIT"];

type Particle = { x: number; y: number; vx: number; vy: number };

function readAccent(): string {
  if (typeof window === "undefined") return "#3ddad7";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
  return v || "#3ddad7";
}

function Playground() {
  const reduced = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const pointer = useRef({ x: 0, y: 0, active: false });
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const modeRef = useRef<Mode>("ATTRACT");
  const rafRef = useRef(0);

  const [mode, setMode] = useState<Mode>("ATTRACT");
  const [readout, setReadout] = useState({ fps: 0, count: 0 });

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const seed = useCallback((w: number, h: number) => {
    // Density scales with area but stays cheap (constellation is O(n^2)).
    const target = Math.round(Math.min(130, Math.max(46, (w * h) / 15000)));
    const list: Particle[] = [];
    for (let i = 0; i < target; i++) {
      list.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }
    particles.current = list;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const accent = readAccent();
    const R = 190; // pointer influence radius (css px)
    const LINK = 108; // constellation link distance

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      size.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w, h);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const step = () => {
      const { w, h } = size.current;
      const ps = particles.current;
      const p = pointer.current;
      const m = modeRef.current;

      ctx.clearRect(0, 0, w, h);

      // Integrate + pointer force.
      for (const q of ps) {
        if (p.active) {
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < R) {
            const falloff = (1 - dist / R) * 0.06;
            const nx = dx / dist;
            const ny = dy / dist;
            if (m === "ATTRACT") {
              q.vx += nx * falloff;
              q.vy += ny * falloff;
            } else if (m === "REPEL") {
              q.vx -= nx * falloff * 1.8;
              q.vy -= ny * falloff * 1.8;
            } else {
              // ORBIT: tangential force + slight inward pull keeps a vortex.
              q.vx += -ny * falloff * 1.6 + nx * falloff * 0.3;
              q.vy += nx * falloff * 1.6 + ny * falloff * 0.3;
            }
          }
        }
        q.vx *= 0.96;
        q.vy *= 0.96;
        // Keep a little ambient drift alive.
        q.vx += (Math.random() - 0.5) * 0.012;
        q.vy += (Math.random() - 0.5) * 0.012;
        q.x += q.vx;
        q.y += q.vy;

        if (q.x < 0) q.x += w;
        else if (q.x > w) q.x -= w;
        if (q.y < 0) q.y += h;
        else if (q.y > h) q.y -= h;
      }

      // Constellation links.
      ctx.lineWidth = 1;
      for (let i = 0; i < ps.length; i++) {
        const a = ps[i]!;
        for (let j = i + 1; j < ps.length; j++) {
          const b = ps[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.globalAlpha = (1 - d / LINK) * 0.32;
            ctx.strokeStyle = accent;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Nodes (brighter near the pointer).
      for (const q of ps) {
        const near = p.active ? 1 - Math.min(Math.hypot(p.x - q.x, p.y - q.y) / R, 1) : 0;
        ctx.globalAlpha = 0.45 + near * 0.55;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 1.4 + near * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    if (reduced) {
      // Static single frame, no continuous animation.
      step();
    } else {
      let frames = 0;
      let last = performance.now();
      const loop = (now: number) => {
        step();
        frames++;
        if (now - last >= 800) {
          setReadout({
            fps: Math.round((frames * 1000) / (now - last)),
            count: particles.current.length,
          });
          frames = 0;
          last = now;
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [reduced, seed]);

  const localPoint = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  return (
    <div
      ref={wrapRef}
      className="scanlines relative h-[52vh] min-h-[380px] w-full overflow-hidden border border-border bg-surface/20"
      onPointerMove={(e) => {
        if (e.pointerType === "touch") return;
        const pt = localPoint(e.clientX, e.clientY);
        pointer.current = { x: pt.x, y: pt.y, active: true };
      }}
      onPointerLeave={() => {
        pointer.current.active = false;
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* Instrument overlay */}
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-start justify-between">
          <div className="label-tech text-muted-foreground/60">LIVE CANVAS · PARTICLE FIELD</div>
          <div className="label-tech flex gap-4 text-muted-foreground/60">
            <span className="tnum">{reduced ? "STATIC" : `${readout.fps} FPS`}</span>
            <span className="tnum">{String(readout.count).padStart(3, "0")} NODES</span>
          </div>
        </div>

        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              data-cursor="MODE"
              onClick={() => {
                setMode(m);
                // Give the field a small impulse so the mode switch is felt.
                for (const q of particles.current) {
                  q.vx += (Math.random() - 0.5) * 1.6;
                  q.vy += (Math.random() - 0.5) * 1.6;
                }
              }}
              aria-pressed={mode === m}
              className={`border px-3 py-1.5 label-tech transition-colors ${
                mode === m
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {m}
            </button>
          ))}
          <span className="label-tech ml-2 hidden text-muted-foreground/50 sm:inline">
            MOVE YOUR POINTER OVER THE FIELD
          </span>
        </div>
      </div>
    </div>
  );
}

export { Playground };
