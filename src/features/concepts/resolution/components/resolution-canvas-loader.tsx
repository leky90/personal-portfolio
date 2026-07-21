"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { ResolutionCanvasProps } from "@/features/concepts/resolution/components/resolution-canvas";

// Điểm bundle-split duy nhất của three.js — chỉ tải khi thật sự render canvas.
const ResolutionCanvasLazy = lazy(() =>
  import("@/features/concepts/resolution/components/resolution-canvas").then((mod) => ({ default: mod.ResolutionCanvas })),
);

/**
 * Rẽ nhánh TRƯỚC khi chạm chunk three.js: user bật reduced-motion nhận
 * poster tĩnh và không bao giờ tải WebGL.
 */
export function ResolutionCanvasLoader(props: ResolutionCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, pipeline ASCII hiển thị dạng poster." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang tải pipeline ASCII…" />}>
          <ResolutionCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
