"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { DigCanvasProps } from "@/features/concepts/maintenance-archaeology/components/dig-canvas";

// Điểm bundle-split duy nhất của three.js cho concept maintenance-archaeology.
const DigCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/maintenance-archaeology/components/dig-canvas"
    ).then((mod) => mod.DigCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang căng dây trắc địa…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function DigCanvasLoader(props: DigCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, hố khai quật hiển thị dạng poster." />
      ) : (
        <DigCanvasLazy {...props} />
      )}
    </div>
  );
}
