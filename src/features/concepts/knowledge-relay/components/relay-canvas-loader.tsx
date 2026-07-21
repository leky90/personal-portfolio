"use client";

import { Suspense, lazy } from "react";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { RelayCanvasProps } from "@/features/concepts/knowledge-relay/components/relay-canvas";

// Điểm bundle-split duy nhất của three.js cho concept knowledge-relay.
const RelayCanvasLazy = lazy(() =>
  import("@/features/concepts/knowledge-relay/components/relay-canvas").then((mod) => ({ default: mod.RelayCanvas })),
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function RelayCanvasLoader(props: RelayCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, biểu đồ relay hiển thị ở khung năm 2026 với toàn bộ hành trình gậy." />
      ) : (
        <Suspense fallback={<ScenePoster note="Đang kẻ biểu đồ Marey…" />}>
          <RelayCanvasLazy {...props} />
        </Suspense>
      )}
    </div>
  );
}
