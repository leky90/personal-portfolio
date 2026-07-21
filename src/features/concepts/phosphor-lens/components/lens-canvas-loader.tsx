"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { LensCanvasProps } from "@/features/concepts/phosphor-lens/components/lens-canvas";

// Điểm bundle-split duy nhất của three.js cho concept phosphor-lens.
const LensCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/phosphor-lens/components/lens-canvas"
    ).then((mod) => mod.LensCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang hâm nóng ống phosphor…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function LensCanvasLoader(props: LensCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; khối kim loại hiển thị bản resolve sẵn, không shimmer." />
      ) : (
        <LensCanvasLazy {...props} />
      )}
    </div>
  );
}
