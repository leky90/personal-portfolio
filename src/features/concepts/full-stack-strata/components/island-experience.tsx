"use client";

import { useEffect, useRef } from "react";
import { IslandCanvasLoader } from "@/features/concepts/full-stack-strata/components/island-canvas-loader";
import {
  LAYERS,
  TRACES,
} from "@/features/concepts/full-stack-strata/lib/island-data";
import {
  createIslandState,
  fireRequest,
  type IslandState,
} from "@/features/concepts/full-stack-strata/lib/island-state";

const TERMINAL_DEFAULT =
  "terminal trace · bấm nút để bắn một request xuyên ba tầng";

/**
 * Layout DOM: hero + 3 section tầng + terminal trace + nút bắn request.
 * Packet bay trong canvas; log trace đẩy ra terminal qua callback theo
 * đúng mốc thời gian của kịch bản.
 */
export function IslandExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLParagraphElement>(null);

  const islandStateRef = useRef<IslandState | null>(null);
  if (islandStateRef.current === null) {
    islandStateRef.current = createIslandState();
  }
  const islandState = islandStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      islandState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    islandState.setTraceLine = (line: string) => {
      const terminal = terminalRef.current;
      if (!terminal) return;
      terminal.textContent = line;
      terminal.classList.add("text-[#3fd8c7]");
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      islandState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      islandState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      islandState.setTraceLine = null;
    };
  }, [islandState]);

  const onFire = () => {
    const wasIdle = islandState.firing < 0;
    fireRequest(islandState);
    if (wasIdle && terminalRef.current && islandState.firing >= 0) {
      terminalRef.current.textContent = `▶ ${TRACES[islandState.firing].label}`;
      terminalRef.current.classList.add("text-[#3fd8c7]");
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <IslandCanvasLoader
        islandStateRef={islandStateRef as { current: IslandState }}
        eventSourceRef={containerRef}
      />

      {/* Terminal trace */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/80 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={terminalRef}
          data-testid="trace-terminal"
          className="line-clamp-2 font-mono text-[11px] text-neutral-400"
        >
          {TERMINAL_DEFAULT}
        </p>
      </div>

      {/* Nút bắn request */}
      <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
        <button
          type="button"
          data-testid="fire-button"
          onClick={onFire}
          className="rounded-full border border-neutral-700 bg-black/70 px-4 py-2 font-mono text-[11px] tracking-wide text-neutral-400 backdrop-blur transition-colors hover:border-[#3fd8c7] hover:text-[#3fd8c7]"
        >
          bắn một request xuyên stack
        </button>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#2dd4bf] uppercase">
          Lát cắt hòn đảo chính là stack
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          FULL-STACK STRATA
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Thành phố sản phẩm trên bề mặt, seam dịch vụ phát sáng ở giữa,
          đá dữ liệu kết tinh dưới đáy. Cuộn để khoan camera dọc lát
          cắt; bấm nút để một request rơi từ nóc nhà xuyên qua cả ba
          tầng rồi vòng lên trả 200, kèm trace log kể đúng chuyện hệ
          thống.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: khoan xuống tầng sản phẩm
        </p>
      </section>

      {/* 3 SECTION TẦNG */}
      {LAYERS.map((layer, index) => (
        <section
          key={layer.id}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#2dd4bf] uppercase">
              tầng {index + 1}/3
            </p>
            <h3 className="mt-1 text-xl font-semibold text-neutral-100">
              {layer.label}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {layer.note}
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
            Ẩn dụ cũ nhất ngành (stack) nhưng lát cắt làm nó sờ được:
            request là một vật thể rơi qua ba tầng có thật. Kỹ thuật:
            đảo pre-cut thay vì clippingPlanes + stencil; thành phố,
            service ring, tinh thể gói trong 3 instanced draw call; 4
            kịch bản trace là dữ liệu thuần với mốc thời gian test được;
            tổng ~10 draw call, frameloop demand chỉ thức khi packet bay.
            Bản chính thức thêm cửa sổ sáng bằng onBeforeCompile và
            MeshTransmissionMaterial cho 3 tinh thể hero sau cổng
            detect-gpu.
          </p>
        </div>
      </section>
    </div>
  );
}
