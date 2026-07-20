"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { ToyboxCanvasProps } from "@/features/concepts/gravity-toybox/components/toybox-canvas";

// Điểm bundle-split duy nhất của three.js cho concept gravity-toybox.
const ToyboxCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/gravity-toybox/components/toybox-canvas"
    ).then((mod) => mod.ToyboxCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang xếp đĩa tạ lên giá…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function ToyboxCanvasLoader(props: ToyboxCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, chồng tạ hiển thị ở khung hình đã nằm yên; bảng cân vẫn đọc được đầy đủ." />
      ) : (
        <ToyboxCanvasLazy {...props} />
      )}
    </div>
  );
}
