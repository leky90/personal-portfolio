"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { KeyboardCanvasProps } from "@/features/concepts/daily-driver/components/keyboard-canvas";

// Điểm bundle-split duy nhất của three.js cho concept daily-driver.
const KeyboardCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/daily-driver/components/keyboard-canvas"
    ).then((mod) => mod.KeyboardCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang lube switch…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function KeyboardCanvasLoader(props: KeyboardCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động, bàn phím hiển thị dạng poster; lệnh vẫn gõ được ở prompt." />
      ) : (
        <KeyboardCanvasLazy {...props} />
      )}
    </div>
  );
}
