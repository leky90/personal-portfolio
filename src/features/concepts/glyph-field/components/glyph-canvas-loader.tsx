"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { GlyphCanvasProps } from "@/features/concepts/glyph-field/components/glyph-canvas";

// Điểm bundle-split duy nhất của three.js cho concept glyph-field.
const GlyphCanvasLazy = lazy(() =>
  import("@/features/concepts/glyph-field/components/glyph-canvas").then((mod) => ({ default: mod.GlyphCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function GlyphCanvasLoader(props: GlyphCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; heading DOM là baseline nên nội dung vẫn nguyên vẹn không cần hạt." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang sample 4096 hạt glyph…" />}>
          <GlyphCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
