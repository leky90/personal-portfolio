"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { MeshCanvasProps } from "@/features/concepts/monolith-to-mesh/components/mesh-canvas";

// Điểm bundle-split duy nhất của three.js cho concept monolith-to-mesh.
const MeshCanvasLazy = lazy(() =>
  import("@/features/concepts/monolith-to-mesh/components/mesh-canvas").then((mod) => ({ default: mod.MeshCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function MeshCanvasLoader(props: MeshCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, khối monolith hiển thị dạng poster." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang kerf-cut khối monolith…" />}>
          <MeshCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
