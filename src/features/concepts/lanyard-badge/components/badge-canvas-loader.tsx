"use client";

import dynamic from "next/dynamic";
import { ScenePoster } from "@/features/concepts/shared/components/scene-poster";
import { usePrefersReducedMotion } from "@/features/concepts/shared/hooks/use-prefers-reduced-motion";
import type { BadgeCanvasProps } from "@/features/concepts/lanyard-badge/components/badge-canvas";

// Điểm bundle-split duy nhất của three.js cho concept lanyard-badge.
const BadgeCanvasLazy = dynamic(
  () =>
    import(
      "@/features/concepts/lanyard-badge/components/badge-canvas"
    ).then((mod) => mod.BadgeCanvas),
  {
    ssr: false,
    loading: () => <ScenePoster note="Đang xỏ dây đeo thẻ…" />,
  },
);

/** Rẽ nhánh reduced-motion TRƯỚC khi chạm chunk three.js. */
export function BadgeCanvasLoader(props: BadgeCanvasProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      {prefersReduced ? (
        <ScenePoster note="Bản tĩnh — thiết bị đang bật giảm chuyển động; thẻ treo yên, spec sheet vẫn đọc đủ ở section dưới." />
      ) : (
        <BadgeCanvasLazy {...props} />
      )}
    </div>
  );
}
