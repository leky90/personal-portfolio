"use client";

import { useEffect, useRef } from "react";
import { GlyphCanvasLoader } from "@/features/concepts/glyph-field/components/glyph-canvas-loader";
import {
  HEADINGS,
  PARTICLE_COUNT,
} from "@/features/concepts/glyph-field/lib/glyph-data";
import {
  createGlyphState,
  glyphProgressFromScroll,
  type GlyphState,
} from "@/features/concepts/glyph-field/lib/glyph-state";

const SECTION_NOTES = [
  "Tên đứng thành hình từ 4096 hạt. Rê con trỏ xuyên qua: hạt tản ra theo wake rồi tự lành trong ~600ms, sau đó field ngủ hẳn.",
  "Cuộn tiếp: chữ cũ thở ra, hạt bay tản theo pseudo-curl rồi ngưng tụ thành heading này. Không có hạt nào được sinh thêm hay huỷ đi.",
  "Vẫn là đúng 4096 hạt đó. Toạ độ đích của mọi heading nằm sẵn trong một DataTexture float, đổi chữ chỉ là đổi hai chỉ số hàng.",
  "Trạm cuối của field. DOM heading luôn là baseline nên không có WebGL thì trang vẫn nguyên vẹn — canvas chỉ là lớp không khí phía sau.",
];

/**
 * Layout DOM: hero + 4 section heading (chữ lớn do canvas vẽ phía sau,
 * DOM giữ heading thật cho a11y/SEO) + HUD đếm hạt. Cuộn scrub progress
 * 0→3; con trỏ khắc wake qua plane trong canvas.
 */
export function GlyphExperience() {
  const containerRef = useRef<HTMLDivElement>(null);

  const glyphStateRef = useRef<GlyphState | null>(null);
  if (glyphStateRef.current === null) {
    glyphStateRef.current = createGlyphState();
  }
  const glyphState = glyphStateRef.current;

  useEffect(() => {
    if (typeof window.matchMedia === "function") {
      glyphState.isMobile = window.matchMedia("(max-width: 640px)").matches;
    }

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scroll =
        total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
      glyphState.progress = glyphProgressFromScroll(scroll);
      glyphState.invalidate?.();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [glyphState]);

  return (
    <div ref={containerRef} className="relative">
      <GlyphCanvasLoader
        glyphStateRef={glyphStateRef as { current: GlyphState }}
        eventSourceRef={containerRef}
      />

      {/* HUD đếm hạt */}
      <div className="pointer-events-none fixed right-4 bottom-4 z-40 max-w-[calc(100vw-2rem)] rounded border border-neutral-800 bg-black/75 px-3 py-2 backdrop-blur sm:max-w-md">
        <p
          data-testid="glyph-hud"
          className="font-mono text-[11px] text-neutral-400"
        >
          {PARTICLE_COUNT} hạt · đúng 1 draw call · rê con trỏ để khắc wake
        </p>
      </div>

      {/* HERO */}
      <section className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-4 pt-20 sm:px-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-[#e2e8f0] uppercase">
          Typography là một hệ hạt · field hoặc là chữ hoặc đang thành chữ
        </p>
        <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-neutral-50 sm:text-6xl">
          GLYPH FIELD
        </h2>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-400">
          Tên tôi và mọi heading của trang là cùng một đám 4096 hạt
          glyph sống trong đúng một draw call. Cuộn để chữ tan ra rồi tự
          xếp lại thành tiêu đề kế tiếp; rê con trỏ để khắc một vệt wake
          vào hệ chữ và nhìn nó tự lành.
        </p>
        <p className="mt-8 font-mono text-xs text-neutral-500 motion-safe:animate-pulse">
          ↓ cuộn: hệ chữ bắt đầu thở
        </p>
      </section>

      {/* 4 SECTION HEADING */}
      {HEADINGS.map((heading, index) => (
        <section
          key={heading}
          className="mx-auto flex min-h-[85vh] w-full max-w-5xl items-center px-4 sm:px-6"
        >
          <article
            className={`max-w-sm rounded-lg border border-neutral-900 bg-neutral-950/80 p-5 backdrop-blur-sm ${
              index % 2 === 1 ? "ml-auto" : "sm:ml-14"
            }`}
          >
            <p className="font-mono text-xs tracking-[0.2em] text-[#e2e8f0]/80 uppercase">
              heading {index + 1}/4 · hàng texture {index}
            </p>
            <h3 className="mt-1 font-mono text-2xl text-neutral-100">
              {heading}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-neutral-400">
              {SECTION_NOTES[index]}
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
            Không bloom, không ambient soup: field hoặc là chữ hoặc đang
            thành chữ. Kỹ thuật: toạ độ 4 heading sample từ canvas 2D và
            bake vào một DataTexture float, vertex shader texelFetch hai
            hàng rồi mix với stagger per-seed; con trỏ là một uniform
            stateless, không FBO sim. Cả trang chữ là 1 draw call;
            frameloop demand nên khi chữ đã xếp xong và wake đã lành,
            GPU về đúng 0%. Bản chính thức nâng lên 40k hạt quad atlas
            16 glyph với PerformanceMonitor hạ mật độ theo máy.
          </p>
        </div>
      </section>
    </div>
  );
}
