"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { IslandCanvasProps } from "@/features/concepts/full-stack-strata/components/island-canvas";

// Điểm bundle-split duy nhất của three.js cho concept full-stack-strata.
const IslandCanvasLazy = lazy(() =>
  import("@/features/concepts/full-stack-strata/components/island-canvas").then((mod) => ({ default: mod.IslandCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function IslandCanvasLoader(props: IslandCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, lát cắt đảo hiển thị dạng poster; trace in ra tức thì dưới dạng text." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang nâng hòn đảo lên khỏi void…" />}>
          <IslandCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
