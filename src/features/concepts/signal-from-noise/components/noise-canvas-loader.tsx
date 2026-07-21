"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { NoiseCanvasProps } from "@/features/concepts/signal-from-noise/components/noise-canvas";

// Điểm bundle-split duy nhất của three.js cho concept signal-from-noise.
const NoiseCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/signal-from-noise/components/noise-canvas"
    ).then((mod) => mod.NoiseCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang gom nhiễu lạnh…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function NoiseCanvasLoader(props: NoiseCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; các form hiển thị ở trạng thái đã kết tinh, không chaos interlude." />
      ) : (
        <NoiseCanvasLazy {...props} />
      )}
    </div>
  );
}
