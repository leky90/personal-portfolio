"use client";

import { useEffect, useRef } from "react";
import { GalaxyCanvasLoader } from "@/features/concepts/ten-year-galaxy/components/galaxy-canvas-loader";
import {
  GALAXY_ERAS,
  STAR_COUNT,
  SUPERNOVAE,
  galaxyYearAt,
} from "@/features/concepts/ten-year-galaxy/lib/galaxy-data";
import {
  createGalaxyState,
  type GalaxyState,
} from "@/features/concepts/ten-year-galaxy/lib/galaxy-state";

/**
 * Layout DOM: hero + ticker năm aria-live + 4 section cánh tay era +
 * ADR note giải thích mapping tuần → sao (chống particle-field trang
 * trí). Cuộn là mũi tên thời gian.
 */
export function GalaxyExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);

  const galaxyStateRef = useRef<GalaxyState | null>(null);
  if (galaxyStateRef.current === null) {
    galaxyStateRef.current = createGalaxyState();
  }
  const galaxyState = galaxyStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      galaxyState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      galaxyState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      if (yearRef.current) {
        yearRef.current.textContent = `frontier ${galaxyYearAt(galaxyState.progress)}`;
      }
      galaxyState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [galaxyState]);

  return (
    <div ref={containerRef} className="relative">
      <GalaxyCanvasLoader
        galaxyStateRef={galaxyStateRef as { current: GalaxyState }}
        eventSourceRef={containerRef}
      />

      {/* Ticker frontier */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 rounded border border-neutral-800 bg-black/80 px-3 py-2 backdrop-blur">
        <p
          ref={yearRef}
          data-testid="galaxy-year"
          aria-live="polite"
          className="font-mono text-[11px] text-neutral-300"
        >
          frontier 2014
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#a78bfa] uppercase">
          2014 → 2026 · 4 cánh tay · cuộn là mũi tên thời gian
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          TWELVE-YEAR GALAXY
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Mười hai năm viết code kết tinh thành một dải ngân hà: mỗi
          tuần làm việc là một cụm sao, mỗi chặng nghề một cánh tay
          xoắn — freelance ở Huế, full-stack ở Synova, JavaScript ở
          TESO, DeFi ở Treehouse. Cuộn để frontier hình thành sao quét
          qua từng tuần theo đúng dòng thời gian; camera kéo dần ra và
          chỉ ở "hôm nay" cả hình xoắn ốc mới đọc được.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: thắp tuần đầu tiên của 2014
        </p>
      </section>

      {/* 4 SECTION CÁNH TAY ERA */}
      {GALAXY_ERAS.map((era, index) => (
        <section
          key={era.label}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#a78bfa] uppercase">
              cánh tay {index + 1}/4
            </p>
            <h3 className="mt-1 text-lg font-semibold text-neutral-100">
              {era.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {era.note}
            </p>
          </article>
        </section>
      ))}

      {/* ADR NOTE + CORE IDEA */}
      <section className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col items-center justify-center gap-6 px-4 sm:px-6">
        <div
          data-testid="galaxy-adr"
          className="w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/80 p-5"
        >
          <h4 className="font-mono text-xs tracking-[0.3em] text-[#a78bfa] uppercase">
            ADR · mapping dữ liệu, nói thẳng
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Dữ liệu per-commit 12 năm của repo công ty không tồn tại để
            công khai, nên mỗi ngôi sao đại diện một phần của ~626 tuần
            làm việc từ 2014 tới 2026, nở thành {STAR_COUNT} sao theo
            trọng số tuần; 10 supernova là milestone thật trong CV (
            {SUPERNOVAE[0].label}, {SUPERNOVAE[6].label}…). Mapping được
            giải thích thay vì giả vờ chính xác tuyệt đối — đó là ranh
            giới giữa data-viz và particle field trang trí.
          </p>
        </div>
        <div className="w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Kỹ thuật: {STAR_COUNT} sao trong đúng 1 Points draw call —
            hai vị trí (bụi trôi / xoắn ốc) đều là attribute, frontier
            ngưng tụ là một smoothstep quanh aBirth trong vertex shader,
            scrub cả thập kỷ chỉ là một lần ghi uniform; 10 supernova 1
            InstancedMesh loé khi frontier đi qua; không bloom, sprite
            mềm additive tự đủ. Frameloop demand: thiên hà đứng im là
            0% GPU.
          </p>
        </div>
      </section>
    </div>
  );
}
