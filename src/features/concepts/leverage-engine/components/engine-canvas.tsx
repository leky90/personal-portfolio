"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { EngineScene } from "@/features/concepts/leverage-engine/components/engine-scene";
import type { EngineState } from "@/features/concepts/leverage-engine/lib/engine-state";

export interface EngineCanvasProps {
  engineStateRef: { current: EngineState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function EngineCanvas({ engineStateRef, eventSourceRef }: EngineCanvasProps) {
  const state = engineStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 38, near: 0.1, far: 60, position: [1.1, 0.4, 11] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <EngineScene engineState={state} />
    </Canvas>
  );
}
