"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { ConstellationCanvasProps } from "@/features/concepts/dependency-constellation/components/constellation-canvas";

// Điểm bundle-split duy nhất của three.js cho concept dependency-constellation.
const ConstellationCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/dependency-constellation/components/constellation-canvas"
    ).then((mod) => mod.ConstellationCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang resolve lockfile sự nghiệp…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function ConstellationCanvasLoader(props: ConstellationCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, chòm sao hiển thị dạng poster; query đổi màu tức thì không animation." />
      ) : (
        <ConstellationCanvasLazy {...props} />
      )}
    </div>
  );
}
