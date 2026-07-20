"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { PrismScene } from "@/features/concepts/constraint-prism/components/prism-scene";
import type { PrismState } from "@/features/concepts/constraint-prism/lib/prism-state";

export interface PrismCanvasProps {
  prismStateRef: { current: PrismState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function PrismCanvas({ prismStateRef, eventSourceRef }: PrismCanvasProps) {
  const state = prismStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 40, near: 0.1, far: 60, position: [0, 0.55, 9.8] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <PrismScene prismState={state} />
    </Canvas>
  );
}
