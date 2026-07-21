"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { GalaxyScene } from "@/features/concepts/ten-year-galaxy/components/galaxy-scene";
import type { GalaxyState } from "@/features/concepts/ten-year-galaxy/lib/galaxy-state";

export interface GalaxyCanvasProps {
  galaxyStateRef: { current: GalaxyState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function GalaxyCanvas({
  galaxyStateRef,
  eventSourceRef,
}: GalaxyCanvasProps) {
  const state = galaxyStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 50, near: 0.1, far: 80, position: [2.2, 1.4, 3.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <GalaxyScene galaxyState={state} />
    </Canvas>
  );
}
