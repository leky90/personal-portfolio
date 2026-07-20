"use client";

import { useEffect, useRef } from "react";
import { TraceCanvasLoader } from "@/features/concepts/request-lifecycle/components/trace-canvas-loader";
import {
  SPANS,
  TOTAL_MS,
  elapsedMs,
} from "@/features/concepts/request-lifecycle/lib/trace-data";
import {
  createTraceState,
  type TraceState,
} from "@/features/concepts/request-lifecycle/lib/trace-state";

const HUD_DEFAULT =
  "Chưa có gói tin nào bay. Cuộn để bắn request qua edge, mesh, hàng đợi và database.";

/**
 * Layout DOM: hero kiểu terminal + rail waterfall Jaeger bên trái +
 * HUD log line + 6 section span. Cuộn = packet bay; span active
 * mutate DOM trực tiếp, không re-render React.
 */
export function TraceExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLParagraphElement>(null);
  const clockRef = useRef<HTMLParagraphElement>(null);

  const traceStateRef = useRef<TraceState | null>(null);
  if (traceStateRef.current === null) {
    traceStateRef.current = createTraceState();
  }
  const traceState = traceStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      traceState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    traceState.setActiveSpan = (spanIndex: number) => {
      const rail = railRef.current;
      if (rail) {
        rail
          .querySelectorAll<HTMLElement>("[data-span-index]")
          .forEach((row) => {
            const active = Number(row.dataset.spanIndex) === spanIndex;
            row.classList.toggle("opacity-100", active);
            row.classList.toggle("opacity-40", !active);
          });
      }
      const hud = hudRef.current;
      if (hud && spanIndex >= 0) {
        const span = SPANS[spanIndex];
        hud.textContent = `[${span.service}] ${span.log}`;
        hud.classList.toggle("text-[#f59e0b]", span.kind === "async");
        hud.classList.toggle("text-[#4ade80]", span.kind !== "async");
        hud.classList.remove("text-neutral-400");
      }
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      traceState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      const clock = clockRef.current;
      if (clock) {
        clock.textContent = `t = ${elapsedMs(traceState.progress).toFixed(0)} ms / ${TOTAL_MS} ms`;
      }
      traceState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      traceState.setActiveSpan = null;
    };
  }, [traceState]);

  return (
    <div ref={containerRef} className="relative">
      <TraceCanvasLoader
        traceStateRef={traceStateRef as { current: TraceState }}
        eventSourceRef={containerRef}
      />

      {/* Rail waterfall kiểu Jaeger: offset + độ dài bar theo timeline thật */}
      <div
        ref={railRef}
        data-testid="trace-rail"
        className="pointer-events-none fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 flex-col gap-3 border-l border-neutral-800 pl-3 md:flex"
      >
        {SPANS.map((span, index) => (
          <div
            key={span.id}
            data-span-index={index}
            className="opacity-40 transition-opacity duration-300"
          >
            <p className="font-mono text-[10px] text-neutral-400">
              {span.id} · {span.durationMs}ms
            </p>
            <div className="mt-1 h-[3px] w-36 bg-neutral-900">
              <div
                className={`h-full ${span.kind === "async" ? "bg-[#f59e0b]" : "bg-[#4ade80]"}`}
                style={{
                  width: `${(span.durationMs / TOTAL_MS) * 100}%`,
                  marginLeft: `${(span.startMs / TOTAL_MS) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* HUD log line + đồng hồ request */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/75 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          ref={hudRef}
          data-testid="trace-hud"
          className="line-clamp-2 font-mono text-[11px] text-neutral-400"
        >
          {HUD_DEFAULT}
        </p>
        <p ref={clockRef} className="mt-1 font-mono text-[10px] text-neutral-600">
          t = 0 ms / {TOTAL_MS} ms
        </p>
      </div>

      {/* HERO kiểu terminal */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] text-neutral-500">
          <span className="text-neutral-600">$</span> curl -i https://ky.le/
          -H &apos;accept: engineer&apos;
          <span className="ml-1 inline-block h-3 w-[7px] translate-y-[2px] bg-[#4ade80] motion-safe:animate-pulse" />
        </p>
        <p className="mt-6 font-mono text-[11px] tracking-[0.3em] text-[#f59e0b] uppercase">
          Một request duy nhất · 187ms · 6 span
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          REQUEST LIFECYCLE
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Cả trang này là một distributed trace. Cuộn để đẩy gói tin qua
          edge PoP, load balancer, service mesh, hàng đợi async và
          database; rail bên trái là waterfall lấp dần đúng như Jaeger,
          và mỗi chặng kể một phần câu chuyện nghề của tôi.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: gói tin rời edge PoP
        </p>
      </section>

      {/* 6 SECTION SPAN */}
      {SPANS.map((span, index) => (
        <section
          key={span.id}
          className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#f59e0b] uppercase">
              span {index + 1}/6 · {span.id}
              {span.kind === "async" ? " · async" : ""}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-neutral-100">
              {span.label}
            </h3>
            <p className="mt-1 font-mono text-[11px] text-neutral-500">
              {span.service} · {span.durationMs}ms · bắt đầu t+{span.startMs}ms
            </p>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-[#4ade80]/80">
              {span.log}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {span.note}
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
            Portfolio dựng như một distributed trace vì đó là cách tôi tư
            duy hệ thống: mọi tương tác đều là một request có chi phí đo
            được ở từng chặng. Kỹ thuật: route là 1 tube 1 draw call với
            xung packet tính trong fragment shader (không bloom), hạ tầng
            flat-grey gom về 2 InstancedMesh + 1 hex prism, camera dolly
            theo chính đường cong của route. Tổng ~8 draw call,
            frameloop demand nên GPU 0% khi bạn dừng đọc; bản chính thức
            sẽ đổ số đo thật từ APM vào đúng schema span này.
          </p>
        </div>
      </section>
    </div>
  );
}
