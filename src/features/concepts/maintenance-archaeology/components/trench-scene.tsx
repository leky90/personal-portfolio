"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { easing } from "maath";
import {
  STRATA,
  TRENCH_HEIGHT,
  TRENCH_TOP,
  buildDig,
} from "@/features/concepts/maintenance-archaeology/lib/strata-data";
import { TrenchMaterial } from "@/features/concepts/maintenance-archaeology/lib/trench-material";
import type { DigState } from "@/features/concepts/maintenance-archaeology/lib/dig-state";

interface TrenchSceneProps {
  digState: DigState;
}

const STRATUM_TINTS = ["#9aa2ad", "#a89a8a", "#c2a077", "#d4a24c", "#d97b53"];

/**
 * Hố khai quật nhìn thẳng mặt cắt: vách 1 draw call (era ramp bake CPU),
 * 48 mảnh module 1 InstancedMesh, lưới dây trắc địa 1 LineSegments.
 * Cuộn = camera tụt sâu xuống 10 năm; hover = mũi probe carbon-dating.
 */
export function TrenchScene({ digState }: TrenchSceneProps) {
  const camera = useThree((three) => three.camera);

  const { artifacts, trenchMaterial, gridGeometry, shardMaterial } = useMemo(() => {
    const dig = buildDig(7);

    // Lưới dây trắc địa: dọc mỗi 4 đơn vị, ngang theo ranh giới stratum
    const points: number[] = [];
    for (let x = -14; x <= 14; x += 4) {
      points.push(x, TRENCH_TOP, 0.05, x, TRENCH_TOP - TRENCH_HEIGHT, 0.05);
    }
    for (const stratum of STRATA) {
      points.push(-15, stratum.yTop, 0.05, 15, stratum.yTop, 0.05);
    }
    const grid = new THREE.BufferGeometry();
    grid.setAttribute(
      "position",
      new THREE.BufferAttribute(Float32Array.from(points), 3),
    );

    return {
      artifacts: dig,
      trenchMaterial: new TrenchMaterial(),
      gridGeometry: grid,
      shardMaterial: new THREE.MeshStandardMaterial({
        roughness: 0.7,
        metalness: 0.15,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      (trenchMaterial.uniforms.uEraRamp.value as THREE.Texture).dispose();
      trenchMaterial.dispose();
      gridGeometry.dispose();
      shardMaterial.dispose();
    };
  }, [trenchMaterial, gridGeometry, shardMaterial]);

  const shardsRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const lastProbed = useRef(-1);

  const writeShardMatrix = (index: number, bump: number) => {
    const shards = shardsRef.current;
    if (!shards) return;
    const artifact = artifacts[index];
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(artifact.rotationSeed, artifact.rotationSeed * 1.7, 0),
    );
    const s = 0.32 * artifact.scale * bump;
    matrix.compose(
      new THREE.Vector3(...artifact.position),
      quaternion,
      new THREE.Vector3(s, s, s),
    );
    shards.setMatrixAt(index, matrix);
  };

  // Matrix + màu theo stratum đặt một lần
  useLayoutEffect(() => {
    const shards = shardsRef.current;
    if (!shards) return;
    const color = new THREE.Color();
    artifacts.forEach((artifact, index) => {
      writeShardMatrix(index, 1);
      shards.setColorAt(index, color.set(STRATUM_TINTS[artifact.stratum]));
    });
    shards.instanceMatrix.needsUpdate = true;
    if (shards.instanceColor) shards.instanceColor.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artifacts]);

  const smooth = useRef({ y: 0 });

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = digState;

    const targetY = -state.progress * (TRENCH_HEIGHT - 4.5);
    easing.damp(smooth.current, "y", targetY, 0.3, dt);
    camera.position.set(0, smooth.current.y, 13.5);
    camera.lookAt(0, smooth.current.y - 1.2, 0);

    // Probe đổi → bump scale mảnh + di chuyển vầng sáng
    if (state.probed !== lastProbed.current) {
      const shards = shardsRef.current;
      if (lastProbed.current >= 0) writeShardMatrix(lastProbed.current, 1);
      if (state.probed >= 0) writeShardMatrix(state.probed, 1.4);
      if (shards) shards.instanceMatrix.needsUpdate = true;
      const glow = glowRef.current;
      if (glow) {
        glow.visible = state.probed >= 0;
        if (state.probed >= 0) {
          glow.position.set(...artifacts[state.probed].position);
        }
      }
      lastProbed.current = state.probed;
    }

    if (Math.abs(smooth.current.y - targetY) > 0.002) {
      root.invalidate();
    }
  });

  const handleProbe = (event: ThreeEvent<PointerEvent>) => {
    const instanceId = event.instanceId;
    if (instanceId === undefined) return;
    if (digState.probed !== instanceId) {
      digState.probed = instanceId;
      digState.setFindCard?.(instanceId);
      digState.invalidate?.();
    }
  };

  const handleProbeOut = () => {
    if (digState.probed !== -1) {
      digState.probed = -1;
      digState.setFindCard?.(-1);
      digState.invalidate?.();
    }
  };

  return (
    <>
      {/* Nắng thấp rọi xiên vào hố + fill lạnh mờ */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[-9, 7, 9]} intensity={1.9} color="#ffd9ae" />
      <directionalLight position={[10, -4, 6]} intensity={0.35} color="#8fb2d8" />

      {/* Vách hố */}
      <mesh
        material={trenchMaterial}
        position={[0, TRENCH_TOP - TRENCH_HEIGHT / 2, 0]}
        frustumCulled={false}
      >
        <planeGeometry args={[30, TRENCH_HEIGHT, 2, 2]} />
      </mesh>

      {/* Lưới dây trắc địa */}
      <lineSegments geometry={gridGeometry} frustumCulled={false}>
        <lineBasicMaterial color="#e8e8e8" transparent opacity={0.16} />
      </lineSegments>

      {/* 48 mảnh module — 1 InstancedMesh, raycast instanceId */}
      <instancedMesh
        ref={shardsRef}
        args={[undefined, shardMaterial, artifacts.length]}
        frustumCulled={false}
        onPointerMove={handleProbe}
        onPointerOut={handleProbeOut}
        onClick={handleProbe}
      >
        <dodecahedronGeometry args={[1, 0]} />
      </instancedMesh>

      {/* Vầng scanline quanh mảnh đang probe */}
      <mesh ref={glowRef} visible={false}>
        <sphereGeometry args={[0.75, 12, 12]} />
        <meshBasicMaterial
          color="#d97b53"
          transparent
          opacity={0.22}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
