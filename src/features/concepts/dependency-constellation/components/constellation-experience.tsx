"use client";

import { useEffect, useRef } from "react";
import { ConstellationCanvasLoader } from "@/features/concepts/dependency-constellation/components/constellation-canvas-loader";
import { NODES } from "@/features/concepts/dependency-constellation/lib/constellation-data";
import {
  createConstellationState,
  type ConstellationState,
} from "@/features/concepts/dependency-constellation/lib/constellation-state";

const TERMINAL_DEFAULT = "$ pnpm why <chạm một ngôi sao>";

const GROUPS = [
  {
    kind: "role" as const,
    title: "5 chặng nghề · lõi chòm sao",
    note: "Từ freelance ở Huế năm 2014 tới lead frontend cho một nền tảng DeFi/RWA — mỗi chặng là một ngôi sao ấm ở vành trong, nơi mọi dự án được kéo về.",
  },
  {
    kind: "project" as const,
    title: "10 dự án · vành giữa",
    note: "Dự án là các gói đã publish của sự nghiệp: site WordPress khách, storefront eCommerce, marketplace nông sản, dApp staking tETH — mỗi cái khai báo chính xác nó phụ thuộc kỹ năng nào.",
  },
  {
    kind: "skill" as const,
    title: "12 công nghệ · vành ngoài",
    note: "Chạm một công nghệ trên canvas là chạy pnpm why: từ PHP/WordPress thời đầu tới Ethers.js hôm nay, mọi dự án từng kéo nó vào sáng lên theo đúng cạnh thật.",
  },
];

/**
 * Layout DOM: hero + terminal pnpm-why + 3 section vành đai. Hover node
 * trên canvas đẩy path phân giải vào terminal qua callback; click pin
 * lại để đọc. Không setState theo pointermove.
 */
export function ConstellationExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLParagraphElement>(null);

  const constellationStateRef = useRef<ConstellationState | null>(null);
  if (constellationStateRef.current === null) {
    constellationStateRef.current = createConstellationState();
  }
  const constellationState = constellationStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      constellationState.isMobile = window.matchMedia(
        "(max-width: 640px)",
      ).matches;
    }

    constellationState.setTerminal = (lines: string[]) => {
      const terminal = terminalRef.current;
      if (!terminal) return;
      terminal.textContent =
        lines.length > 0 ? lines.join("\n") : TERMINAL_DEFAULT;
      terminal.classList.toggle("text-[#38bdf8]", lines.length > 0);
      terminal.classList.toggle("text-neutral-400", lines.length === 0);
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      constellationState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      constellationState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      constellationState.setTerminal = null;
    };
  }, [constellationState]);

  return (
    <div ref={containerRef} className="relative">
      <ConstellationCanvasLoader
        constellationStateRef={
          constellationStateRef as { current: ConstellationState }
        }
        eventSourceRef={containerRef}
      />

      {/* Terminal pnpm-why */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/80 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={terminalRef}
          data-testid="why-terminal"
          className="max-h-28 overflow-hidden font-mono text-[11px] leading-relaxed whitespace-pre-line text-neutral-400"
        >
          {TERMINAL_DEFAULT}
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#38bdf8] uppercase">
          pnpm why trên 12 năm sự nghiệp
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          DEPENDENCY CONSTELLATION
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          2014 → 2026 render như một lockfile đã resolve: chặng nghề ở
          lõi, dự án vành giữa, công nghệ vành ngoài, nối bằng những cạnh
          phụ thuộc thật. Chạm một ngôi sao để chạy query: ánh sáng lan theo BFS
          từng tầng và terminal in đúng đường phân giải.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          rê lên một ngôi sao · click để pin query · cuộn để xoay chòm sao
        </p>
      </section>

      {/* 3 SECTION VÀNH ĐAI */}
      {GROUPS.map((group, index) => (
        <section
          key={group.kind}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#38bdf8] uppercase">
              {group.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {group.note}
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {NODES.filter((node) => node.kind === group.kind).map((node) => (
                <li
                  key={node.id}
                  className="font-mono text-[11px] text-neutral-500"
                >
                  {node.label}
                </li>
              ))}
            </ul>
          </article>
        </section>
      ))}

      {/* CORE IDEA */}
      <section className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col items-center justify-center px-4 sm:px-6">
        <div className="w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Khác demo living-topology (đồ thị mọc theo timeline), chòm
            sao này đã resolve xong từ frame đầu và chỉ trả lời query —
            đúng cách một lockfile hoạt động. Kỹ thuật: BFS bake từ dữ
            liệu thuần, layout ba vành deterministic không mô phỏng lực;
            27 sao 1 instanced draw call, 40 cạnh 1 LineSegments, bụi 1
            Points (~4 draw call); frameloop demand chỉ thức trong 1.1s
            ramp mỗi query rồi ngủ 0% GPU.
          </p>
        </div>
      </section>
    </div>
  );
}
