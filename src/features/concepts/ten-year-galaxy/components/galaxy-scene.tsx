"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  SUPERNOVAE,
  buildStars,
} from "@/features/concepts/ten-year-galaxy/lib/galaxy-data";
import { GalaxyMaterial } from "@/features/concepts/ten-year-galaxy/lib/galaxy-material";
import type { GalaxyState } from "@/features/concepts/ten-year-galaxy/lib/galaxy-state";

interface GalaxySceneProps {
  galaxyState: GalaxyState;
}

/**
 * 6000 sao = MỘT Points draw call: hai vị trí (bụi trôi / xoắn ốc) là
 * attribute, frontier ngưng tụ bám uProgress trong vertex shader.
 * 10 supernova milestone là 1 InstancedMesh riêng loé khi frontier đi
 * qua. Camera kéo từ trong lõi thấp ra toàn cảnh — chỉ ở "hôm nay" cả
 * hình xoắn ốc mới đọc được.
 */
export function GalaxyScene({ galaxyState }: GalaxySceneProps) {
  const camera = useThree((three) => three.camera);

  const { geometry, material, stars } = useMemo(() => {
    const built = buildStars();
    const points = new THREE.BufferGeometry();
    points.setAttribute(
      "position",
      new THREE.BufferAttribute(built.spiral, 3),
    );
    points.setAttribute("aDust", new THREE.BufferAttribute(built.dust, 3));
    points.setAttribute("aBirth", new THREE.BufferAttribute(built.birth, 1));
    points.setAttribute("aEra", new THREE.BufferAttribute(built.era, 1));
    points.setAttribute("aSeed", new THREE.BufferAttribute(built.seed, 1));
    return { geometry: points, material: new GalaxyMaterial(), stars: built };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const supernovaeRef = useRef<THREE.InstancedMesh>(null);
  const smooth = useRef({ p: 0 });
  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpPos = useRef(new THREE.Vector3());
  const tmpScale = useRef(new THREE.Vector3());

  // Vị trí supernova: mượn toạ độ ngôi sao xoắn ốc có birth gần nhất
  const supernovaPositions = useMemo(() => {
    return SUPERNOVAE.map((supernova) => {
      let best = 0;
      let bestDiff = Infinity;
      for (let i = 0; i < stars.birth.length; i += 40) {
        const diff = Math.abs(stars.birth[i] - supernova.birth);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = i;
        }
      }
      return [
        stars.spiral[best * 3],
        stars.spiral[best * 3 + 1],
        stars.spiral[best * 3 + 2],
      ] as [number, number, number];
    });
  }, [stars]);

  const writeSupernovae = (progress: number) => {
    const mesh = supernovaeRef.current;
    if (!mesh) return;
    SUPERNOVAE.forEach((supernova, index) => {
      const lit = progress >= supernova.birth;
      const nearFrontier =
        Math.abs(progress - supernova.birth) < 0.06 ? 1.8 : 1;
      const s = lit ? 0.09 * nearFrontier : 0.0001;
      tmpMatrix.current.compose(
        tmpPos.current.set(...supernovaPositions[index]),
        tmpQuat.current,
        tmpScale.current.set(s, s, s),
      );
      mesh.setMatrixAt(index, tmpMatrix.current);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  useLayoutEffect(() => {
    writeSupernovae(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supernovaPositions]);

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = galaxyState;

    smooth.current.p +=
      (state.progress - smooth.current.p) * (1 - Math.exp(-dt * 5));
    const p = smooth.current.p;

    material.setProgress(p);
    writeSupernovae(p);

    // Camera: trong lõi thấp nghiêng 35° → kéo lên toàn cảnh
    const pull = p * p;
    camera.position.set(
      2.2 + pull * 6.5,
      1.4 + pull * 8.2,
      3.4 + pull * 8.4,
    );
    camera.lookAt(0, 0, 0);

    if (Math.abs(state.progress - p) > 1e-4) {
      root.invalidate();
    }
  });

  return (
    <group>
      {/* 6000 sao: đúng 1 draw call */}
      <points geometry={geometry} material={material} />

      {/* 10 supernova milestone: 1 InstancedMesh loé theo frontier */}
      <instancedMesh
        ref={supernovaeRef}
        args={[undefined, undefined, SUPERNOVAE.length]}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial
          color="#f5f5ff"
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
}
