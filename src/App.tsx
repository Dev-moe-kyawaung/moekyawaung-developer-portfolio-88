import { useEffect, useState } from "react";
import QuantumField from "./components/QuantumField";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import NodeGraph from "./components/NodeGraph";
import AIOrb from "./components/AIOrb";
import { CoreSection, SkillsSection, TimelineSection, NetworkSection, ContactSection } from "./components/Sections";
import { Reveal, SectionTitle } from "./components/ui";

const BOOT = [
  "> initializing quantum matrix kernel ...",
  "> loading observer profile: MOE_KYAW_AUNG",
  "> mounting 24 project nodes ............ OK",
  "> entangling deployment lattice [43] ... OK",
  "> spinning up AI architecture core ..... OK",
  "> coherence stable — collapsing view",
];

function Boot({ done }: { done: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [out, setOut] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setLines(BOOT.slice(0, i));
      if (i >= BOOT.length) {
        clearInterval(id);
        setTimeout(() => setOut(true), 420);
        setTimeout(done, 1100);
      }
    }, 230);
    return () => clearInterval(id);
  }, [done]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-[#03060c] grid place-items-center px-6 transition-all duration-700"
      style={{ opacity: out ? 0 : 1, clipPath: out ? "inset(50% 0 50% 0)" : "inset(0 0 0 0)" }}
    >
      <div className="w-full max-w-md">
        <div className="font-display text-[10px] tracking-[0.4em] text-emerald-300/70 mb-5">QUANTUM BOOT</div>
        <div className="space-y-1.5 font-mono text-[11px] text-cyan-200/70 min-h-[130px]">
          {lines.map((l, i) => (
            <div key={i} style={{ animation: "float-y .4s ease" }}>
              {l}
              {i === lines.length - 1 && <span className="caret text-emerald-300"> ▌</span>}
            </div>
          ))}
        </div>
        <div className="mt-6 h-[3px] rounded-full bg-white/8 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-300 to-cyan-300 transition-all duration-300"
            style={{ width: `${(lines.length / BOOT.length) * 100}%`, boxShadow: "0 0 14px #22d3ee" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [booting, setBooting] = useState(true);

  return (
    <div className="relative min-h-screen noise">
      {booting && <Boot done={() => setBooting(false)} />}
      <QuantumField />
      <Nav />

      <main className="relative z-10">
        <Hero />
        <CoreSection />

        <section id="projects" className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-5">
            <Reveal>
              <SectionTitle
                index="02 / NODE ARRAY"
                title="Entangled Project Nodes"
                sub="24 production builds arranged as a quantum graph. Hover a node to reveal its entanglements — click to collapse the wave function and inspect the build."
              />
            </Reveal>
            <NodeGraph />
          </div>
        </section>

        <SkillsSection />
        <TimelineSection />
        <NetworkSection />
        <ContactSection />
      </main>

      <AIOrb />
    </div>
  );
}
