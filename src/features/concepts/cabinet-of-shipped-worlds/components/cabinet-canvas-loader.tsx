"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { CabinetCanvasProps } from "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-canvas";

// Điểm bundle-split duy nhất của three.js cho concept cabinet-of-shipped-worlds.
const CabinetCanvasLazy = lazy(() =>
  import("@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-canvas").then((mod) => ({ default: mod.CabinetCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function CabinetCanvasLoader(props: CabinetCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; bốn thế giới hiển thị dạng poster, plaque vẫn đọc được ở thẻ dưới." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang lau bụi tủ kính…" />}>
          <CabinetCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
