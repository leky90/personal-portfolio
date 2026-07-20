"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { DecisionScene } from "@/features/concepts/decision-diff/components/decision-scene";
import type { DecisionState } from "@/features/concepts/decision-diff/lib/decision-state";

export interface DecisionCanvasProps {
  decisionStateRef: { current: DecisionState };
  /** Container DOM của experience — nguồn pointer event cho raycast nhánh ma */
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

export function DecisionCanvas({
  decisionStateRef,
  eventSourceRef,
}: DecisionCanvasProps) {
  const state = decisionStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      camera={{ fov: 50, near: 0.1, far: 220, position: [0, 2.7, -16] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      eventSource={(eventSourceRef as RefObject<HTMLElement>) ?? undefined}
      eventPrefix="client"
    >
      <DemandDriver state={state} ambientMs={250} />
      <DecisionScene decisionState={state} />
    </Canvas>
  );
}
