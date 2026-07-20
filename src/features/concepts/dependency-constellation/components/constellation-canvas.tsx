"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { ConstellationScene } from "@/features/concepts/dependency-constellation/components/constellation-scene";
import {
  queryNode,
  type ConstellationState,
} from "@/features/concepts/dependency-constellation/lib/constellation-state";

export interface ConstellationCanvasProps {
  constellationStateRef: { current: ConstellationState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function ConstellationCanvas({
  constellationStateRef,
  eventSourceRef,
}: ConstellationCanvasProps) {
  const state = constellationStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 44, near: 0.1, far: 80, position: [4.6, 1.6, 9.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
      onPointerMissed={() => {
        state.pinned = false;
        queryNode(state, null);
      }}
    >
      <DemandDriver state={state} ambientMs={500} />
      <ConstellationScene constellationState={state} />
    </Canvas>
  );
}
