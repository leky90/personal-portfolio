"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { CabinetScene } from "@/features/concepts/cabinet-of-shipped-worlds/components/cabinet-scene";
import type { CabinetState } from "@/features/concepts/cabinet-of-shipped-worlds/lib/cabinet-state";

export interface CabinetCanvasProps {
  cabinetStateRef: { current: CabinetState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function CabinetCanvas({
  cabinetStateRef,
  eventSourceRef,
}: CabinetCanvasProps) {
  const state = cabinetStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 40, near: 0.1, far: 40, position: [0, 0.7, 6.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <CabinetScene cabinetState={state} />
    </Canvas>
  );
}
