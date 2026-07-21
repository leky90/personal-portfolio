"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { GalaxyCanvasProps } from "@/features/concepts/ten-year-galaxy/components/galaxy-canvas";

// Điểm bundle-split duy nhất của three.js cho concept ten-year-galaxy.
const GalaxyCanvasLazy = lazy(() =>
  import("@/features/concepts/ten-year-galaxy/components/galaxy-canvas").then((mod) => ({ default: mod.GalaxyCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function GalaxyCanvasLoader(props: GalaxyCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; thiên hà hiển thị ở khung đã hoàn chỉnh (uProgress = 1), không twinkle." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang gom bụi sao 520 tuần…" />}>
          <GalaxyCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
