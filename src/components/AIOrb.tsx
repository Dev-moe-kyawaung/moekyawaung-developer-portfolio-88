import { useCallback, useEffect, useRef, useState } from "react";
import { AI_DECISIONS } from "../data/portfolio";

type Burst = { x: number; y: number; vx: number; vy: number; life: number; max: number; hue: number; r: number };

export default function AIOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstsRef = useRef<Burst[]>([]);
  const pulseRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");

  const decision = AI_DECISIONS[idx];

  const emit = useCallback((strength = 1) => {
    const n = Math.floor(40 * strength);
    const cx = 110, cy = 110;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = (1 + Math.random() * 4.2) * strength;
      burstsRef.current.push({
        x: cx, y: cy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0,
        max: 40 + Math.random() * 45,
        hue: 150 + Math.random() * 160,
        r: 0.8 + Math.random() * 2.2,
      });
    }
    pulseRef.current = 1;
  }, []);

  // orb rendering
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const S = 220;
    canvas.width = S * dpr;
    canvas.height = S * dpr;
    ctx.scale(dpr, dpr);
    let raf = 0;
    let t = 0;

    const orbit = Array.from({ length: 34 }, (_, i) => ({
      a: (i / 34) * Math.PI * 2,
      rad: 42 + Math.random() * 28,
      sp: 0.006 + Math.random() * 0.016,
      tilt: Math.random() * Math.PI,
      hue: 150 + Math.random() * 160,
      sz: 0.8 + Math.random() * 1.8,
    }));

    const loop = () => {
      t += 1;
      ctx.clearRect(0, 0, S, S);
      const cx = S / 2, cy = S / 2;
      pulseRef.current *= 0.94;
      const pulse = pulseRef.current;

      ctx.globalCompositeOperation = "lighter";

      // core
      const coreR = 26 + Math.sin(t * 0.05) * 2 + pulse * 8;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 2.4);
      g.addColorStop(0, `rgba(230,255,255,${0.95})`);
      g.addColorStop(0.22, `rgba(34,211,238,${0.6 + pulse * 0.3})`);
      g.addColorStop(0.55, `rgba(168,85,247,0.26)`);
      g.addColorStop(1, "rgba(10,20,40,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR * 2.4, 0, Math.PI * 2);
      ctx.fill();

      // rotating rings
      for (let k = 0; k < 3; k++) {
        const rr = 44 + k * 15;
        const rot = t * (0.008 + k * 0.004) * (k % 2 ? -1 : 1);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(1, 0.32 + k * 0.16);
        ctx.strokeStyle = `hsla(${186 + k * 40}, 100%, 70%, ${0.3 + pulse * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, rr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // orbiting particles
      for (const o of orbit) {
        o.a += o.sp;
        const x = cx + Math.cos(o.a) * o.rad;
        const y = cy + Math.sin(o.a) * o.rad * (0.34 + Math.abs(Math.sin(o.tilt)) * 0.6);
        const gg = ctx.createRadialGradient(x, y, 0, x, y, o.sz * 4);
        gg.addColorStop(0, `hsla(${o.hue},100%,80%,0.9)`);
        gg.addColorStop(1, `hsla(${o.hue},100%,60%,0)`);
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(x, y, o.sz * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      // bursts
      const arr = burstsRef.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const b = arr[i];
        b.life += 1;
        b.x += b.vx;
        b.y += b.vy;
        b.vx *= 0.965;
        b.vy *= 0.965;
        const p = 1 - b.life / b.max;
        if (p <= 0) { arr.splice(i, 1); continue; }
        ctx.fillStyle = `hsla(${b.hue},100%,74%,${p * 0.85})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * p + 0.3, 0, Math.PI * 2);
        ctx.fill();
        if (b.life % 2 === 0) {
          ctx.strokeStyle = `hsla(${b.hue},100%,70%,${p * 0.25})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  // ambient emission
  useEffect(() => {
    const id = setInterval(() => emit(0.35), 3800);
    return () => clearInterval(id);
  }, [emit]);

  // typing effect
  useEffect(() => {
    if (!open) return;
    setTyped("");
    let i = 0;
    const full = decision.body;
    const id = setInterval(() => {
      i += 2;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [open, idx, decision.body]);

  const next = () => {
    setIdx((v) => (v + 1) % AI_DECISIONS.length);
    emit(1.2);
  };

  return (
    <div className="fixed z-50 right-3 bottom-3 sm:right-6 sm:bottom-6 flex flex-col items-end gap-3">
      {open && (
        <div className="glass corner-cut scanlines relative w-[min(90vw,360px)] p-5 shadow-[0_0_60px_rgba(34,211,238,0.18)]">
          <div className="flex items-center justify-between mb-3">
            <span className="font-display text-[10px] tracking-[0.28em] text-cyan-300/80">
              AI · ARCHITECTURE CORE
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-cyan-300/60 hover:text-cyan-200 text-xs leading-none px-2 py-1 hairline rounded"
              aria-label="Close AI orb panel"
            >
              ✕
            </button>
          </div>
          <div className="font-display text-base text-white mb-2">{decision.title}</div>
          <p className="text-[13px] leading-relaxed text-cyan-100/75 min-h-[76px]">
            {typed}
            <span className="caret text-cyan-300">▌</span>
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {decision.tags.map((tg) => (
              <span key={tg} className="text-[9px] tracking-widest px-2 py-1 rounded-full hairline text-emerald-300/80 bg-emerald-400/5">
                {tg.toUpperCase()}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-1">
              {AI_DECISIONS.map((_, i) => (
                <span key={i} className={`h-1 rounded-full transition-all ${i === idx ? "w-5 bg-cyan-300" : "w-1.5 bg-cyan-300/25"}`} />
              ))}
            </div>
            <button
              onClick={next}
              className="font-display text-[10px] tracking-[0.2em] px-3 py-1.5 rounded hairline text-cyan-200 hover:text-white hover:bg-cyan-400/10 transition"
            >
              NEXT DECISION →
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => { setOpen((o) => !o); emit(1.5); }}
        className="relative w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] anim-float group"
        aria-label="Toggle AI architecture orb"
      >
        <canvas
          ref={canvasRef}
          style={{ width: 220, height: 220 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        <span className="absolute inset-6 rounded-full border border-cyan-300/25 anim-ring pointer-events-none" />
        <span className="absolute inset-0 grid place-items-center font-display text-[9px] tracking-[0.22em] text-cyan-100/90 pointer-events-none">
          <span className="translate-y-[38px] opacity-70 group-hover:opacity-100 transition">
            {open ? "CORE" : "ASK AI"}
          </span>
        </span>
      </button>
    </div>
  );
}
