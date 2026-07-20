"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { TrenchScene } from "@/features/concepts/maintenance-archaeology/components/trench-scene";
import type { DigState } from "@/features/concepts/maintenance-archaeology/lib/dig-state";

export interface DigCanvasProps {
  digStateRef: { current: DigState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function DigCanvas({ digStateRef, eventSourceRef }: DigCanvasProps) {
  const state = digStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 46, near: 0.1, far: 120, position: [0, 0, 13.5] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={250} />
      <TrenchScene digState={state} />
    </Canvas>
  );
}
