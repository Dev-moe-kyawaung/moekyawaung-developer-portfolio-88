import { useEffect, useRef, useState } from "react";
import { DOMAINS, LOVABLE, PROFILE, SKILLS, TIMELINE } from "../data/portfolio";
import { Reveal, SectionTitle } from "./ui";
import FractalCore from "./FractalCore";

/* ------------------------------ CORE / ABOUT ------------------------------ */
export function CoreSection() {
  return (
    <section id="core" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionTitle
            index="01 / OBSERVATION"
            title="The Quantum Core"
            sub="Every interface I ship starts as a superposition of options. The core collapses them into one decision: the fastest, most resilient path to something a human can actually use."
          />
        </Reveal>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center">
          <Reveal className="flex justify-center">
            <div className="relative">
              <FractalCore size={310} />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass px-3 py-1.5 corner-cut">
                <span className="font-display text-[8px] tracking-[0.28em] text-cyan-200/70">JULIA SET · LIVE</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-5 text-[15px] leading-relaxed text-cyan-100/65">
              <p>
                I'm <span className="text-white font-medium">{PROFILE.name}</span> — a frontend engineer from Myanmar
                building senior-level web applications across commerce, media, dashboards and games. My work lives
                on <span className="text-emerald-300">40+ deployed domains</span> and{" "}
                <span className="text-cyan-300">120+ repositories</span>.
              </p>
              <p>
                My specialty is systems that must not break: offline-first POS terminals, real-time dashboards
                streaming thousands of points, installable PWAs that keep working when the network doesn't.
              </p>
              <p>
                I care about the physics of an interface — motion that has weight, states that are honest, and
                render loops that hold 60fps on a mid-tier Android phone.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 pt-3">
                {[
                  { k: "Discipline", v: "Frontend Architecture" },
                  { k: "Focus", v: "PWA · Offline · Performance" },
                  { k: "Toolchain", v: "React · TS · Tailwind · Canvas" },
                  { k: "Base", v: PROFILE.location },
                ].map((r) => (
                  <div key={r.k} className="glass corner-cut px-4 py-3">
                    <div className="text-[9px] tracking-[0.24em] text-cyan-300/45">{r.k.toUpperCase()}</div>
                    <div className="text-[13px] text-cyan-50/90 mt-1">{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- SKILLS --------------------------------- */
export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionTitle
            index="03 / FIELD STRENGTH"
            title="Probability Fields"
            sub="Measured amplitudes across the stack — each field calibrated by shipped production work, not tutorials."
          />
        </Reveal>

        <div ref={ref} className="grid md:grid-cols-2 gap-x-10 gap-y-7">
          {SKILLS.map((s, i) => (
            <div key={s.name} className="group">
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-display text-[12px] text-cyan-50/90">{s.name}</span>
                <span className="font-display text-[11px] text-emerald-300/80 tabular-nums">{s.level}%</span>
              </div>
              <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden hairline">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: on ? `${s.level}%` : "0%",
                    transition: `width 1.4s cubic-bezier(.2,.8,.2,1) ${i * 110}ms`,
                    background: `linear-gradient(90deg, hsl(${s.hue} 90% 55%), hsl(${s.hue + 45} 95% 68%))`,
                    boxShadow: `0 0 18px hsl(${s.hue} 95% 60% / 0.55)`,
                  }}
                />
                <div className="absolute inset-0 opacity-40"
                  style={{ backgroundImage: "repeating-linear-gradient(90deg, transparent 0 7px, rgba(0,0,0,.45) 7px 8px)" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid sm:grid-cols-3 gap-4">
          {[
            { t: "Offline-First", d: "Service workers, IndexedDB queues, conflict-safe sync.", i: "🛰️" },
            { t: "Real-Time", d: "WebSocket streams, optimistic UI, backpressure handling.", i: "📡" },
            { t: "Graphics", d: "Canvas engines, WebGL filters, particle & physics loops.", i: "🌌" },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 90}>
              <div className="glass corner-cut scanlines relative p-5 h-full hover:border-cyan-300/40 transition-colors">
                <div className="text-2xl mb-3">{c.i}</div>
                <div className="font-display text-[13px] text-white mb-2">{c.t}</div>
                <p className="text-[12.5px] text-cyan-100/60 leading-relaxed">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- TIMELINE -------------------------------- */
export function TimelineSection() {
  return (
    <section id="timeline" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionTitle
            index="04 / WORLD LINES"
            title="Decoherence Timeline"
            sub="Four collapse events that defined the trajectory."
          />
        </Reveal>

        <div className="relative pl-6 sm:pl-0">
          <div className="absolute left-[9px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent" />
          {TIMELINE.map((e, i) => (
            <Reveal key={e.year} delay={i * 90}>
              <div className={`relative flex sm:items-center mb-10 ${i % 2 ? "sm:flex-row-reverse" : ""}`}>
                <div className="hidden sm:block sm:w-1/2" />
                <span className="absolute left-[-14px] sm:left-1/2 sm:-translate-x-1/2 top-2 sm:top-1/2 sm:-translate-y-1/2 w-3.5 h-3.5 rounded-full bg-emerald-300 shadow-[0_0_20px_#7CFFB2] z-10" />
                <div className={`sm:w-1/2 ${i % 2 ? "sm:pr-10 sm:text-right" : "sm:pl-10"}`}>
                  <div className="glass corner-cut p-5 inline-block w-full">
                    <div className="font-display text-2xl q-grad font-bold">{e.year}</div>
                    <div className="font-display text-[12px] text-white mt-1">{e.title}</div>
                    <p className="text-[12.5px] text-cyan-100/60 mt-2 leading-relaxed">{e.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- NETWORK -------------------------------- */
export function NetworkSection() {
  return (
    <section id="network" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal>
          <SectionTitle
            index="05 / MULTIVERSE"
            title="Deployment Lattice"
            sub="Live surfaces across GitHub Pages and Lovable — every branch of the wave function has a URL."
          />
        </Reveal>
      </div>

      <Reveal>
        <div className="relative py-3 mb-4 border-y border-cyan-300/10">
          <div className="flex w-max anim-marquee gap-3">
            {[...DOMAINS, ...DOMAINS].map((d, i) => (
              <a
                key={i}
                href={`https://${d}.github.io/`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 font-display text-[10px] tracking-[0.14em] px-4 py-2 rounded-full hairline text-cyan-200/60 hover:text-emerald-300 hover:border-emerald-300/40 transition whitespace-nowrap"
              >
                {d}.github.io
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mx-auto max-w-6xl px-5 mt-10 grid md:grid-cols-2 gap-5">
        <Reveal>
          <div className="glass corner-cut scanlines p-6 h-full">
            <div className="font-display text-[11px] tracking-[0.24em] text-cyan-300/70 mb-4">
              LOVABLE DEPLOYMENTS
            </div>
            <div className="flex flex-wrap gap-2">
              {LOVABLE.map((l) => (
                <a
                  key={l}
                  href={`https://${l}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] px-3 py-1.5 rounded hairline text-violet-200/70 hover:text-white hover:bg-violet-400/10 transition"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={110}>
          <div className="glass corner-cut scanlines p-6 h-full flex flex-col justify-between">
            <div>
              <div className="font-display text-[11px] tracking-[0.24em] text-emerald-300/70 mb-4">
                PRIMARY CHANNELS
              </div>
              <div className="space-y-2.5 text-[13px]">
                <a href={PROFILE.github} target="_blank" rel="noreferrer" className="block link-hover text-cyan-100/80">
                  ▸ github.com/Dev-moe-kyawaung
                </a>
                <a href={PROFILE.githubOrg} target="_blank" rel="noreferrer" className="block link-hover text-cyan-100/80">
                  ▸ github.com/moekyawaung-tech
                </a>
                <a href={PROFILE.gravatar} target="_blank" rel="noreferrer" className="block link-hover text-cyan-100/80">
                  ▸ gravatar.com/moekyawaung2026
                </a>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { k: "DOMAINS", v: "43" },
                { k: "APPS", v: "60+" },
                { k: "UPTIME", v: "99.9%" },
              ].map((s) => (
                <div key={s.k} className="hairline rounded p-3 text-center">
                  <div className="font-display text-lg q-grad font-bold">{s.v}</div>
                  <div className="text-[8px] tracking-[0.2em] text-cyan-300/45 mt-1">{s.k}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------- CONTACT -------------------------------- */
export function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (v: string) => {
    navigator.clipboard?.writeText(v);
    setCopied(v);
    setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-5 text-center">
        <Reveal>
          <div className="font-display text-[10px] tracking-[0.34em] text-emerald-300/70 mb-4">
            06 / ENTANGLEMENT REQUEST
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black q-grad q-glow leading-[1.05]">
            LET'S COLLAPSE<br />A NEW PROJECT
          </h2>
          <p className="mt-6 text-[15px] text-cyan-100/60 max-w-xl mx-auto leading-relaxed">
            Available for senior frontend contracts, PWA rewrites, POS/commerce systems and
            graphics-heavy interface work.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            {PROFILE.phones.map((p) => (
              <button
                key={p}
                onClick={() => copy(p)}
                className="glass corner-cut px-5 py-4 hover:border-emerald-300/40 transition group"
              >
                <div className="text-[9px] tracking-[0.24em] text-cyan-300/45 mb-1">DIRECT LINE</div>
                <div className="font-display text-[13px] text-white">{p}</div>
                <div className="text-[9px] tracking-[0.2em] text-emerald-300/70 mt-1.5">
                  {copied === p ? "COPIED ✓" : "TAP TO COPY"}
                </div>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href={PROFILE.githubOrg}
              target="_blank"
              rel="noreferrer"
              className="font-display text-[11px] tracking-[0.22em] px-7 py-4 rounded corner-cut bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-300 text-black font-bold hover:shadow-[0_0_40px_rgba(34,211,238,0.55)] transition-shadow"
            >
              VIEW ALL REPOSITORIES ↗
            </a>
            <a
              href={PROFILE.gravatar}
              target="_blank"
              rel="noreferrer"
              className="font-display text-[11px] tracking-[0.22em] px-7 py-4 rounded corner-cut hairline text-cyan-100 hover:bg-cyan-400/10 transition"
            >
              GRAVATAR PROFILE
            </a>
          </div>
        </Reveal>
      </div>

      <footer className="mt-24 border-t border-cyan-300/10">
        <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-[9px] tracking-[0.24em] text-cyan-300/40">
            © 2026 MOE KYAW AUNG · QUANTUM MATRIX BUILD v3.0
          </span>
          <span className="font-display text-[9px] tracking-[0.24em] text-cyan-300/40">
            RENDERED IN SUPERPOSITION · REACT + CANVAS
          </span>
        </div>
      </footer>
    </section>
  );
}
