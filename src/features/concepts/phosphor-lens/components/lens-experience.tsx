"use client";

import { useEffect, useRef } from "react";
import { LensCanvasLoader } from "@/features/concepts/phosphor-lens/components/lens-canvas-loader";
import {
  createLensState,
  type LensState,
} from "@/features/concepts/phosphor-lens/lib/lens-state";

const SECTIONS = [
  {
    id: "compression",
    title: "glyph là bản nén",
    note: "Lớp phosphor là cách hệ thống kể về chính nó ở độ phân giải thấp: log, metric, ASCII. Đủ để trực gác, không đủ để hiểu.",
  },
  {
    id: "attention",
    title: "attention là thấu kính",
    note: "Nhìn kỹ ở đâu, sự thật hiện ra ở đó. Debug giỏi không phải nhìn nhiều nơi hơn mà là biết đặt thấu kính vào đúng chỗ.",
  },
  {
    id: "band",
    title: "band chuyển tiếp",
    note: "Chi tiết đắt nhất: quanh mép thấu kính, cell glyph co từ 12px xuống 4px trước khi tan — độ phân giải tăng dần như tiêu cự đang được vặn.",
  },
];

/**
 * Layout DOM: hero + 3 section + HUD. Con trỏ trên trang được chiếu
 * thẳng vào uniform lens (pixel canvas); cuộn rack focus toàn cục.
 */
export function LensExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const lensStateRef = useRef<LensState | null>(null);
  if (lensStateRef.current === null) {
    lensStateRef.current = createLensState();
  }
  const lensState = lensStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      lensState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const onPointerMove = (event: PointerEvent) => {
      lensState.pointer[0] = event.clientX;
      lensState.pointer[1] = event.clientY;
      lensState.pointerActive = true;
      lensState.invalidate?.();
    };
    const onPointerLeave = () => {
      lensState.pointerActive = false;
      lensState.invalidate?.();
    };

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      lensState.progress =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      lensState.invalidate?.();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
      window.removeEventListener("scroll", onScroll);
    };
  }, [lensState]);

  return (
    <div ref={containerRef} className="relative">
      <LensCanvasLoader
        lensStateRef={lensStateRef as { current: LensState }}
        eventSourceRef={containerRef}
      />

      {/* HUD */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/80 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          data-testid="lens-hud"
          className="font-mono text-[11px] text-neutral-400"
        >
          con trỏ của bạn là thấu kính · cuộn để rack focus toàn cục
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#67e8f9] uppercase">
          Dưới lớp ký tự là kim loại tiện chính xác
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          PHOSPHOR LENS
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Cả màn hình phủ một lớp glyph phosphor xanh nhấp nháy kiểu
          CRT. Di con trỏ: trong vòng thấu kính, lớp ký tự tan ra để lộ
          khối nhôm tiện với rãnh V và collar sáng loáng bên dưới. Cuộn
          để rack focus — càng xuống sâu lớp phosphor càng tan, và vật
          thể xoay chậm như đang được kiểm tra trên máy tiện.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          di con trỏ để soi · cuộn để resolve toàn cục
        </p>
      </section>

      {/* 3 SECTION */}
      {SECTIONS.map((section, index) => (
        <section
          key={section.id}
          data-lens-section={section.id}
          className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#67e8f9] uppercase">
              {section.title}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {section.note}
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
            Một pass stateless duy nhất: lớp phosphor là quad clip-space
            vẽ đè lên scene thường, con trỏ đục lỗ alpha — không FBO,
            không ping-pong, nên demand thuần và thêm đúng 1 draw call.
            Khối kim loại là LatheGeometry từ profile 20 điểm test được
            (chamfer, hai rãnh V, collar), không tải model nào. Bản
            chính thức nâng cấp: render scene vào FBO 0.75x rồi ASCII
            hoá bằng atlas glyph thật từ font mono của site, thêm barrel
            distortion + chromatic ring quanh mép thấu kính.
          </p>
        </div>
      </section>
    </div>
  );
}
