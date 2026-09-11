import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PROJECTS, type Project } from "../data/portfolio";

const CATS = ["All", "Commerce", "Dashboard", "App", "Game", "Media", "Utility"] as const;

export default function NodeGraph() {
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [hover, setHover] = useState<string | null>(null);
  const [active, setActive] = useState<Project | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [pts, setPts] = useState<Record<string, { x: number; y: number }>>({});
  const [box, setBox] = useState({ w: 0, h: 0 });

  const list = useMemo(
    () => (cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === cat)),
    [cat]
  );

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wb = wrap.getBoundingClientRect();
    const next: Record<string, { x: number; y: number }> = {};
    for (const p of list) {
      const el = nodeRefs.current[p.id];
      if (!el) continue;
      const b = el.getBoundingClientRect();
      next[p.id] = { x: b.left - wb.left + b.width / 2, y: b.top - wb.top + b.height / 2 };
    }
    setPts(next);
    setBox({ w: wb.width, h: wb.height });
  }, [list]);

  useLayoutEffect(() => { measure(); }, [measure]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    const id = setTimeout(measure, 350);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); clearTimeout(id); };
  }, [measure]);

  const edges = useMemo(() => {
    const ids = new Set(list.map((p) => p.id));
    const seen = new Set<string>();
    const out: { a: string; b: string }[] = [];
    for (const p of list) {
      for (const e of p.entangle) {
        if (!ids.has(e)) continue;
        const key = [p.id, e].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a: p.id, b: e });
      }
    }
    return out;
  }, [list]);

  return (
    <div className="relative">
      {/* filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`font-display text-[10px] tracking-[0.2em] px-4 py-2 rounded-full transition-all border ${
              cat === c
                ? "border-cyan-300/60 text-black bg-gradient-to-r from-cyan-300 to-emerald-300 shadow-[0_0_24px_rgba(34,211,238,0.4)]"
                : "border-cyan-300/15 text-cyan-200/60 hover:text-cyan-100 hover:border-cyan-300/40"
            }`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      <div ref={wrapRef} className="relative">
        {/* entanglement graph */}
        <svg
          className="absolute inset-0 pointer-events-none z-0 hidden sm:block"
          width={box.w}
          height={box.h}
          style={{ overflow: "visible" }}
        >
          <defs>
            <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="50%" stopColor="#7CFFB2" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="edgeGlow">
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {edges.map(({ a, b }, i) => {
            const pa = pts[a];
            const pb = pts[b];
            if (!pa || !pb) return null;
            const on = hover === a || hover === b;
            const mx = (pa.x + pb.x) / 2;
            const my = (pa.y + pb.y) / 2 - Math.abs(pa.x - pb.x) * 0.12 - 20;
            const d = `M ${pa.x} ${pa.y} Q ${mx} ${my} ${pb.x} ${pb.y}`;
            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke="url(#edgeGrad)"
                  strokeWidth={on ? 1.7 : 0.8}
                  opacity={hover ? (on ? 0.95 : 0.07) : 0.3}
                  filter={on ? "url(#edgeGlow)" : undefined}
                  strokeDasharray="6 10"
                  style={{ animation: `dash-flow ${on ? 6 : 14}s linear infinite`, transition: "opacity .35s, stroke-width .35s" }}
                />
                {on && (
                  <circle r="3" fill="#7CFFB2">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path={d} />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* nodes */}
        <div className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => {
            const rel = hover ? hover === p.id || p.entangle.includes(hover) : true;
            return (
              <div
                key={p.id}
                ref={(el) => { nodeRefs.current[p.id] = el; }}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setActive(p)}
                className={`group relative cursor-pointer glass corner-cut scanlines p-5 transition-all duration-500 ${
                  rel ? "opacity-100" : "opacity-30"
                } hover:-translate-y-1.5 hover:border-cyan-300/45 hover:shadow-[0_18px_60px_-18px_rgba(34,211,238,0.55)]`}
                style={{ transitionDelay: `${(i % 6) * 20}ms` }}
              >
                <div className="absolute top-0 left-0 h-px w-full overflow-hidden">
                  <div className="h-px w-1/3 bg-gradient-to-r from-transparent via-cyan-300 to-transparent anim-sweep" />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="relative grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15 hairline text-xl">
                      {p.icon}
                      <span className="absolute inset-0 rounded-xl border border-cyan-300/25 anim-ring" />
                    </span>
                    <div>
                      <div className="font-display text-[13px] text-white leading-tight">{p.name}</div>
                      <div className="text-[10px] tracking-[0.2em] text-cyan-300/50 mt-1">
                        Q-{String(p.index).padStart(2, "0")} · {p.category.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  {p.featured && (
                    <span className="text-[8px] font-display tracking-widest px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-300/25">
                      CORE
                    </span>
                  )}
                </div>

                <p className="text-[12.5px] leading-relaxed text-cyan-100/62 mt-4 line-clamp-3">{p.blurb}</p>

                <div className="flex flex-wrap gap-1.5 mt-4">
                  {p.stack.slice(0, 3).map((s) => (
                    <span key={s} className="text-[9px] tracking-wider px-2 py-1 rounded hairline text-cyan-200/60">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[9px] font-display tracking-[0.2em] text-violet-300/70">SPIN {p.spin}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-cyan-400"
                        style={{ width: `${p.coherence}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-cyan-300/60 tabular-nums">{p.coherence}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* detail overlay */}
      {active && (
        <div
          className="fixed inset-0 z-[60] grid place-items-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="glass corner-cut scanlines noise relative w-full max-w-lg p-7"
            onClick={(e) => e.stopPropagation()}
            style={{ boxShadow: "0 0 90px rgba(34,211,238,0.2)" }}
          >
            <button
              onClick={() => setActive(null)}
              className="absolute top-4 right-4 text-cyan-300/60 hover:text-white text-sm"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="text-4xl mb-3">{active.icon}</div>
            <div className="font-display text-2xl text-white mb-1">{active.name}</div>
            <div className="text-[10px] tracking-[0.28em] text-cyan-300/60 mb-5">
              NODE Q-{String(active.index).padStart(2, "0")} · {active.category.toUpperCase()} · COHERENCE {active.coherence}%
            </div>
            <p className="text-sm leading-relaxed text-cyan-100/75">{active.blurb}</p>
            <div className="grid grid-cols-2 gap-3 mt-6 text-[11px]">
              <div className="hairline rounded p-3">
                <div className="text-cyan-300/50 tracking-widest text-[9px] mb-1">STACK</div>
                <div className="text-cyan-100/80">{active.stack.join(" · ")}</div>
              </div>
              <div className="hairline rounded p-3">
                <div className="text-cyan-300/50 tracking-widest text-[9px] mb-1">ENTANGLED</div>
                <div className="text-cyan-100/80">{active.entangle.length} nodes</div>
              </div>
            </div>
            <a
              href={active.url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-display text-[11px] tracking-[0.22em] px-5 py-3 rounded bg-gradient-to-r from-cyan-300 to-emerald-300 text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition"
            >
              OPEN REPOSITORY ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
