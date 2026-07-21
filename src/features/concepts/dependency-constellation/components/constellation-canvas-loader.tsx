"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { ConstellationCanvasProps } from "@/features/concepts/dependency-constellation/components/constellation-canvas";

// Điểm bundle-split duy nhất của three.js cho concept dependency-constellation.
const ConstellationCanvasLazy = lazy(() =>
  import("@/features/concepts/dependency-constellation/components/constellation-canvas").then((mod) => ({ default: mod.ConstellationCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function ConstellationCanvasLoader(props: ConstellationCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, chòm sao hiển thị dạng poster; query đổi màu tức thì không animation." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang resolve lockfile sự nghiệp…" />}>
          <ConstellationCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
