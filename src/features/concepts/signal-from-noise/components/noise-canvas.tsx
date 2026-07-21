"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { NoiseScene } from "@/features/concepts/signal-from-noise/components/noise-scene";
import type { NoiseState } from "@/features/concepts/signal-from-noise/lib/noise-state";

export interface NoiseCanvasProps {
  noiseStateRef: { current: NoiseState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function NoiseCanvas({ noiseStateRef, eventSourceRef }: NoiseCanvasProps) {
  const state = noiseStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 30, position: [0, 0, 5.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <NoiseScene noiseState={state} />
    </Canvas>
  );
}
