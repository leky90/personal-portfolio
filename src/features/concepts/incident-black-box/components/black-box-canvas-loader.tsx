"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { BlackBoxCanvasProps } from "@/features/concepts/incident-black-box/components/black-box-canvas";

// Điểm bundle-split duy nhất của three.js cho concept incident-black-box.
const BlackBoxCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/incident-black-box/components/black-box-canvas"
    ).then((mod) => mod.BlackBoxCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang tua băng về 14:02…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function BlackBoxCanvasLoader(props: BlackBoxCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, băng sự cố hiển thị dạng poster." />
      ) : (
        <BlackBoxCanvasLazy {...props} />
      )}
    </div>
  );
}
