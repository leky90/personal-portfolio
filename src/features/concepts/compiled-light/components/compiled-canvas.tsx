"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { TerminalPass } from "@/features/concepts/compiled-light/components/terminal-pass";
import type { CompiledState } from "@/features/concepts/compiled-light/lib/compiled-state";

export interface CompiledCanvasProps {
  compiledStateRef: { current: CompiledState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
}

/**
 * Canvas full-viewport — cả trang nhìn qua pass terminal. DPR khóa 1
 * by design: output đã lượng tử hóa theo cell, retina không thêm chi tiết.
 */
export function CompiledCanvas({ compiledStateRef }: CompiledCanvasProps) {
  const state = compiledStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={1}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
    >
      <DemandDriver state={state} />
      <TerminalPass compiledState={state} />
    </Canvas>
  );
}
