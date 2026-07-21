"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { DeskScene } from "@/features/concepts/desk-version-controlled/components/desk-scene";
import type { DeskState } from "@/features/concepts/desk-version-controlled/lib/desk-state";

export interface DeskCanvasProps {
  deskStateRef: { current: DeskState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function DeskCanvas({ deskStateRef, eventSourceRef }: DeskCanvasProps) {
  const state = deskStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      // fov hẹp + camera xa = cảm giác isometric mà không cần ortho rig
      camera={{ fov: 22, near: 0.1, far: 60, position: [9.6, 8.2, 9.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={500} />
      <DeskScene deskState={state} />
    </Canvas>
  );
}
