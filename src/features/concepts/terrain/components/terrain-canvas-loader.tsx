"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { TerrainCanvasProps } from "@/features/concepts/terrain/components/terrain-canvas";

// Điểm bundle-split duy nhất của three.js cho concept terrain.
const TerrainCanvasLazy = dynamic(
  () =>
    import("@/features/concepts/terrain/components/terrain-canvas").then(
      (mod) => mod.TerrainCanvas,
    ),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang bake 10 năm địa hình…" />,
  },
);

/**
 * Rẽ nhánh TRƯỚC khi chạm chunk three.js: user bật reduced-motion nhận
 * poster tĩnh — camera dolly, breathing, ripple đều không tồn tại với họ.
 */
export function TerrainCanvasLoader(props: TerrainCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, địa hình hiển thị dạng poster." />
      ) : (
        <TerrainCanvasLazy {...props} />
      )}
    </div>
  );
}
