"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { LensCanvasProps } from "@/features/concepts/phosphor-lens/components/lens-canvas";

// Điểm bundle-split duy nhất của three.js cho concept phosphor-lens.
const LensCanvasLazy = lazy(() =>
  import("@/features/concepts/phosphor-lens/components/lens-canvas").then((mod) => ({ default: mod.LensCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function LensCanvasLoader(props: LensCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; khối kim loại hiển thị bản resolve sẵn, không shimmer." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang hâm nóng ống phosphor…" />}>
          <LensCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
