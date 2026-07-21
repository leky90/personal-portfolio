"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { DeskCanvasProps } from "@/features/concepts/desk-version-controlled/components/desk-canvas";

// Điểm bundle-split duy nhất của three.js cho concept desk-version-controlled.
const DeskCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/desk-version-controlled/components/desk-canvas"
    ).then((mod) => mod.DeskCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang lắp mặt bàn 2016…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function DeskCanvasLoader(props: DeskCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; lịch sử commit của chiếc bàn vẫn đọc đủ trong các thẻ era." />
      ) : (
        <DeskCanvasLazy {...props} />
      )}
    </div>
  );
}
