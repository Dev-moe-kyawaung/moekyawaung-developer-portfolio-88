import { useEffect, useState } from "react";
import { PROFILE } from "../data/portfolio";
import { Counter } from "./ui";

const ROLES = [
  "Senior Frontend Engineer",
  "PWA & Offline Systems Architect",
  "Canvas / WebGL Interface Craftsman",
  "POS & Commerce Platform Builder",
];

export default function Hero() {
  const [role, setRole] = useState("");
  const [ri, setRi] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const full = ROLES[ri];
    const speed = del ? 30 : 62;
    const id = setTimeout(() => {
      if (!del) {
        const nxt = full.slice(0, role.length + 1);
        setRole(nxt);
        if (nxt === full) setTimeout(() => setDel(true), 1600);
      } else {
        const nxt = full.slice(0, role.length - 1);
        setRole(nxt);
        if (nxt === "") { setDel(false); setRi((v) => (v + 1) % ROLES.length); }
      }
    }, speed);
    return () => clearTimeout(id);
  }, [role, del, ri]);

  return (
    <section id="top" className="relative min-h-[100svh] flex items-center pt-28 pb-20">
      <div className="mx-auto w-full max-w-6xl px-5 grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-center">
        {/* left */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full hairline bg-emerald-400/5 mb-7">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300" />
            </span>
            <span className="font-display text-[9px] tracking-[0.28em] text-emerald-200/80">
              QUANTUM STATE · AVAILABLE FOR WORK
            </span>
          </div>

          <div className="font-display text-[10px] tracking-[0.4em] text-cyan-300/60 mb-4">
            OBSERVER ID // {PROFILE.handle}
          </div>

          <h1 className="font-display text-[13vw] sm:text-6xl lg:text-7xl font-black leading-[0.92] q-glow">
            <span className="glitch q-grad block w-fit" data-text="MOE KYAW">MOE KYAW</span>
            <span className="glitch q-grad block w-fit" data-text="AUNG">AUNG</span>
          </h1>

          <div className="mt-6 h-7 font-display text-sm sm:text-base text-cyan-100/85">
            {role}
            <span className="caret text-emerald-300">▌</span>
          </div>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-cyan-100/58">
            {PROFILE.tagline}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#projects"
              className="font-display text-[11px] tracking-[0.22em] px-6 py-3.5 rounded corner-cut bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 text-black font-bold hover:shadow-[0_0_40px_rgba(34,211,238,0.55)] transition-shadow"
            >
              OBSERVE PROJECTS
            </a>
            <a
              href={PROFILE.githubOrg}
              target="_blank"
              rel="noreferrer"
              className="font-display text-[11px] tracking-[0.22em] px-6 py-3.5 rounded corner-cut hairline text-cyan-100 hover:bg-cyan-400/10 hover:border-cyan-300/50 transition"
            >
              GITHUB ↗
            </a>
            <a
              href="#contact"
              className="font-display text-[11px] tracking-[0.22em] px-6 py-3.5 rounded corner-cut hairline text-violet-200 hover:bg-violet-400/10 transition"
            >
              ENTANGLE
            </a>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PROFILE.stats.map((s) => (
              <div key={s.label} className="glass corner-cut px-4 py-3">
                <div className="font-display text-2xl q-grad font-bold">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[9px] tracking-[0.18em] text-cyan-300/50 mt-1">
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right — portrait node */}
        <div className="relative mx-auto w-full max-w-[380px] aspect-square">
          <div className="absolute inset-0 rounded-full border border-cyan-300/20 anim-spin-slow" style={{ borderStyle: "dashed" }} />
          <div className="absolute -inset-5 rounded-full border border-violet-400/12 anim-spin-rev" />
          <div className="absolute -inset-10 rounded-full border border-emerald-300/8 anim-spin-slow" />

          {/* orbiting qubits */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="absolute inset-0 anim-spin-slow" style={{ animationDuration: `${13 + i * 5}s`, animationDirection: i % 2 ? "reverse" : "normal" }}>
              <span
                className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full"
                style={{
                  top: `${-5 + i * 3}px`,
                  background: i % 2 ? "#7CFFB2" : "#22d3ee",
                  boxShadow: `0 0 16px ${i % 2 ? "#7CFFB2" : "#22d3ee"}`,
                }}
              />
            </div>
          ))}

          <div className="absolute inset-[9%] rounded-full overflow-hidden hairline scanlines"
            style={{ boxShadow: "0 0 80px rgba(34,211,238,0.22), inset 0 0 40px rgba(3,6,12,0.7)" }}>
            <img
              src={PROFILE.photo}
              alt={PROFILE.name}
              className="w-full h-full object-cover object-top"
              style={{ filter: "contrast(1.06) saturate(1.05)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#03060c] via-transparent to-cyan-400/10" />
            <div
              className="absolute left-0 right-0 h-16 pointer-events-none"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(124,255,178,0.18), transparent)",
                animation: "float-y 4s ease-in-out infinite",
                top: "40%",
              }}
            />
          </div>

          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass corner-cut px-4 py-2 whitespace-nowrap">
            <span className="font-display text-[9px] tracking-[0.24em] text-cyan-200/80">
              {PROFILE.location.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <a
        href="#core"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cyan-300/45 hover:text-cyan-200 transition"
      >
        <span className="font-display text-[8px] tracking-[0.3em]">SCROLL TO COLLAPSE</span>
        <span className="w-px h-10 bg-gradient-to-b from-cyan-300/60 to-transparent" />
      </a>
    </section>
  );
}
