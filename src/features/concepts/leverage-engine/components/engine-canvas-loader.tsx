"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { EngineCanvasProps } from "@/features/concepts/leverage-engine/components/engine-canvas";

// Điểm bundle-split duy nhất của three.js cho concept leverage-engine.
const EngineCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/leverage-engine/components/engine-canvas"
    ).then((mod) => mod.EngineCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang cắt răng bánh răng…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function EngineCanvasLoader(props: EngineCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, hộp số hiển thị dạng bản vẽ patent với tỷ số in sẵn." />
      ) : (
        <EngineCanvasLazy {...props} />
      )}
    </div>
  );
}
