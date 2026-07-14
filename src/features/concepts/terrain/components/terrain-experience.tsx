"use client";

import { useEffect, useRef } from "react";
import { TerrainCanvasLoader } from "@/features/concepts/terrain/components/terrain-canvas-loader";
import {
  ERAS,
  activeEraIndex,
} from "@/features/concepts/terrain/lib/career-data";
import {
  createTerrainState,
  type TerrainState,
} from "@/features/concepts/terrain/lib/terrain-state";

/**
 * Layout DOM: 6 section màn hình (hero + 4 era + contact). Scroll của
 * container là trục thời gian — progress ghi vào TerrainState, camera damp
 * theo trong useFrame. Timeline vẫn là DOM thật (ol/li) cho screen reader.
 */
export function TerrainExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const terrainStateRef = useRef<TerrainState | null>(null);
  if (terrainStateRef.current === null) {
    terrainStateRef.current = createTerrainState();
  }
  const terrainState = terrainStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      terrainState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      terrainState.progress = progress;
      terrainState.era = activeEraIndex(progress);
      terrainState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [terrainState]);

  return (
    <div ref={containerRef} className="relative">
      <TerrainCanvasLoader
        terrainStateRef={terrainStateRef as { current: TerrainState }}
        eventSourceRef={containerRef}
      />

      {/* HERO — LCP là text DOM này, không phải canvas */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#ffb454] uppercase">
          2016 — 2026
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          TEN YEARS OF TERRAIN
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Mỗi đường contour phía sau là một lát thời gian trong 10 năm làm
          nghề — núi nhô cao ở nơi output đạt đỉnh. Cuộn xuống để bay dọc
          trục thời gian; rê chuột lên địa hình để &ldquo;chạm&rdquo; vào dữ
          liệu.
        </p>
        <p className="mt-8 animate-pulse font-mono text-xs text-neutral-600">
          ↓ cuộn để bắt đầu 2016
        </p>
      </section>

      {/* 4 ERA — mỗi era một màn hình, card lệch trái/phải theo đường bay */}
      <ol className="list-none">
        {ERAS.map((era) => (
          <li key={era.year}>
            <section className="mx-auto flex min-h-dvh w-full max-w-5xl items-center px-4 sm:px-6">
              <article
                className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 backdrop-blur-sm ${
                  era.side === "right" ? "ml-auto" : ""
                }`}
              >
                <p className="font-mono text-3xl text-[#ffb454] sm:text-4xl">
                  {era.year}
                </p>
                <h3 className="mt-2 text-lg font-medium text-neutral-100">
                  {era.title}
                </h3>
                <p className="mt-1 font-mono text-[11px] tracking-wider text-neutral-500 uppercase">
                  {era.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                  {era.description}
                </p>
                <p className="mt-4 border-t border-neutral-900 pt-3 font-mono text-[11px] text-neutral-500">
                  {era.metric}
                </p>
              </article>
            </section>
          </li>
        ))}
      </ol>

      {/* CONTACT — địa hình phẳng dần thành đường chân trời sau ridge cuối */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <h3 className="max-w-xl text-2xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
          Đỉnh tiếp theo là dự án của bạn.
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
          Địa hình phía sau đã phẳng lại thành một đường chân trời — 10 năm
          tiếp theo bắt đầu từ một cuộc trò chuyện.
        </p>
        <a
          href="mailto:ldky90@gmail.com"
          className="mt-8 rounded border border-[#ffb454]/40 px-5 py-2.5 font-mono text-sm text-[#ffb454] transition-colors hover:bg-[#ffb454]/10"
        >
          Gửi email →
        </a>

        <div className="mt-16 w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 text-left">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Toàn bộ địa hình là <em>1 draw call</em>: 280 đường × 420 đoạn
            merge thành một LineSegments, độ cao đọc từ một data texture bake
            từ 522 tuần hoạt động (demo dùng seed cố định — bản chính thức
            ETL từ GitHub GraphQL API lúc build). Displacement, breathing và
            ripple đều chạy trong vertex shader; frameloop=&ldquo;demand&rdquo;
            nên GPU gần như nghỉ khi bạn ngừng cuộn.
          </p>
        </div>
      </section>
    </div>
  );
}
