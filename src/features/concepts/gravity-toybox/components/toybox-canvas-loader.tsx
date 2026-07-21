"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { ToyboxCanvasProps } from "@/features/concepts/gravity-toybox/components/toybox-canvas";

// Điểm bundle-split duy nhất của three.js cho concept gravity-toybox.
const ToyboxCanvasLazy = lazy(() =>
  import("@/features/concepts/gravity-toybox/components/toybox-canvas").then((mod) => ({ default: mod.ToyboxCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function ToyboxCanvasLoader(props: ToyboxCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, chồng tạ hiển thị ở khung hình đã nằm yên; bảng cân vẫn đọc được đầy đủ." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang xếp đĩa tạ lên giá…" />}>
          <ToyboxCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
