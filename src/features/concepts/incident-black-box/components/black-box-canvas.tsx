"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { TapeScene } from "@/features/concepts/incident-black-box/components/tape-scene";
import type { BlackBoxState } from "@/features/concepts/incident-black-box/lib/black-box-state";

export interface BlackBoxCanvasProps {
  blackBoxStateRef: { current: BlackBoxState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function BlackBoxCanvas({
  blackBoxStateRef,
  eventSourceRef,
}: BlackBoxCanvasProps) {
  const state = blackBoxStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 46, near: 0.1, far: 120, position: [0, 1.6, 8.5] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={250} />
      <TapeScene blackBoxState={state} />
    </Canvas>
  );
}
