"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { GlyphCanvasProps } from "@/features/concepts/glyph-field/components/glyph-canvas";

// Điểm bundle-split duy nhất của three.js cho concept glyph-field.
const GlyphCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/glyph-field/components/glyph-canvas"
    ).then((mod) => mod.GlyphCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang sample 4096 hạt glyph…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function GlyphCanvasLoader(props: GlyphCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; heading DOM là baseline nên nội dung vẫn nguyên vẹn không cần hạt." />
      ) : (
        <GlyphCanvasLazy {...props} />
      )}
    </div>
  );
}
