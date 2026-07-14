"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { TerrainScene } from "@/features/concepts/terrain/components/terrain-scene";
import type { TerrainState } from "@/features/concepts/terrain/lib/terrain-state";

export interface TerrainCanvasProps {
  terrainStateRef: { current: TerrainState };
  /** Container DOM của experience — nguồn pointer event cho raycast ripple */
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function TerrainCanvas({
  terrainStateRef,
  eventSourceRef,
}: TerrainCanvasProps) {
  const state = terrainStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 320, position: [0, 7.5, -16] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={
        (eventSourceRef as RefObject<HTMLElement>) ?? undefined
      }
      eventPrefix="client"
    >
      <DemandDriver state={state} />
      <TerrainScene terrainState={state} />
    </Canvas>
  );
}
