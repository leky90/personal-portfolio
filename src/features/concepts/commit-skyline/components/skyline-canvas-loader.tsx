"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { SkylineCanvasProps } from "@/features/concepts/commit-skyline/components/skyline-canvas";

// Điểm bundle-split duy nhất của three.js cho concept commit-skyline.
const SkylineCanvasLazy = lazy(() =>
  import("@/features/concepts/commit-skyline/components/skyline-canvas").then((mod) => ({ default: mod.SkylineCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function SkylineCanvasLoader(props: SkylineCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, thành phố commit hiển thị một khung poster giữa đại lộ." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang thắp đèn 3650 toà nhà…" />}>
          <SkylineCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
