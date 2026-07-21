"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { TopologyCanvasProps } from "@/features/concepts/living-topology/components/topology-canvas";

// Điểm bundle-split duy nhất của three.js cho concept living-topology.
const TopologyCanvasLazy = lazy(() =>
  import("@/features/concepts/living-topology/components/topology-canvas").then((mod) => ({ default: mod.TopologyCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function TopologyCanvasLoader(props: TopologyCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, bản đồ kiến trúc hiển thị dạng poster." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang nạp bản đồ kiến trúc…" />}>
          <TopologyCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
