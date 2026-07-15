"use client";

import { useEffect, useRef } from "react";
import { CompiledCanvasLoader } from "@/features/concepts/compiled-light/components/compiled-canvas-loader";
import { cellPxForProgress } from "@/features/concepts/compiled-light/components/terminal-pass";
import {
  createCompiledState,
  type CompiledState,
} from "@/features/concepts/compiled-light/lib/compiled-state";

interface PassCard {
  id: string;
  label: string;
  title: string;
  body: string;
  side: "left" | "right";
}

const PASS_CARDS: PassCard[] = [
  {
    id: "pass-1",
    label: "PASS 01",
    title: "FBM Dune Field",
    body: "Một plane ~37k vertex displace bằng FBM 3 octave ngay trong vertex shader, normal tính finite-difference từ chính trường noise — render vào FBO half-res. Không model, không texture: 0 KB asset.",
    side: "left",
  },
  {
    id: "pass-2",
    label: "PASS 02",
    title: "Quantize + Bayer Dither",
    body: "Ảnh nguồn bị nuốt vào lưới cell: mỗi ô lấy luminance Rec.709 tại tâm rồi so với ngưỡng Bayer 8×8 tuần hoàn — mid-tone sống bằng dithering, đúng ngôn ngữ phần cứng hiển thị cũ.",
    side: "right",
  },
  {
    id: "pass-3",
    label: "PASS 03",
    title: "Glyph Composite + Lens",
    body: "Bucket độ sáng chọn 1 trong 16 glyph monospace (atlas bake runtime từ font của site). Thấu kính quanh con trỏ mix ngược về FBO gốc — bằng chứng sống rằng dưới lớp ký tự là một scene 3D được chiếu sáng thật.",
    side: "left",
  },
];

/**
 * Layout DOM của compiled-light. Cuộn trang = "compile" độ phân giải:
 * cell 22px ở hero co dần còn 7px ở cuối. Con trỏ (hoặc Shift+mũi tên)
 * là thấu kính decompile. HUD cell size mutate thẳng DOM — không re-render.
 */
export function CompiledExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLSpanElement>(null);

  const compiledStateRef = useRef<CompiledState | null>(null);
  if (compiledStateRef.current === null) {
    compiledStateRef.current = createCompiledState();
  }
  const compiledState = compiledStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      compiledState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const updateHud = () => {
      if (hudRef.current) {
        const cell = Math.round(
          cellPxForProgress(compiledState.progress, compiledState.isMobile),
        );
        hudRef.current.textContent = `cell ${cell}px`;
      }
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      compiledState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      updateHud();
      compiledState.invalidate?.();
    };

    const onPointerMove = (event: PointerEvent) => {
      compiledState.lens.x = event.clientX;
      compiledState.lens.y = window.innerHeight - event.clientY;
      compiledState.lens.active = true;
      compiledState.invalidate?.();
    };

    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        compiledState.lens.active = false;
        compiledState.invalidate?.();
      }
    };

    // A11y flourish: Shift + mũi tên lái thấu kính không cần chuột
    // (giữ nguyên hành vi cuộn mặc định của phím mũi tên đơn).
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.shiftKey) return;
      const step = 56;
      const lens = compiledState.lens;
      if (!lens.active || lens.x < 0) {
        lens.x = window.innerWidth / 2;
        lens.y = window.innerHeight / 2;
      }
      switch (event.key) {
        case "ArrowLeft":
          lens.x -= step;
          break;
        case "ArrowRight":
          lens.x += step;
          break;
        case "ArrowUp":
          lens.y += step;
          break;
        case "ArrowDown":
          lens.y -= step;
          break;
        default:
          return;
      }
      event.preventDefault();
      lens.active = true;
      compiledState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut);
    window.addEventListener("keydown", onKeyDown);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [compiledState]);

  return (
    <div ref={containerRef} className="relative">
      <CompiledCanvasLoader
        compiledStateRef={compiledStateRef as { current: CompiledState }}
        eventSourceRef={containerRef}
      />

      {/* HUD cell size — mutate textContent trực tiếp, không re-render */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-40 rounded border border-neutral-800 bg-black/60 px-2 py-1 backdrop-blur">
        <span
          ref={hudRef}
          data-testid="cell-hud"
          className="font-mono text-[11px] text-[#e6ead9]/80"
        >
          cell 22px
        </span>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-neutral-500 uppercase">
          3-pass WebGL pipeline
        </p>
        <h2 className="mt-4 max-w-2xl font-mono text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          COMPILED LIGHT
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Cả trang này là một cảnh 3D thật — cồn cát FBM dưới ánh sáng xiên —
          nhưng bạn chỉ được nhìn nó qua một terminal: lượng tử hóa thành ký
          tự. Cuộn xuống để trang tự &ldquo;compile&rdquo; độ phân giải mịn
          dần.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-600">
          Di chuột (hoặc Shift + mũi tên) để decompile ánh sáng · cuộn để
          compile
        </p>
      </section>

      {/* 3 PASS */}
      {PASS_CARDS.map((card) => (
        <section
          key={card.id}
          className="mx-auto flex min-h-[75vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-md rounded-lg border border-neutral-900 bg-neutral-950/60 p-5 backdrop-blur-sm ${
              card.side === "right" ? "ml-auto" : ""
            }`}
          >
            <p className="font-mono text-xs tracking-[0.3em] text-[#e6ead9]/70 uppercase">
              {card.label}
            </p>
            <h3 className="mt-2 text-lg font-medium text-neutral-100">
              {card.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {card.body}
            </p>
          </article>
        </section>
      ))}

      {/* CORE IDEA + CONTACT */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6">
        <h3 className="max-w-xl font-mono text-2xl font-semibold tracking-tight text-neutral-50 sm:text-3xl">
          Trang đã compile xong.
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
          Từ cell 22px ở hero xuống 7px tại đây — và toàn pipeline chạy ở DPR 1
          by design: output lượng tử hóa theo cell nên retina không thêm chi
          tiết, chi phí GPU không đổi trên mọi màn hình.
        </p>
        <a
          href="mailto:ldky90@gmail.com"
          className="mt-8 rounded border border-[#e6ead9]/30 px-5 py-2.5 font-mono text-sm text-[#e6ead9] transition-colors hover:bg-[#e6ead9]/10"
        >
          ldky90@gmail.com →
        </a>

        <div className="mt-16 w-full max-w-2xl rounded-lg border border-neutral-900 bg-neutral-950/70 p-5 text-left">
          <h4 className="font-mono text-xs tracking-[0.3em] text-neutral-500 uppercase">
            Core idea
          </h4>
          <p className="mt-3 text-sm leading-relaxed text-neutral-400">
            Thẩm mỹ terminal 2026 làm theo cách đáng tin: một pipeline WebGL
            3 pass thật (FBM dune → quantize/dither → glyph composite) chứ
            không phải CSS filter. Thấu kính decompile là cú flex lặng lẽ —
            chứng minh dưới lớp ASCII có một scene được chiếu sáng đầy đủ.
            frameloop=&ldquo;demand&rdquo;, ~5 draw call, 0 KB asset.
          </p>
        </div>
      </section>
    </div>
  );
}
