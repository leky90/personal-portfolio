"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { CompiledCanvasProps } from "@/features/concepts/compiled-light/components/compiled-canvas";

// Điểm bundle-split duy nhất của three.js cho concept compiled-light.
const CompiledCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/compiled-light/components/compiled-canvas"
    ).then((mod) => mod.CompiledCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang compile pipeline ánh sáng…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function CompiledCanvasLoader(props: CompiledCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, dune-field hiển thị dạng poster." />
      ) : (
        <CompiledCanvasLazy {...props} />
      )}
    </div>
  );
}
