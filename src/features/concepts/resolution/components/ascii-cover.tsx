"use client";

import { useEffect, useMemo } from "react";
import type * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { AsciiMaterial } from "@/features/concepts/resolution/lib/ascii-material";
import { createGlyphAtlas } from "@/features/concepts/resolution/lib/glyph-atlas";
import {
  createCoverTexture,
  createFallbackCoverTexture,
} from "@/features/concepts/resolution/lib/cover-texture";
import type { SceneState } from "@/features/concepts/resolution/lib/scene-state";

interface AsciiCoverProps {
  sceneState: SceneState;
  /** Index của card trong SceneState.cardFocus */
  index: number;
  hue: number;
}

/**
 * Cover một case study: texture procedural render qua ĐÚNG pipeline ASCII
 * của hero (cùng shader, khác uniform). Hover/focus DOM ghi target 0|1 vào
 * cardFocus — useFrame damp uFocus nên cover "resolve" mượt về ảnh nét.
 */
export function AsciiCover({ sceneState, index, hue }: AsciiCoverProps) {
  const size = useThree((three) => three.size);

  const texture = useMemo(
    () => createCoverTexture(hue) ?? createFallbackCoverTexture(hue),
    [hue],
  );
  const material = useMemo(() => {
    const mat = new AsciiMaterial();
    mat.uniforms.uSource.value = texture;
    mat.uniforms.uCellPx.value = 11;
    const atlas = createGlyphAtlas();
    if (atlas) {
      mat.uniforms.uGlyphs.value = atlas;
    }
    return mat;
  }, [texture]);

  useEffect(() => {
    return () => {
      texture.dispose();
      (material.uniforms.uGlyphs.value as THREE.Texture | null)?.dispose();
      material.dispose();
    };
  }, [texture, material]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const uniforms = material.uniforms;
    uniforms.uResolution.value.set(size.width, size.height);
    uniforms.uCellPx.value = 11 * sceneState.cellScale;
    easing.damp(
      uniforms.uFocus,
      "value",
      sceneState.cardFocus[index] ?? 0,
      0.22,
      dt,
    );
  });

  return (
    <mesh frustumCulled={false} material={material}>
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
