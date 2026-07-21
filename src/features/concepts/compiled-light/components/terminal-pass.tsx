"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { easing } from "maath";
import { DuneMaterial } from "@/features/concepts/compiled-light/lib/dune-material";
import { TerminalMaterial } from "@/features/concepts/compiled-light/lib/terminal-material";
import { createGlyphAtlas } from "@/features/concepts/compiled-light/lib/glyph-atlas";
import type { CompiledState } from "@/features/concepts/compiled-light/lib/compiled-state";

interface TerminalPassProps {
  compiledState: CompiledState;
}

/** Cell size theo tiến độ cuộn: coarse ở hero → fine ở cuối trang. */
export function cellPxForProgress(
  progress: number,
  isMobile: boolean,
): number {
  const coarse = isMobile ? 26 : 22;
  const fine = isMobile ? 10 : 7;
  return coarse + (fine - coarse) * Math.min(Math.max(progress, 0), 1);
}

/**
 * Pipeline 3 pass: (1) dune FBM render vào FBO half-res; (2+3) quad
 * clip-space quantize + dither + glyph, thấu kính mix về raw FBO.
 */
export function TerminalPass({ compiledState }: TerminalPassProps) {
  const size = useThree((three) => three.size);
  const clock = useThree((three) => three.clock);

  const duneScene = useMemo(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#020202");
    return scene;
  }, []);
  const duneCamera = useMemo(() => {
    const camera = new THREE.PerspectiveCamera(52, 16 / 9, 0.1, 80);
    camera.position.set(0, 2.5, 9);
    camera.lookAt(0, 0.7, -10);
    return camera;
  }, []);
  const duneMaterial = useMemo(() => new DuneMaterial(), []);

  const fbo = useFBO(720, 405);
  const material = useMemo(() => {
    const mat = new TerminalMaterial();
    mat.uniforms.uSource.value = fbo.texture;
    const atlas = createGlyphAtlas();
    if (atlas) {
      mat.uniforms.uGlyphs.value = atlas;
    }
    return mat;
  }, [fbo]);

  useEffect(() => {
    return () => {
      (material.uniforms.uGlyphs.value as THREE.Texture | null)?.dispose();
      material.dispose();
      duneMaterial.dispose();
    };
  }, [material, duneMaterial]);

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = compiledState;
    const uniforms = material.uniforms;

    duneMaterial.uniforms.uTime.value = clock.getElapsedTime();

    uniforms.uResolution.value.set(size.width, size.height);
    const cellTarget = cellPxForProgress(state.progress, state.isMobile);
    easing.damp(uniforms.uCellPx, "value", cellTarget, 0.25, dt);
    uniforms.uLens.value.set(state.lens.x, state.lens.y);
    easing.damp(
      uniforms.uLensStrength,
      "value",
      state.lens.active ? 1 : 0,
      0.2,
      dt,
    );

    root.gl.setRenderTarget(fbo);
    root.gl.render(duneScene, duneCamera);
    root.gl.setRenderTarget(null);

    // Đang damp cell/lens → xin thêm frame cho chuyển động mượt
    if (
      Math.abs((uniforms.uCellPx.value as number) - cellTarget) > 0.08 ||
      Math.abs(
        (uniforms.uLensStrength.value as number) - (state.lens.active ? 1 : 0),
      ) > 0.01
    ) {
      root.invalidate();
    }
  });

  return (
    <>
      {createPortal(
        <mesh material={duneMaterial}>
          <planeGeometry args={[46, 32, 230, 160]} />
        </mesh>,
        duneScene,
      )}
      <mesh frustumCulled={false} material={material}>
        <planeGeometry args={[2, 2]} />
      </mesh>
    </>
  );
}
