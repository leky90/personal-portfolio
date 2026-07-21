"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { buildLatheProfile } from "@/features/concepts/phosphor-lens/lib/lathe-data";
import { LensMaterial } from "@/features/concepts/phosphor-lens/lib/lens-material";
import {
  coverageFromScroll,
  type LensState,
} from "@/features/concepts/phosphor-lens/lib/lens-state";

interface LensSceneProps {
  lensState: LensState;
}

/**
 * Hai lớp trong MỘT scene: khối kim loại tiện (LatheGeometry + metal
 * chuẩn, 3 đèn) render thường, và một quad clip-space phủ lớp phosphor
 * glyph lên trên — con trỏ đục lỗ alpha xuyên lớp đó. Không FBO, không
 * postprocessing: một pass stateless nên frameloop demand giữ nguyên.
 */
export function LensScene({ lensState }: LensSceneProps) {
  const camera = useThree((three) => three.camera);
  const size = useThree((three) => three.size);
  const viewport = useThree((three) => three.gl);

  const { latheGeometry, lensMaterial } = useMemo(() => {
    const profile = buildLatheProfile().map(
      ([radius, y]) => new THREE.Vector2(radius, y),
    );
    return {
      latheGeometry: new THREE.LatheGeometry(profile, 96),
      lensMaterial: new LensMaterial(),
    };
  }, []);

  useEffect(() => {
    return () => {
      latheGeometry.dispose();
      lensMaterial.dispose();
    };
  }, [latheGeometry, lensMaterial]);

  // Đồng bộ resolution theo pixel thật của canvas
  useEffect(() => {
    const dpr = viewport.getPixelRatio();
    (lensMaterial.uniforms.uResolution.value as THREE.Vector2).set(
      size.width * dpr,
      size.height * dpr,
    );
    lensMaterial.uniforms.uRadius.value = 170 * dpr;
  }, [size, viewport, lensMaterial]);

  const objectRef = useRef<THREE.Mesh>(null);
  const smooth = useRef({ p: 0, strength: 0 });

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = lensState;
    const lambda = 1 - Math.exp(-dt * 6);

    smooth.current.p += (state.progress - smooth.current.p) * lambda;
    const p = smooth.current.p;

    // Vật thể xoay như đang kiểm tra trên máy tiện
    const object = objectRef.current;
    if (object) {
      object.rotation.y = p * Math.PI * 1.2 + 0.4;
    }

    // Lớp phosphor: coverage theo cuộn, lỗ thấu kính theo con trỏ
    lensMaterial.setCoverage(coverageFromScroll(p));
    const dpr = viewport.getPixelRatio();
    if (state.pointerActive) {
      lensMaterial.setPointer(
        state.pointer[0] * dpr,
        (size.height - state.pointer[1]) * dpr,
      );
    } else {
      lensMaterial.setPointer(-9999, -9999);
    }
    lensMaterial.uniforms.uTime.value += dt;

    camera.position.set(0, 1.15, 4.4);
    camera.lookAt(0, 1.05, 0);

    if (Math.abs(state.progress - p) > 1e-4 || state.pointerActive) {
      root.invalidate();
    }
  });

  return (
    <group>
      <hemisphereLight args={["#dfe8ef", "#0a0d0b", 0.55]} />
      <directionalLight position={[3, 4, 3]} intensity={1.6} color="#f2f6fa" />
      <directionalLight position={[-4, 2, -2]} intensity={0.7} color="#9fc4e8" />
      <directionalLight position={[0, -2, 4]} intensity={0.35} color="#67e8f9" />

      {/* Khối kim loại tiện — sự thật dưới lớp phosphor */}
      <mesh ref={objectRef} geometry={latheGeometry} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#c8ccd2"
          metalness={1}
          roughness={0.24}
        />
      </mesh>

      {/* Đế xoay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <circleGeometry args={[1.6, 40]} />
        <meshStandardMaterial color="#101413" roughness={0.9} />
      </mesh>

      {/* Lớp phosphor fullscreen: quad clip-space, render sau cùng */}
      <mesh material={lensMaterial} frustumCulled={false} renderOrder={999}>
        <planeGeometry args={[2, 2]} />
      </mesh>
    </group>
  );
}
