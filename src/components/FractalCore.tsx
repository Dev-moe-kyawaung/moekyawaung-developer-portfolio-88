import { useEffect, useRef } from "react";

/** Animated Julia-set fractal rendered at low res and upscaled — the "quantum core". */
export default function FractalCore({ size = 300 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const N = 150; // internal resolution
    canvas.width = N;
    canvas.height = N;
    const ctx = canvas.getContext("2d")!;
    const img = ctx.createImageData(N, N);
    let raf = 0;
    let t = 0;
    let frame = 0;
    let visible = true;

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.02 });
    io.observe(canvas);

    const render = () => {
      const cr = 0.7885 * Math.cos(t);
      const ci = 0.7885 * Math.sin(t);
      const zoom = 1.55 + Math.sin(t * 0.7) * 0.22;
      const data = img.data;
      const maxIter = 46;

      for (let py = 0; py < N; py++) {
        const y0 = (py / N - 0.5) * 2 * zoom;
        for (let px = 0; px < N; px++) {
          const x0 = (px / N - 0.5) * 2 * zoom;
          let zx = x0;
          let zy = y0;
          let i = 0;
          while (zx * zx + zy * zy < 4 && i < maxIter) {
            const xt = zx * zx - zy * zy + cr;
            zy = 2 * zx * zy + ci;
            zx = xt;
            i++;
          }
          const o = (py * N + px) * 4;
          if (i === maxIter) {
            data[o] = 4; data[o + 1] = 8; data[o + 2] = 18; data[o + 3] = 220;
          } else {
            const m = i / maxIter;
            const s = Math.pow(m, 0.55);
            // cyan -> violet -> white ramp
            data[o] = Math.min(255, 40 * s + 210 * Math.pow(m, 3.2));
            data[o + 1] = Math.min(255, 235 * s * (0.5 + 0.5 * Math.cos(m * 3.1)) + 60 * m);
            data[o + 2] = Math.min(255, 150 + 105 * s);
            data[o + 3] = Math.min(255, 60 + 195 * s);
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    const loop = () => {
      frame++;
      if (visible && frame % 2 === 0) {
        t += 0.008;
        render();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <canvas
        ref={ref}
        className="absolute inset-0 w-full h-full rounded-full"
        style={{ filter: "blur(0.4px) saturate(1.35)", boxShadow: "0 0 90px rgba(34,211,238,0.28), inset 0 0 60px rgba(0,0,0,0.6)" }}
      />
      <div className="absolute inset-0 rounded-full border border-cyan-300/25 anim-spin-slow" style={{ borderStyle: "dashed" }} />
      <div className="absolute -inset-4 rounded-full border border-violet-400/15 anim-spin-rev" />
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 50%, transparent 52%, rgba(3,6,12,0.85) 78%)" }}
      />
    </div>
  );
}
