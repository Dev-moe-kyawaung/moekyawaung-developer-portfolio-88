import { useEffect, useState } from "react";

const LINKS = [
  { id: "core", label: "CORE" },
  { id: "projects", label: "NODES" },
  { id: "skills", label: "FIELDS" },
  { id: "timeline", label: "TIMELINE" },
  { id: "network", label: "NETWORK" },
  { id: "contact", label: "CONTACT" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [act, setAct] = useState("core");
  const [prog, setProg] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.body.scrollHeight - window.innerHeight;
      setProg(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setAct(e.target.id); });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[70] h-[2px] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-400"
          style={{ width: `${prog * 100}%`, boxShadow: "0 0 12px rgba(34,211,238,0.8)" }}
        />
      </div>

      <header
        className={`fixed top-0 left-0 right-0 z-[65] transition-all duration-500 ${
          scrolled ? "backdrop-blur-xl bg-[#03060c]/72 border-b border-cyan-300/10" : ""
        }`}
      >
        <nav className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="relative grid place-items-center w-8 h-8">
              <span className="absolute inset-0 rounded-md border border-cyan-300/40 rotate-45 group-hover:rotate-[135deg] transition-transform duration-700" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_#7CFFB2]" />
            </span>
            <span className="font-display text-[11px] tracking-[0.3em] text-cyan-100">MKA<span className="text-emerald-300">.</span>QM</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={`relative font-display text-[10px] tracking-[0.2em] px-3.5 py-2 rounded transition-colors ${
                  act === l.id ? "text-emerald-300" : "text-cyan-200/50 hover:text-cyan-100"
                }`}
              >
                {l.label}
                {act === l.id && (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-emerald-300 shadow-[0_0_10px_#7CFFB2]" />
                )}
              </a>
            ))}
          </div>

          <button
            onClick={() => setOpen((o) => !o)}
            className="md:hidden w-9 h-9 grid place-items-center hairline rounded text-cyan-200"
            aria-label="Menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </nav>

        {open && (
          <div className="md:hidden border-t border-cyan-300/10 bg-[#03060c]/95 backdrop-blur-xl">
            <div className="px-5 py-3 grid grid-cols-2 gap-1">
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className="font-display text-[10px] tracking-[0.2em] py-3 text-cyan-200/70 hover:text-emerald-300"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
