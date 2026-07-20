"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { TraceCanvasProps } from "@/features/concepts/request-lifecycle/components/trace-canvas";

// Điểm bundle-split duy nhất của three.js cho concept request-lifecycle.
const TraceCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/request-lifecycle/components/trace-canvas"
    ).then((mod) => mod.TraceCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang mở kết nối tới edge PoP…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function TraceCanvasLoader(props: TraceCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, trace hiển thị dạng poster toàn tuyến." />
      ) : (
        <TraceCanvasLazy {...props} />
      )}
    </div>
  );
}
