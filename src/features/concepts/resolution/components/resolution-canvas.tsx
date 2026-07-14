"use client";

import type { RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import { DemandDriver } from "@/features/concepts/shared/components/demand-driver";
import { AsciiSubject } from "@/features/concepts/resolution/components/ascii-subject";
import { AsciiCover } from "@/features/concepts/resolution/components/ascii-cover";
import { COVER_PROJECTS } from "@/features/concepts/resolution/lib/cover-data";
import type { SceneState } from "@/features/concepts/resolution/lib/scene-state";

export interface ResolutionCanvasProps {
  sceneStateRef: { current: SceneState };
  eventSourceRef: RefObject<HTMLDivElement | null>;
  heroTrackRef: RefObject<HTMLDivElement | null>;
  coverTrackRefs: RefObject<HTMLDivElement | null>[];
}

/**
 * MỘT WebGL context cho toàn trang: các drei <View> scissor-render vào rect
 * của những div track trong DOM (hero + 3 cover). DPR khóa 1 by design —
 * output đã lượng tử hóa theo cell nên retina không thêm chi tiết.
 */
export function ResolutionCanvas({
  sceneStateRef,
  heroTrackRef,
  coverTrackRefs,
}: ResolutionCanvasProps) {
  const sceneState = sceneStateRef.current;

  return (
    <Canvas
      frameloop="demand"
      dpr={1}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
    >
      <DemandDriver state={sceneState} />
      <View track={heroTrackRef as RefObject<HTMLElement>}>
        <AsciiSubject sceneState={sceneState} />
      </View>
      {COVER_PROJECTS.map((project, index) => (
        <View
          key={project.id}
          track={coverTrackRefs[index] as RefObject<HTMLElement>}
        >
          <AsciiCover
            sceneState={sceneState}
            index={index}
            hue={project.hue}
          />
        </View>
      ))}
    </Canvas>
  );
}
