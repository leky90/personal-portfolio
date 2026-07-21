"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { TerrainCanvasProps } from "@/features/concepts/terrain/components/terrain-canvas";

// Điểm bundle-split duy nhất của three.js cho concept terrain.
const TerrainCanvasLazy = lazy(() =>
  import("@/features/concepts/terrain/components/terrain-canvas").then((mod) => ({ default: mod.TerrainCanvas })),
);

/**
 * Rẽ nhánh TRƯỚC khi chạm chunk three.js: user bật reduced-motion nhận
 * poster tĩnh — camera dolly, breathing, ripple đều không tồn tại với họ.
 */
export function TerrainCanvasLoader(props: TerrainCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, địa hình hiển thị dạng poster." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang bake 10 năm địa hình…" />}>
          <TerrainCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
