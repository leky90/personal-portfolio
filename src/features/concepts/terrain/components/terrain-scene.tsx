"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { easing } from "maath";
import { ERAS } from "@/features/concepts/terrain/lib/career-data";
import {
  TERRAIN_DEPTH,
  TERRAIN_WIDTH,
  createCameraPath,
  sampleCameraPath,
} from "@/features/concepts/terrain/lib/camera-path";
import {
  buildHeightField,
  buildHeightTexture,
} from "@/features/concepts/terrain/lib/height-field";
import { buildRidgelineGeometry } from "@/features/concepts/terrain/lib/terrain-geometry";
import { TerrainMaterial } from "@/features/concepts/terrain/lib/terrain-material";
import type { TerrainState } from "@/features/concepts/terrain/lib/terrain-state";

interface TerrainSceneProps {
  terrainState: TerrainState;
}

/**
 * Toàn bộ centerpiece: 1 LineSegments (1 draw call) + camera dolly theo
 * spline. Mỗi frame chỉ damp vài uniform và vị trí camera — zero allocation.
 */
export function TerrainScene({ terrainState }: TerrainSceneProps) {
  const camera = useThree((three) => three.camera);
  const clock = useThree((three) => three.clock);

  const lines = terrainState.isMobile ? 150 : 280;
  const samples = terrainState.isMobile ? 224 : 420;

  const { geometry, material, path } = useMemo(() => {
    const field = buildHeightField(lines, samples);
    const terrainMaterial = new TerrainMaterial();
    terrainMaterial.uniforms.uHeight.value = buildHeightTexture(field);
    return {
      geometry: buildRidgelineGeometry(lines, samples),
      material: terrainMaterial,
      path: createCameraPath(),
    };
  }, [lines, samples]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      (material.uniforms.uHeight.value as THREE.Texture | null)?.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  // Preallocate — dùng lại mỗi frame, không new trong useFrame
  const smoothProgress = useRef({ t: 0 });
  const cameraPos = useRef(new THREE.Vector3());
  const cameraTarget = useRef(new THREE.Vector3());

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = terrainState;

    easing.damp(smoothProgress.current, "t", state.progress, 0.32, dt);
    sampleCameraPath(
      path,
      smoothProgress.current.t,
      cameraPos.current,
      cameraTarget.current,
    );
    camera.position.copy(cameraPos.current);
    camera.lookAt(cameraTarget.current);

    const uniforms = material.uniforms;
    uniforms.uTime.value = clock.getElapsedTime();
    const eraTarget = state.era >= 0 ? ERAS[state.era].timeU : -1;
    easing.damp(uniforms.uEraV, "value", eraTarget, 0.4, dt);
    uniforms.uRippleOrigin.value.set(state.ripple.x, state.ripple.z);
    uniforms.uRippleStart.value = state.ripple.startAt;

    // Camera chưa tới target → xin thêm frame để dolly mượt
    if (Math.abs(smoothProgress.current.t - state.progress) > 0.0004) {
      root.invalidate();
    }
  });

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    terrainState.ripple.x = event.point.x;
    terrainState.ripple.z = event.point.z;
    terrainState.ripple.startAt = clock.getElapsedTime();
    terrainState.invalidate?.();
  };

  return (
    <>
      <lineSegments
        geometry={geometry}
        material={material}
        frustumCulled={false}
      />
      {/* Mặt phẳng vô hình bắt raycast cho ripple — không render gì */}
      <mesh
        position={[0, 0, TERRAIN_DEPTH / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerMove={handlePointerMove}
      >
        <planeGeometry args={[TERRAIN_WIDTH, TERRAIN_DEPTH + 60]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}
