"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import { easing } from "maath";
import { AsciiMaterial } from "@/features/concepts/resolution/lib/ascii-material";
import { createGlyphAtlas } from "@/features/concepts/resolution/lib/glyph-atlas";
import type { SceneState } from "@/features/concepts/resolution/lib/scene-state";

interface AsciiSubjectProps {
  sceneState: SceneState;
}

/**
 * Chủ thể hero: TorusKnot (placeholder cho chân dung video) render vào FBO,
 * rồi một quad clip-space vẽ FBO đó qua pipeline ASCII. Lens/focus damp mỗi
 * frame từ SceneState — không đi qua React state.
 */
export function AsciiSubject({ sceneState }: AsciiSubjectProps) {
  const size = useThree((three) => three.size);
  const knotRef = useRef<THREE.Mesh>(null);

  const subjectScene = useMemo(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0a0a");
    return scene;
  }, []);
  const subjectCamera = useMemo(() => {
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
    camera.position.set(0, 0, 5.4);
    return camera;
  }, []);

  const fbo = useFBO(512, 512);
  const material = useMemo(() => {
    const mat = new AsciiMaterial();
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
    };
  }, [material]);

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const knot = knotRef.current;
    if (knot) {
      knot.rotation.x += dt * 0.22;
      knot.rotation.y += dt * 0.38;
    }

    const uniforms = material.uniforms;
    uniforms.uResolution.value.set(size.width, size.height);
    uniforms.uCellPx.value = 14 * sceneState.cellScale;
    uniforms.uLens.value.set(sceneState.lens.x, sceneState.lens.y);

    const lensTarget =
      sceneState.lens.active && !sceneState.isCoarsePointer ? 1 : 0;
    const focusTarget = sceneState.tapFine ? 1 : 0;
    easing.damp(uniforms.uLensStrength, "value", lensTarget, 0.2, dt);
    easing.damp(uniforms.uFocus, "value", focusTarget, 0.25, dt);

    root.gl.setRenderTarget(fbo);
    root.gl.render(subjectScene, subjectCamera);
    root.gl.setRenderTarget(null);
  });

  return (
    <>
      {createPortal(
        <group>
          <ambientLight intensity={0.25} />
          <directionalLight
            position={[2.5, 2.5, 3]}
            intensity={2.4}
            color="#fff6e8"
          />
          <pointLight position={[-3, -2, 2]} intensity={6} color="#b4ff39" />
          <mesh ref={knotRef}>
            <torusKnotGeometry args={[1.15, 0.34, 220, 28]} />
            <meshStandardMaterial
              color="#d6d6d6"
              metalness={0.35}
              roughness={0.28}
            />
          </mesh>
        </group>,
        subjectScene,
      )}
      <mesh frustumCulled={false} material={material}>
        <planeGeometry args={[2, 2]} />
      </mesh>
    </>
  );
}
