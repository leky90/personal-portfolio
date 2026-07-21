"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { DecisionCanvasProps } from "@/features/concepts/decision-diff/components/decision-canvas";

// Điểm bundle-split duy nhất của three.js cho concept decision-diff.
const DecisionCanvasLazy = lazy(() =>
  import("@/features/concepts/decision-diff/components/decision-canvas").then((mod) => ({ default: mod.DecisionCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function DecisionCanvasLoader(props: DecisionCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, decision rail hiển thị dạng poster." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang compile decision log thành rail…" />}>
          <DecisionCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
