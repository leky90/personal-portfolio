"use client";

import { useEffect, useMemo, useRef } from "react";
import { EngineCanvasLoader } from "@/features/concepts/leverage-engine/components/engine-canvas-loader";
import {
  OUTPUTS,
  TOTAL_LEVERAGE,
  buildTrain,
} from "@/features/concepts/leverage-engine/lib/gear-data";
import {
  createEngineState,
  nudgeOmega,
  type EngineState,
} from "@/features/concepts/leverage-engine/lib/engine-state";

/**
 * Layout DOM: hero + 4 section đầu ra + HUD odometer aria-live.
 * Kéo crank trong canvas hoặc bấm ← → đều đẩy cùng một omega;
 * odometer nhận số vòng từ scene qua callback, không setState.
 */
export function EngineExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const odometerRef = useRef<HTMLParagraphElement>(null);
  const speedRef = useRef<HTMLParagraphElement>(null);

  const leverages = useMemo(() => {
    const train = buildTrain();
    return OUTPUTS.map((output) =>
      Math.round(
        Math.abs(train.find((gear) => gear.id === output.gearId)?.speed ?? 0),
      ),
    );
  }, []);

  const engineStateRef = useRef<EngineState | null>(null);
  if (engineStateRef.current === null) {
    engineStateRef.current = createEngineState();
  }
  const engineState = engineStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      engineState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    engineState.setOdometer = (inputRevs: number, outputRevs: number) => {
      const odometer = odometerRef.current;
      if (!odometer) return;
      odometer.textContent = `tay quay ${inputRevs.toFixed(1)} vòng · đầu ra ${Math.round(outputRevs)} vòng · đòn bẩy ×${TOTAL_LEVERAGE}`;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        typeof target.tagName === "string" &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      nudgeOmega(engineState, event.key === "ArrowRight" ? 0.6 : -0.6);
      if (speedRef.current) {
        speedRef.current.textContent = `ω = ${engineState.omega.toFixed(1)} rad/s`;
      }
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      engineState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      engineState.invalidate?.();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      engineState.setOdometer = null;
    };
  }, [engineState]);

  return (
    <div ref={containerRef} className="relative">
      <EngineCanvasLoader
        engineStateRef={engineStateRef as { current: EngineState }}
        eventSourceRef={containerRef}
      />

      {/* HUD odometer đòn bẩy */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/75 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={odometerRef}
          data-testid="engine-odometer"
          aria-live="polite"
          className="font-mono text-[11px] text-neutral-300"
        >
          tay quay 0.0 vòng · đầu ra 0 vòng · đòn bẩy ×{TOTAL_LEVERAGE}
        </p>
        <p
          ref={speedRef}
          data-testid="engine-speed"
          className="mt-1 font-mono text-[10px] text-neutral-600"
        >
          kéo tay quay tím theo cung tròn · hoặc bấm ← →
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#c084fc] uppercase">
          Một vòng tay quay · sáu mươi vòng đầu ra
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          LEVERAGE ENGINE
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Việc của senior không phải là quay nhanh hơn, mà là dựng hộp
          số. Kéo tay quay tím: một vòng công sức truyền qua bốn chuỗi
          bánh răng compound thành sáu mươi vòng đầu ra của cả đội, và
          từng tỷ số truyền đều lấy từ số liệu đo được thật.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          kéo tay quay theo cung tròn rồi thả cho nó trôi ↓
        </p>
      </section>

      {/* 4 SECTION ĐẦU RA */}
      {OUTPUTS.map((output, index) => (
        <section
          key={output.gearId}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#c084fc] uppercase">
              trục ra {index + 1}/4
            </p>
            <div className="mt-1 flex items-baseline justify-between gap-4">
              <h3 className="font-mono text-xl text-neutral-100">
                {output.label}
              </h3>
              <p className="font-mono text-2xl text-[#c084fc]">
                ×{leverages[index]}
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {output.detail}
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
            Đòn bẩy là thứ khó khoe nhất trong CV vì nó vô hình; hộp số
            làm nó quay được. Kỹ thuật: động học là một DAG thuần toán
            (tốc độ nhân qua từng mesh, gear đồng trục đồng tốc), không
            physics engine; khoảng cách ăn khớp = tổng bán kính pitch
            được khoá bằng test thay vì assertion dev-time. 13 bánh răng
            chia 7 extrusion cache và đúng 2 material dùng chung, khoảng
            28 draw call; frameloop demand với ma sát mũ snap về 0 nên
            thả tay là hộp số trôi chậm dần rồi GPU về đúng 0%.
          </p>
        </div>
      </section>
    </div>
  );
}
