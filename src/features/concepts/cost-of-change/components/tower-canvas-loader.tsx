"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { TowerCanvasProps } from "@/features/concepts/cost-of-change/components/tower-canvas";

// Điểm bundle-split duy nhất của three.js cho concept cost-of-change.
const TowerCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/cost-of-change/components/tower-canvas"
    ).then((mod) => mod.TowerCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang đổ móng năm 2016…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function TowerCanvasLoader(props: TowerCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, tháp truss hiển thị dạng poster năm cuối." />
      ) : (
        <TowerCanvasLazy {...props} />
      )}
    </div>
  );
}
