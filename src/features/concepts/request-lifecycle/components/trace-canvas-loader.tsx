"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { TraceCanvasProps } from "@/features/concepts/request-lifecycle/components/trace-canvas";

// Điểm bundle-split duy nhất của three.js cho concept request-lifecycle.
const TraceCanvasLazy = lazy(() =>
  import("@/features/concepts/request-lifecycle/components/trace-canvas").then((mod) => ({ default: mod.TraceCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function TraceCanvasLoader(props: TraceCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, trace hiển thị dạng poster toàn tuyến." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang mở kết nối tới edge PoP…" />}>
          <TraceCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
