"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { MonolithCanvasProps } from "@/features/concepts/monolith/components/monolith-canvas";

// Điểm bundle-split duy nhất của three.js cho concept monolith.
const MonolithCanvasLazy = lazy(() =>
  import("@/features/concepts/monolith/components/monolith-canvas").then((mod) => ({ default: mod.MonolithCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function MonolithCanvasLoader(props: MonolithCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, khối chữ hiển thị dạng poster." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang đục khối chữ…" />}>
          <MonolithCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
