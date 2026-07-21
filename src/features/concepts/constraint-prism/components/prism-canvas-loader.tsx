"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { PrismCanvasProps } from "@/features/concepts/constraint-prism/components/prism-canvas";

// Điểm bundle-split duy nhất của three.js cho concept constraint-prism.
const PrismCanvasLazy = lazy(() =>
  import("@/features/concepts/constraint-prism/components/prism-canvas").then((mod) => ({ default: mod.PrismCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function PrismCanvasLoader(props: PrismCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, lăng kính hiển thị dạng poster; toggle ràng buộc vẫn cập nhật danh sách thiết kế." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang mài mặt kính ràng buộc…" />}>
          <PrismCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
