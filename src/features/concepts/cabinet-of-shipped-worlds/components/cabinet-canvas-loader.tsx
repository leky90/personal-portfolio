"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { CabinetCanvasProps } from "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-canvas";

// Điểm bundle-split duy nhất của three.js cho concept cabinet-of-shipped-worlds.
const CabinetCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-canvas"
    ).then((mod) => mod.CabinetCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang lau bụi tủ kính…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function CabinetCanvasLoader(props: CabinetCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; bốn thế giới hiển thị dạng poster, plaque vẫn đọc được ở thẻ dưới." />
      ) : (
        <CabinetCanvasLazy {...props} />
      )}
    </div>
  );
}
