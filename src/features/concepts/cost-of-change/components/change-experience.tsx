"use client";

import { useEffect, useRef, useState } from "react";
import { TowerCanvasLoader } from "@/features/concepts/cost-of-change/components/tower-canvas-loader";
import {
  FLOOR_COUNT,
  LEDGER,
  debtAt,
  estimatedCostMonths,
} from "@/features/concepts/cost-of-change/lib/ledger-data";
import {
  createChangeState,
  yearFromProgress,
  yearLabel,
  type ChangeState,
} from "@/features/concepts/cost-of-change/lib/change-state";

/**
 * Layout DOM: hero blueprint + 10 thẻ sự kiện sổ cái + thẻ 2026 + HUD
 * nợ tích luỹ + toggle counterfactual. Cuộn scrub năm 0→10; toggle
 * blend sang timeline chưa từng refactor (tháp đỏ, nghiêng, rung).
 */
export function ChangeExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);
  const [counterfactual, setCounterfactual] = useState(false);

  const changeStateRef = useRef<ChangeState | null>(null);
  if (changeStateRef.current === null) {
    changeStateRef.current = createChangeState();
  }
  const changeState = changeStateRef.current;

  const writeHud = (yearFloat: number, alt: boolean) => {
    const hud = hudRef.current;
    if (!hud) return;
    const debt = debtAt(yearFloat, alt).toFixed(1);
    const floors = Math.min(Math.ceil(yearFloat), FLOOR_COUNT);
    const base = `năm ${yearLabel(yearFloat)} · tầng ${floors}/${FLOOR_COUNT} · nợ tích luỹ ${debt}`;
    hud.textContent = alt
      ? `${base} · nếu không bao giờ refactor: ≈ ${estimatedCostMonths(yearFloat)} engineer-months`
      : `${base} · cuộn để xây tiếp`;
    hud.classList.toggle("text-[#e5484d]", alt);
    hud.classList.toggle("text-neutral-400", !alt);
  };

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      changeState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      changeState.year = yearFromProgress(progress);
      writeHud(changeState.year, changeState.counterfactual === 1);
      changeState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [changeState]);

  const toggleCounterfactual = () => {
    const next = !counterfactual;
    setCounterfactual(next);
    changeState.counterfactual = next ? 1 : 0;
    writeHud(changeState.year, next);
    changeState.invalidate?.();
  };

  return (
    <div ref={containerRef} className="relative">
      <TowerCanvasLoader
        changeStateRef={changeStateRef as { current: ChangeState }}
        eventSourceRef={containerRef}
      />

      {/* HUD nợ tích luỹ */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/75 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={hudRef}
          data-testid="change-hud"
          className="line-clamp-2 font-mono text-[11px] text-neutral-400"
        >
          năm 2016 · tầng 0/{FLOOR_COUNT} · nợ tích luỹ 0.0 · cuộn để xây
        </p>
      </div>

      {/* Toggle counterfactual — chip bền thay cho press-and-hold (mobile ok) */}
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
        <button
          type="button"
          aria-pressed={counterfactual}
          onClick={toggleCounterfactual}
          className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-wide backdrop-blur transition-colors ${
            counterfactual
              ? "border-[#e5484d] bg-[#e5484d]/10 text-[#e5484d]"
              : "border-neutral-700 bg-black/70 text-neutral-400 hover:border-neutral-500"
          }`}
        >
          {counterfactual
            ? "đang xem: không bao giờ refactor · bấm để quay về"
            : "nếu không bao giờ refactor?"}
        </button>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#f2c94c] uppercase">
          Một codebase 10 năm · nợ kỹ thuật là ứng suất vật lý
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          COST OF CHANGE
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Mỗi năm ship feature là một tầng chất lên tháp truss; ứng suất
          dồn xuống móng cho tới khi một lần refactor giải phóng kết cấu.
          Cuộn để xây mười năm, và bấm nút bên dưới để xem dòng thời gian
          giả định nơi khoản nợ đó không bao giờ được trả.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: đổ móng năm 2016
        </p>
      </section>

      {/* 10 THẺ SỰ KIỆN SỔ CÁI */}
      {LEDGER.map((event, index) => (
        <section
          key={event.year}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-2xl text-neutral-100">
                {event.year}
              </p>
              <p
                className={`font-mono text-[10px] tracking-[0.25em] uppercase ${
                  event.kind === "refactor"
                    ? "text-[#2dd4bf]"
                    : "text-[#ffb454]"
                }`}
              >
                {event.kind}
              </p>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-neutral-100">
              {event.title}
            </h3>
            <p className="mt-1 font-mono text-[11px] text-[#f2c94c]/90">
              {event.metric}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {event.note}
            </p>
          </article>
        </section>
      ))}

      {/* 2026 + CORE IDEA */}
      <section className="mx-auto flex min-h-[80vh] w-full max-w-5xl flex-col items-center justify-center gap-6 px-4 sm:px-6">
        <div className="w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/80 p-5">
          <p className="font-mono text-2xl text-neutral-100">2026 · hôm nay</p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Tháp đứng thẳng không phải vì chưa từng nghiêng, mà vì nợ được
            trả ba lần đúng lúc. Đó là khác biệt giữa người viết code và
            người chịu trách nhiệm cho một hệ thống sống lâu hơn mọi
            framework nó từng dùng.
          </p>
        </div>
        <div className="w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Nợ kỹ thuật thường vô hình với người ngoài nghề; demo này cho
            nó một cơ thể chịu lực. Hai đường cong nợ (thật / giả định)
            precompute từ sổ cái lúc build, runtime không mô phỏng gì.
            Kỹ thuật: 120 thanh + 44 khớp gói trong đúng 2 instanced draw
            call chia một ShaderMaterial GLSL3, shear + sag + tremor tính
            trong vertex shader từ uStrain[12], không light không shadow;
            frameloop demand nên GPU 0% khi bạn dừng đọc.
          </p>
        </div>
      </section>
    </div>
  );
}
