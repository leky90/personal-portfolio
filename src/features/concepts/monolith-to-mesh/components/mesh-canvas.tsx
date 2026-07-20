"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { MeshScene } from "@/features/concepts/monolith-to-mesh/components/mesh-scene";
import type { MeshState } from "@/features/concepts/monolith-to-mesh/lib/mesh-state";

export interface MeshCanvasProps {
  meshStateRef: { current: MeshState };
  /** Container DOM của experience — nguồn pointer event cho raycast mảnh */
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function MeshCanvas({ meshStateRef, eventSourceRef }: MeshCanvasProps) {
  const state = meshStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 45, near: 0.1, far: 120, position: [7, 4.5, 9] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} />
      <MeshScene meshState={state} />
    </Canvas>
  );
}
