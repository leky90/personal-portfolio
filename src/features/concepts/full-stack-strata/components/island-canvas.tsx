"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { IslandScene } from "@/features/concepts/full-stack-strata/components/island-scene";
import type { IslandState } from "@/features/concepts/full-stack-strata/lib/island-state";

export interface IslandCanvasProps {
  islandStateRef: { current: IslandState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function IslandCanvas({ islandStateRef, eventSourceRef }: IslandCanvasProps) {
  const state = islandStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 70, position: [4.6, 4.4, 9.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <IslandScene islandState={state} />
    </Canvas>
  );
}
