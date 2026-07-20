"use client";

import { useEffect, useRef, useState } from "react";
import { PrismCanvasLoader } from "@/features/concepts/constraint-prism/components/prism-canvas-loader";
import {
  CONSTRAINTS,
  DECISIONS,
  activeDecisions,
} from "@/features/concepts/constraint-prism/lib/prism-data";
import {
  countActive,
  createPrismState,
  isActive,
  maskWith,
  type PrismState,
} from "@/features/concepts/constraint-prism/lib/prism-state";

/**
 * Layout DOM: hero + 5 section ràng buộc (mỗi cái một toggle button,
 * bàn phím dùng được) + HUD decision plates. Cuộn chèn tuần tự từng
 * ràng buộc vào stack; toggle rút/cắm lại — cả hai cùng ghi vào một
 * bitmask cho canvas re-refract tia.
 */
export function PrismExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const insertedRef = useRef(0);
  const [muted, setMuted] = useState<ReadonlySet<number>>(new Set());
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  const prismStateRef = useRef<PrismState | null>(null);
  if (prismStateRef.current === null) {
    prismStateRef.current = createPrismState();
  }
  const prismState = prismStateRef.current;

  const syncMask = () => {
    const mask = maskWith(insertedRef.current, mutedRef.current);
    prismState.mask = mask;

    const active = CONSTRAINTS.map((_, index) => isActive(mask, index));
    const decisions = activeDecisions(active);
    if (captionRef.current) {
      captionRef.current.textContent = `ràng buộc ${countActive(mask)}/5 · thiết kế: ${
        decisions.length > 0
          ? decisions.map((d) => d.label).join(" · ")
          : "một ý tưởng chưa bị thử thách"
      }`;
    }
    const hud = hudRef.current;
    if (hud) {
      const activeIds = new Set(decisions.map((d) => d.id));
      hud.querySelectorAll<HTMLElement>("[data-decision]").forEach((row) => {
        const on = activeIds.has(row.dataset.decision ?? "");
        row.classList.toggle("text-[#7dd3fc]", on);
        row.classList.toggle("text-neutral-600", !on);
      });
    }
    prismState.invalidate?.();
  };

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      prismState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    // Canvas click wedge → cùng một đường toggle với button DOM
    prismState.onToggle = (index: number) => {
      setMuted((previous) => {
        const next = new Set(previous);
        if (next.has(index)) next.delete(index);
        else next.add(index);
        return next;
      });
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      insertedRef.current = Math.min(
        CONSTRAINTS.length,
        Math.floor(progress * (CONSTRAINTS.length + 1.4)),
      );
      syncMask();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      prismState.onToggle = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prismState]);

  // muted đổi (từ button hoặc wedge click) → đồng bộ mask + readout
  useEffect(() => {
    syncMask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  const toggleConstraint = (index: number) => {
    setMuted((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <PrismCanvasLoader
        prismStateRef={prismStateRef as { current: PrismState }}
        eventSourceRef={containerRef}
      />

      {/* HUD decision plates + caption trạng thái */}
      <div
        ref={hudRef}
        data-testid="decision-hud"
        className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/75 px-3 py-2 font-mono text-[11px] backdrop-blur sm:max-w-sm"
      >
        <p
          ref={captionRef}
          data-testid="prism-caption"
          aria-live="polite"
          className="text-neutral-300"
        >
          ràng buộc 0/5 · thiết kế: một ý tưởng chưa bị thử thách
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
          {DECISIONS.map((decision) => (
            <p
              key={decision.id}
              data-decision={decision.id}
              className="text-neutral-600 transition-colors"
            >
              ▸ {decision.label}
            </p>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#7dd3fc] uppercase">
          Ràng buộc là lăng kính · không phải rào cản
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          CONSTRAINT PRISM
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Một tia ý tưởng trắng đi vào từ mép trái. Cuộn để chèn từng
          ràng buộc thật vào stack: mỗi mặt kính gập tia một góc, và thứ
          toả ra sau lăng kính là một thiết kế có thể bảo vệ được. Rút
          một ràng buộc ra mà xem: tia thẳng hơn, phổ hẹp lại, và danh
          sách quyết định nghèo đi trông thấy.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: chèn ràng buộc đầu tiên vào đường tia
        </p>
      </section>

      {/* 5 SECTION RÀNG BUỘC */}
      {CONSTRAINTS.map((constraint, index) => (
        <section
          key={constraint.id}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#7dd3fc] uppercase">
              mặt kính {index + 1}/5
            </p>
            <h3 className="mt-1 font-mono text-xl text-neutral-100">
              {constraint.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {constraint.tradeoff}
            </p>
            <button
              type="button"
              aria-label={`ràng buộc ${constraint.label}`}
              aria-pressed={!muted.has(index)}
              onClick={() => toggleConstraint(index)}
              className={`mt-4 rounded border px-3 py-1.5 font-mono text-[11px] transition-colors ${
                muted.has(index)
                  ? "border-neutral-800 text-neutral-600 hover:border-neutral-600"
                  : "border-[#7dd3fc]/60 bg-[#7dd3fc]/10 text-[#7dd3fc]"
              }`}
            >
              {muted.has(index)
                ? "đã rút khỏi stack · bấm để cắm lại"
                : "đang trong stack · bấm để rút ra"}
            </button>
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
            Senior không phải người thoát khỏi ràng buộc, mà là người
            dùng chúng để hội tụ. Mọi sự kiện quang học ở đây đều suy từ
            một data model quyết định (ràng buộc → deflection, quyết
            định → requires), không phải hiệu ứng vẽ tay. Kỹ thuật: tia
            là ribbon topology cố định cong theo 8 uniform uPoints trong
            vertex shader GLSL3 nên re-refract zero realloc; core + glow
            chia chung mảng Vector3; phổ 6 tia gói 1 LineSegments; tổng
            ~10 draw call, frameloop demand với epsilon cutoff nên cảnh
            đứng yên là 0% GPU.
          </p>
        </div>
      </section>
    </div>
  );
}
