"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { TowerScene } from "@/features/concepts/cost-of-change/components/tower-scene";
import type { ChangeState } from "@/features/concepts/cost-of-change/lib/change-state";

export interface TowerCanvasProps {
  changeStateRef: { current: ChangeState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function TowerCanvas({ changeStateRef, eventSourceRef }: TowerCanvasProps) {
  const state = changeStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 44, near: 0.1, far: 90, position: [6.6, 2.6, 9.8] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <TowerScene changeState={state} />
    </Canvas>
  );
}
