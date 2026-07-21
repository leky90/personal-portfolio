"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { LensScene } from "@/features/concepts/phosphor-lens/components/lens-scene";
import type { LensState } from "@/features/concepts/phosphor-lens/lib/lens-state";

export interface LensCanvasProps {
  lensStateRef: { current: LensState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function LensCanvas({ lensStateRef, eventSourceRef }: LensCanvasProps) {
  const state = lensStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 38, near: 0.1, far: 30, position: [0, 1.15, 4.4] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      {/* ambient 350ms: shimmer phosphor nhấp nháy chậm kiểu CRT */}
      <DemandDriver state={state} ambientMs={350} />
      <LensScene lensState={state} />
    </Canvas>
  );
}
