"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { BadgeScene } from "@/features/concepts/lanyard-badge/components/badge-scene";
import type { BadgeState } from "@/features/concepts/lanyard-badge/lib/badge-state";

export interface BadgeCanvasProps {
  badgeStateRef: { current: BadgeState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function BadgeCanvas({ badgeStateRef, eventSourceRef }: BadgeCanvasProps) {
  const state = badgeStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 40, near: 0.1, far: 30, position: [0, 1.2, 4.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      {/* ambient 6s: cú gió nhẹ đánh thức con lắc rồi lại ngủ */}
      <DemandDriver state={state} ambientMs={6000} />
      <BadgeScene badgeState={state} />
    </Canvas>
  );
}
