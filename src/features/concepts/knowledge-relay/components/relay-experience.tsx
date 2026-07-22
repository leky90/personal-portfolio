"use client";

import { useEffect, useRef } from "react";
import { RelayCanvasLoader } from "@/features/concepts/knowledge-relay/components/relay-canvas-loader";
import {
  BATONS,
  carriersAt,
  handedOffCount,
  type BatonDash,
} from "@/features/concepts/knowledge-relay/lib/relay-data";
import {
  createRelayState,
  relayYearFromProgress,
  type RelayState,
} from "@/features/concepts/knowledge-relay/lib/relay-state";

const DASH_GLYPH: Record<BatonDash, string> = {
  solid: "———",
  dashed: "– – –",
  dotted: "· · ·",
};

/**
 * Layout DOM: hero + bộ đếm relay + 5 section baton. Cuộn scrub mười
 * hai năm 2014→2026 (bốn chặng nghề thật); bộ đếm tính DOM-side từ
 * cùng dữ liệu với canvas nên không cần roundtrip callback.
 */
export function RelayExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);

  const relayStateRef = useRef<RelayState | null>(null);
  if (relayStateRef.current === null) {
    relayStateRef.current = createRelayState();
  }
  const relayState = relayStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      relayState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      relayState.year = relayYearFromProgress(progress);
      const counter = counterRef.current;
      if (counter) {
        counter.textContent = `năm ${Math.floor(relayState.year)} · đã trao gậy ${handedOffCount(relayState.year)} lần · ${carriersAt(relayState.year)} chặng đã mang practice`;
      }
      relayState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [relayState]);

  return (
    <div ref={containerRef} className="relative">
      <RelayCanvasLoader
        relayStateRef={relayStateRef as { current: RelayState }}
        eventSourceRef={containerRef}
      />

      {/* Bộ đếm relay */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/75 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={counterRef}
          data-testid="relay-counter"
          aria-live="polite"
          className="font-mono text-[11px] text-neutral-300"
        >
          năm 2014 · đã trao gậy 0 lần · {carriersAt(2014)} chặng đã mang
          practice
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#34d399] uppercase">
          Lane có thể chết · gậy thì không
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          KNOWLEDGE RELAY
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Mười hai năm nghề vẽ thành biểu đồ relay kiểu Marey: mỗi
          practice là một cây gậy phát sáng trao qua các lane cộng tác
          theo dòng thời gian — khách freelance ở Huế, Synova, TESO, rồi
          đội frontend Treehouse. Cuộn để chạy từ 2014 tới 2026: mỗi
          chặng lần lượt khép lại và lane của nó nguội đi, nhưng những
          cây gậy vẫn chạy tiếp — vì thứ senior để lại sống lâu hơn
          codebase.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: rèn cây gậy đầu tiên năm 2014
        </p>
      </section>

      {/* 5 SECTION BATON */}
      {BATONS.map((baton, index) => (
        <section
          key={baton.id}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#34d399] uppercase">
              gậy {index + 1}/5 · rèn {baton.forgedYear} ·{" "}
              {DASH_GLYPH[baton.dash]}
            </p>
            <h3 className="mt-1 font-mono text-xl text-neutral-100">
              {baton.label}
            </h3>
            <p className="mt-1 font-mono text-[11px] text-neutral-500">
              {baton.passes.length} chặng · {baton.passes.length - 1} lần trao
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {baton.note}
            </p>
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
            Cố tình KHÔNG phải một people-graph lực hút (đất đó bão hoà
            và trùng living-topology): đây là biểu đồ Marey, thứ ngôn
            ngữ timetable 140 năm tuổi. Kỹ thuật: mọi hành trình gậy
            merge vào 1 LineSegments duy nhất với aYear per vertex,
            fragment lộ vệt bằng step(aYear, uYear) — scrub trọn mười
            hai năm chỉ là một lần ghi uniform; 5 đầu gậy 1 InstancedMesh, lane
            1 LineSegments, ~4 draw call; frameloop demand, scrub-only,
            không ambient loop nên đứng yên là 0% GPU.
          </p>
        </div>
      </section>
    </div>
  );
}
