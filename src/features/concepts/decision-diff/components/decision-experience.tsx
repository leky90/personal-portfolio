"use client";

import { useEffect, useRef } from "react";
import { DecisionCanvasLoader } from "@/features/concepts/decision-diff/components/decision-canvas-loader";
import { DECISIONS } from "@/features/concepts/decision-diff/lib/decisions-data";
import {
  createDecisionState,
  type DecisionState,
} from "@/features/concepts/decision-diff/lib/decision-state";
import { nearestEraIndex } from "@/lib/scroll-era";

const GHOST_HUD_DEFAULT =
  "Hover một nhánh đỏ trên rail để xem chi phí của con đường không đi";

/**
 * Layout DOM: hero + 6 ADR card viết đúng dạng diff (+ chosen / - rejected /
 * # consequence) + fork CTA kết. Card active dò theo vị trí thật qua
 * nearestEraIndex; chi phí nhánh ma đổ ra HUD bằng mutate DOM.
 */
export function DecisionExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);

  const decisionStateRef = useRef<DecisionState | null>(null);
  if (decisionStateRef.current === null) {
    decisionStateRef.current = createDecisionState();
  }
  const decisionState = decisionStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      decisionState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    decisionState.setGhostHud = (index: number) => {
      const hud = hudRef.current;
      if (!hud) return;
      if (index < 0) {
        hud.textContent = GHOST_HUD_DEFAULT;
        hud.classList.remove("text-[#f85149]");
      } else {
        const decision = DECISIONS[index];
        hud.textContent = `- ${decision.rejected}: ${decision.rejectedCost}`;
        hud.classList.add("text-[#f85149]");
      }
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      decisionState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

      const cards = el.querySelectorAll<HTMLElement>("[data-decision-index]");
      const cardRects: { top: number; height: number }[] = [];
      cards.forEach((card) => {
        const r = card.getBoundingClientRect();
        cardRects.push({ top: r.top, height: r.height });
      });
      decisionState.active = nearestEraIndex(cardRects, window.innerHeight);
      decisionState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      decisionState.setGhostHud = null;
    };
  }, [decisionState]);

  return (
    <div ref={containerRef} className="relative">
      <DecisionCanvasLoader
        decisionStateRef={decisionStateRef as { current: DecisionState }}
        eventSourceRef={containerRef}
      />

      {/* HUD chi phí nhánh ma */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/70 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={hudRef}
          data-testid="ghost-hud"
          className="truncate font-mono text-[11px] text-neutral-400"
        >
          {GHOST_HUD_DEFAULT}
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#3fb950] uppercase">
          Architecture decision log · 2019 2024
        </p>
        <h2 className="mt-4 max-w-2xl font-mono text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          DECISION DIFF
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Mười hai năm nghề không được đo bằng số dự án, mà bằng những ngã rẽ.
          Đường ray phía sau compile thẳng từ 6 ADR thật, từ lúc cứu một
          codebase legacy ở TESO tới lúc dựng dApp và dẫn đội 8 kỹ sư ở
          Treehouse: nhánh xanh là lựa chọn đã đi, nhánh đỏ nét đứt là con
          đường không đi kèm giá của nó. Hover vào bóng ma để nhìn tương lai
          đã không xảy ra.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: 2019, quyết định đầu tiên
        </p>
      </section>

      {/* 6 ADR DIFF CARDS */}
      <ol className="list-none">
        {DECISIONS.map((decision, index) => (
          <li key={decision.id}>
            <section className="mx-auto flex min-h-[92vh] w-full max-w-5xl items-center px-4 sm:px-6">
              <article
                data-decision-index={index}
                className={`w-full max-w-md rounded-lg border border-neutral-900 bg-neutral-950/80 backdrop-blur-sm ${
                  decision.side === "right" ? "ml-auto" : ""
                }`}
              >
                <header className="flex items-baseline justify-between gap-3 border-b border-neutral-900 px-4 py-3">
                  <h3 className="text-base font-medium text-neutral-100">
                    {decision.title}
                  </h3>
                  <p className="font-mono text-sm text-[#3fb950]">
                    {decision.year}
                  </p>
                </header>
                <div className="space-y-1.5 px-4 py-4 font-mono text-xs leading-relaxed">
                  <p className="text-[#3fb950]">+ {decision.chosen}</p>
                  <p className="text-[#f85149]/90">- {decision.rejected}</p>
                  <p className="text-neutral-500"># {decision.consequence}</p>
                </div>
                <footer className="border-t border-neutral-900 px-4 py-2.5">
                  <p className="font-mono text-[11px] text-neutral-500">
                    giá nhánh bỏ: {decision.rejectedCost}
                  </p>
                </footer>
              </article>
            </section>
          </li>
        ))}
      </ol>

      {/* FORK CUỐI — ngã rẽ của người xem */}
      <section className="mx-auto flex min-h-[85vh] w-full max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <h3 className="max-w-xl text-2xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
          Ngã rẽ tiếp theo là của bạn.
        </h3>
        <div className="mt-8 flex flex-col gap-3 font-mono text-sm sm:flex-row">
          <a
            href="mailto:ldky90@gmail.com"
            className="rounded border border-[#3fb950]/50 bg-[#3fb950]/10 px-5 py-2.5 text-[#3fb950] transition-colors hover:bg-[#3fb950]/20"
          >
            + hire me
          </a>
          <a
            href="#content-top"
            className="rounded border border-dashed border-[#f85149]/40 px-5 py-2.5 text-[#f85149]/70 transition-colors hover:bg-[#f85149]/10"
          >
            - keep scrolling
          </a>
        </div>

        <div className="mt-16 w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 text-left">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Nội dung chính là tín hiệu: 6 ADR có năm, có phương án bị từ chối
            kèm giá của nó, đúng loại artifact một senior nên trưng ra thay
            cho danh sách công nghệ. Kỹ thuật nói cùng một câu chuyện: một
            dataset typed compile thành hình học (trunk = 1 TubeGeometry, 1
            draw call, dash thủ tục trong shader), 6 nhánh ma dashed
            materialize bằng damp, hit-test qua instanced proxy vô hình, và
            frameloop=&ldquo;demand&rdquo; nên GPU nghỉ khi bạn ngừng đọc.
          </p>
        </div>
      </section>
    </div>
  );
}
