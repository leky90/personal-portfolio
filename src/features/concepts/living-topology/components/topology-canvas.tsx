"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { TopologyScene } from "@/features/concepts/living-topology/components/topology-scene";
import type { TopologyState } from "@/features/concepts/living-topology/lib/topology-state";

export interface TopologyCanvasProps {
  topologyStateRef: { current: TopologyState };
  /** Container DOM của experience — nguồn pointer event cho raycast node */
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function TopologyCanvas({
  topologyStateRef,
  eventSourceRef,
}: TopologyCanvasProps) {
  const state = topologyStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 45, near: 0.1, far: 120, position: [0, 5, 30] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} />
      <TopologyScene topologyState={state} />
    </Canvas>
  );
}
