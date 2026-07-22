"use client";

import { useEffect, useRef } from "react";
import { DeskCanvasLoader } from "@/features/concepts/desk-version-controlled/components/desk-canvas-loader";
import {
  DESK_OBJECTS,
  ERAS,
  latestCommit,
  yearAt,
} from "@/features/concepts/desk-version-controlled/lib/desk-data";
import {
  createDeskState,
  type DeskState,
} from "@/features/concepts/desk-version-controlled/lib/desk-state";

const TOOLTIP_DEFAULT =
  "Rê lên một đồ vật để đọc commit và lý do đằng sau nó";

/**
 * Layout DOM: hero + year ticker + commit line + tooltip micro-ADR +
 * 4 era section. Cuộn scrub timeline; commit line và ticker tính
 * DOM-side từ cùng dữ liệu với canvas.
 */
export function DeskExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);
  const commitRef = useRef<HTMLParagraphElement>(null);
  const tooltipRef = useRef<HTMLParagraphElement>(null);

  const deskStateRef = useRef<DeskState | null>(null);
  if (deskStateRef.current === null) {
    deskStateRef.current = createDeskState();
  }
  const deskState = deskStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      deskState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    deskState.setTooltip = (objectIndex: number) => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;
      if (objectIndex < 0) {
        tooltip.textContent = TOOLTIP_DEFAULT;
        tooltip.classList.remove("text-[#fbbf24]");
      } else {
        const object = DESK_OBJECTS[objectIndex];
        tooltip.textContent = `${object.commit} · ${object.story}`;
        tooltip.classList.add("text-[#fbbf24]");
      }
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      deskState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      if (yearRef.current) {
        yearRef.current.textContent = String(yearAt(deskState.progress));
      }
      if (commitRef.current) {
        commitRef.current.textContent = latestCommit(deskState.progress);
      }
      deskState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      deskState.setTooltip = null;
    };
  }, [deskState]);

  return (
    <div ref={containerRef} className="relative">
      <DeskCanvasLoader
        deskStateRef={deskStateRef as { current: DeskState }}
        eventSourceRef={containerRef}
      />

      {/* Year ticker */}
      <div className="pointer-events-none fixed top-20 right-4 z-40 text-right">
        <p
          ref={yearRef}
          data-testid="desk-year"
          className="font-mono text-4xl text-neutral-700 tabular-nums sm:text-6xl"
        >
          2014
        </p>
      </div>

      {/* Commit line + tooltip */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/80 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={commitRef}
          data-testid="desk-commit"
          className="font-mono text-[11px] text-neutral-300"
        >
          {latestCommit(0)}
        </p>
        <p
          ref={tooltipRef}
          data-testid="desk-tooltip"
          className="mt-1 line-clamp-2 font-mono text-[10px] text-neutral-500"
        >
          {TOOLTIP_DEFAULT}
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#fbbf24] uppercase">
          git log của một chiếc bàn · 2014 → 2026
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          DESK, VERSION-CONTROLLED
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Mười hai năm sự nghiệp gói trong một góc bàn isometric. Cuộn
          để scrub từng commit: cái laptop freelance PHP ở Huế năm 2014
          nhường chỗ cho thẻ nhân viên văn phòng TP.HCM 2017, rồi setup
          remote dựng lại từ đầu 2019, và từ 2021 là màn dashboard
          on-chain cùng mic cho một đội 8 người. Rê lên từng đồ vật để
          đọc lý do — trưởng thành ở đây đọc được bằng số thứ bị remove.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: commit đầu tiên năm 2014
        </p>
      </section>

      {/* 4 ERA SECTION */}
      {ERAS.map((era, index) => (
        <section
          key={era.year}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#fbbf24] uppercase">
              era {index + 1}/4
            </p>
            <p className="mt-1 font-mono text-2xl text-neutral-100">
              {era.year}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {era.note}
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
            Chiếc bàn là CV vật lý, và refactor là đỉnh của câu chuyện:
            2026 ít đồ hơn 2019 một cách đo được. Kỹ thuật: mỗi đồ vật
            khai báo birth/death trên timeline chuẩn hoá, mọi animation
            là hàm thuần popScale(progress) nên scrub tới lui hoàn toàn
            deterministic; 19 primitive chia 5 material (~20 draw call),
            đèn rim đổi màu theo era, không shadow map; frameloop demand
            nên đứng yên là 0% GPU. Bản chính thức thêm màn hình chạy
            shader Bayer của demo resolution và tooltip theo hitbox thô.
          </p>
        </div>
      </section>
    </div>
  );
}
