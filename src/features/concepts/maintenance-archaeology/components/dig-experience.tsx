"use client";

import { useEffect, useRef } from "react";
import { DigCanvasLoader } from "@/features/concepts/maintenance-archaeology/components/dig-canvas-loader";
import {
  STRATA,
  buildDig,
} from "@/features/concepts/maintenance-archaeology/lib/strata-data";
import {
  createDigState,
  type DigState,
} from "@/features/concepts/maintenance-archaeology/lib/dig-state";

const FIND_HUD_DEFAULT =
  "Rê mũi probe lên một mảnh module để carbon-date bằng lịch sử git";

const RULER_YEARS = [2026, 2024, 2022, 2020, 2018, 2016];

/**
 * Layout DOM: hero + 5 stake tag stratum + thước độ sâu (năm lùi dần) +
 * HUD carbon-dating. Cuộn = đào sâu; kết quả probe mutate DOM trực tiếp.
 */
export function DigExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);

  const digStateRef = useRef<DigState | null>(null);
  if (digStateRef.current === null) {
    digStateRef.current = createDigState();
  }
  const digState = digStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      digState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const artifacts = buildDig(7);
    digState.setFindCard = (artifactIndex: number) => {
      const hud = hudRef.current;
      if (!hud) return;
      if (artifactIndex < 0) {
        hud.textContent = FIND_HUD_DEFAULT;
        hud.classList.remove("text-[#d97b53]");
      } else {
        const artifact = artifacts[artifactIndex];
        hud.textContent = `${artifact.name} · sinh ${artifact.bornYear} · chạm lần cuối ${artifact.lastTouched} · ${artifact.commits} commits · ${artifact.note}`;
        hud.classList.add("text-[#d97b53]");
      }
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      digState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      digState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      digState.setFindCard = null;
    };
  }, [digState]);

  return (
    <div ref={containerRef} className="relative">
      <DigCanvasLoader
        digStateRef={digStateRef as { current: DigState }}
        eventSourceRef={containerRef}
      />

      {/* Thước độ sâu: năm lùi dần khi đào xuống */}
      <div
        data-testid="depth-ruler"
        className="pointer-events-none fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 flex-col gap-6 border-l border-neutral-800 pl-2 sm:flex"
      >
        {RULER_YEARS.map((year) => (
          <p key={year} className="font-mono text-[10px] text-neutral-600">
            {year}
          </p>
        ))}
      </div>

      {/* HUD carbon-dating */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/75 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={hudRef}
          data-testid="find-hud"
          className="line-clamp-2 font-mono text-[11px] text-neutral-400"
        >
          {FIND_HUD_DEFAULT}
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#d97b53] uppercase">
          Di chỉ khai quật · một codebase 10 năm
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          MAINTENANCE ARCHAEOLOGY
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Junior xây greenfield. Senior đọc và sửa an toàn những hệ thống
          người khác để lại. Cuộn để đào xuyên 5 địa tầng của một codebase
          thật, càng sâu càng ấm vì càng cũ; rê probe lên từng mảnh module để
          carbon-date bằng chính lịch sử git.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ đào: mặt đất là 2026, đá gốc là 2016
        </p>
      </section>

      {/* 5 STAKE TAG */}
      {STRATA.map((stratum, index) => (
        <section
          key={stratum.id}
          className="mx-auto flex min-h-[88vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#d97b53] uppercase">
              {stratum.label}
            </p>
            <p className="mt-1 font-mono text-2xl text-neutral-100">
              {stratum.fromYear} · {stratum.toYear}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {stratum.note}
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
            Metaphor chính là tuyên bố seniority: đọc hệ thống cũ là kỹ năng
            đắt nhất. Bản chính thức bake dữ liệu từ `git log --numstat` lúc
            build (độ dày stratum = churn thật, tuổi mảnh = first/last
            commit); demo dùng dataset seeded cùng schema. Kỹ thuật: vách hố
            1 draw call với era ramp bake CPU, 48 mảnh trong đúng 1 instanced
            draw call raycast theo instanceId, lưới trắc địa 1 LineSegments,
            tổng ~6 draw call và 0% GPU khi bạn ngừng đào.
          </p>
        </div>
      </section>
    </div>
  );
}
