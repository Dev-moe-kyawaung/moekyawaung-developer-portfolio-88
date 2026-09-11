import { useEffect, useRef } from "react";

/**
 * Full-screen layered background:
 *  1. shifting matrix grid (perspective floor + ceiling)
 *  2. cascading data streams (katakana / hex rain)
 *  3. particle simulation with entanglement links + cursor field
 */
export default function QuantumField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;

    const GLYPHS = "アカサタナハマヤラワｦﾝ0123456789ABCDEF<>/{}[]=+*·";
    type Drop = { x: number; y: number; speed: number; len: number; size: number; hue: number };
    type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number; ph: number };

    let drops: Drop[] = [];
    let parts: P[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let scrollY = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const colW = 22;
      const cols = Math.floor(w / colW);
      drops = Array.from({ length: cols }, (_, i) => ({
        x: i * colW + colW / 2,
        y: Math.random() * -h,
        speed: 0.6 + Math.random() * 2.4,
        len: 8 + Math.floor(Math.random() * 20),
        size: 11 + Math.random() * 4,
        hue: Math.random() > 0.82 ? 280 : Math.random() > 0.4 ? 186 : 160,
      }));

      const count = Math.min(150, Math.floor((w * h) / 13000));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        r: 0.7 + Math.random() * 1.9,
        hue: 150 + Math.random() * 150,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => { mouse.active = false; mouse.x = -9999; mouse.y = -9999; };
    const onScroll = () => { scrollY = window.scrollY; };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    let t = 0;

    const drawGrid = () => {
      const off = (t * 0.35 + scrollY * 0.22) % 46;
      ctx.lineWidth = 1;

      // horizon-anchored floor
      const horizon = h * 0.62;
      ctx.strokeStyle = "rgba(34,211,238,0.055)";
      ctx.beginPath();
      for (let i = 0; i < 26; i++) {
        const p = (i * 46 + off) / (26 * 46);
        const y = horizon + Math.pow(p, 2.1) * (h - horizon) * 1.5;
        if (y > h) continue;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      ctx.strokeStyle = "rgba(168,85,247,0.05)";
      ctx.beginPath();
      const cx = w / 2 + Math.sin(t * 0.004) * w * 0.12;
      for (let i = -18; i <= 18; i++) {
        ctx.moveTo(cx + i * 26, horizon);
        ctx.lineTo(cx + i * 190, h);
      }
      ctx.stroke();

      // faint upper lattice
      ctx.strokeStyle = "rgba(90,180,255,0.035)";
      ctx.beginPath();
      const step = 64;
      const sx = -((t * 0.18) % step);
      for (let x = sx; x < w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, horizon); }
      for (let y = 0; y < horizon; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
      ctx.stroke();
    };

    const drawRain = () => {
      ctx.textAlign = "center";
      for (const d of drops) {
        for (let i = 0; i < d.len; i++) {
          const y = d.y - i * d.size * 1.18;
          if (y < -20 || y > h + 20) continue;
          const fade = 1 - i / d.len;
          const head = i === 0;
          ctx.font = `${head ? 700 : 400} ${d.size}px "Space Grotesk", monospace`;
          ctx.fillStyle = head
            ? `hsla(${d.hue}, 100%, 82%, 0.9)`
            : `hsla(${d.hue}, 95%, ${52 + fade * 18}%, ${fade * 0.3})`;
          const ch = GLYPHS[(Math.floor(y / 13) + Math.floor(t * 0.06) + d.len) % GLYPHS.length];
          ctx.fillText(ch, d.x, y);
        }
        d.y += d.speed;
        if (d.y - d.len * d.size * 1.2 > h) {
          d.y = -Math.random() * 200;
          d.speed = 0.6 + Math.random() * 2.4;
          d.len = 8 + Math.floor(Math.random() * 20);
        }
      }
    };

    const drawParticles = () => {
      // links
      for (let i = 0; i < parts.length; i++) {
        const a = parts[i];
        for (let j = i + 1; j < parts.length; j++) {
          const b = parts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 15000) {
            const o = (1 - d2 / 15000) * 0.24;
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 90%, 65%, ${o})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // nodes
      for (const p of parts) {
        p.ph += 0.02;
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 190 && d > 0.01) {
            const f = (1 - d / 190) * 0.9;
            p.vx += (dx / d) * f * 0.14;
            p.vy += (dy / d) * f * 0.14;
            ctx.strokeStyle = `hsla(186,100%,70%,${(1 - d / 190) * 0.3})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const rr = p.r * (1 + Math.sin(p.ph) * 0.35);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr * 5);
        g.addColorStop(0, `hsla(${p.hue}, 100%, 78%, 0.85)`);
        g.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, rr * 5, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      drawGrid();
      ctx.globalCompositeOperation = "lighter";
      drawRain();
      drawParticles();
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={ref} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 18% 8%, rgba(34,211,238,0.13), transparent 60%)," +
            "radial-gradient(900px 600px at 88% 22%, rgba(168,85,247,0.13), transparent 62%)," +
            "radial-gradient(1000px 800px at 50% 110%, rgba(16,185,129,0.10), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 bg-[#03060c]/35" />
    </div>
  );
}
