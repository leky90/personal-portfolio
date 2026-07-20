"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { ToyboxScene } from "@/features/concepts/gravity-toybox/components/toybox-scene";
import type { ToyboxState } from "@/features/concepts/gravity-toybox/lib/toybox-state";

export interface ToyboxCanvasProps {
  toyboxStateRef: { current: ToyboxState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function ToyboxCanvas({ toyboxStateRef, eventSourceRef }: ToyboxCanvasProps) {
  const state = toyboxStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 42, near: 0.1, far: 60, position: [0, 4.6, 9.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <ToyboxScene toyboxState={state} />
    </Canvas>
  );
}
