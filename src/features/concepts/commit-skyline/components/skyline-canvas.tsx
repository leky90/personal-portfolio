"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { SkylineScene } from "@/features/concepts/commit-skyline/components/skyline-scene";
import type { SkylineState } from "@/features/concepts/commit-skyline/lib/skyline-state";

export interface SkylineCanvasProps {
  skylineStateRef: { current: SkylineState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function SkylineCanvas({
  skylineStateRef,
  eventSourceRef,
}: SkylineCanvasProps) {
  const state = skylineStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 60, position: [-3, 1.7, 4.2] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <SkylineScene skylineState={state} />
    </Canvas>
  );
}
