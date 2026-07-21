"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { DigCanvasProps } from "@/features/concepts/maintenance-archaeology/components/dig-canvas";

// Điểm bundle-split duy nhất của three.js cho concept maintenance-archaeology.
const DigCanvasLazy = lazy(() =>
  import("@/features/concepts/maintenance-archaeology/components/dig-canvas").then((mod) => ({ default: mod.DigCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function DigCanvasLoader(props: DigCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, hố khai quật hiển thị dạng poster." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang căng dây trắc địa…" />}>
          <DigCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
