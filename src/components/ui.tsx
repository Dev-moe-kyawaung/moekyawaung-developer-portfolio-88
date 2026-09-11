import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: on ? 1 : 0,
        transform: on ? "none" : "translateY(34px) scale(0.985)",
        filter: on ? "none" : "blur(6px)",
        transition: `opacity .9s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform .9s cubic-bezier(.2,.7,.2,1) ${delay}ms, filter .9s ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function SectionTitle({
  index,
  title,
  sub,
}: { index: string; title: string; sub?: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-display text-[10px] tracking-[0.34em] text-emerald-300/70">{index}</span>
        <span className="h-px flex-1 max-w-[140px] bg-gradient-to-r from-emerald-300/50 to-transparent" />
      </div>
      <h2 className="font-display text-3xl sm:text-5xl font-bold q-grad q-glow leading-[1.05]">{title}</h2>
      {sub && <p className="mt-3 text-sm sm:text-base text-cyan-100/55 max-w-2xl leading-relaxed">{sub}</p>}
    </div>
  );
}

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1500;
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return <span ref={ref} className="tabular-nums">{v}{suffix}</span>;
}
