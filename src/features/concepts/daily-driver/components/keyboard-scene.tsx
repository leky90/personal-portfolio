"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { easing } from "maath";
import { buildKeyboard } from "@/features/concepts/daily-driver/lib/keyboard-data";
import type { KeyboardState } from "@/features/concepts/daily-driver/lib/keyboard-state";

interface KeyboardSceneProps {
  keyboardState: KeyboardState;
}

/** Đơn vị u → world; board 15u ≈ 9.3 world */
const U = 0.62;
const KEY_H = 0.42;
const TRAVEL = 0.22;
const STIFFNESS = 320;
const DAMPING = 22;
const IMPULSE = 7.5;
/** Ngưỡng năng lượng: dưới mức này lò xo coi như đứng yên → 0 fps */
const ENERGY_EPS = 0.004;

const CREAM = "#ded8ca";
const MODIFIER = "#41454e";
const ACCENT = "#a3e635";

/**
 * Bàn phím 60% procedural: 61 keycap đúng 1 InstancedMesh + case 1 mesh
 * + underglow 1 plane. Vật lý phím là mảng typed imperative (không React
 * state): mỗi keydown bơm xung vào lò xo critically-damped, frameloop
 * demand chỉ chạy khi tổng năng lượng lò xo còn trên ngưỡng — gõ xong
 * ~400ms là GPU về đúng 0%.
 */
export function KeyboardScene({ keyboardState }: KeyboardSceneProps) {
  const camera = useThree((three) => three.camera);

  const { keys, offsets, velocities } = useMemo(() => {
    const built = buildKeyboard();
    return {
      keys: built,
      offsets: new Float32Array(built.length),
      velocities: new Float32Array(built.length),
    };
  }, []);

  const capsRef = useRef<THREE.InstancedMesh>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);

  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpPos = useRef(new THREE.Vector3());
  const tmpScale = useRef(new THREE.Vector3());

  const writeKeyMatrix = (index: number) => {
    const caps = capsRef.current;
    if (!caps) return;
    const key = keys[index];
    tmpPos.current.set(key.x * U, 0.3 - offsets[index], key.z * U);
    tmpScale.current.set(key.w * U * 0.92, KEY_H, U * 0.92);
    tmpMatrix.current.compose(tmpPos.current, tmpQuat.current, tmpScale.current);
    caps.setMatrixAt(index, tmpMatrix.current);
  };

  // Matrix + màu keycap đặt một lần
  useLayoutEffect(() => {
    const caps = capsRef.current;
    if (!caps) return;
    const color = new THREE.Color();
    keys.forEach((key, index) => {
      writeKeyMatrix(index);
      const tint = key.accent ? ACCENT : key.w === 1 ? CREAM : MODIFIER;
      caps.setColorAt(index, color.set(tint));
    });
    caps.instanceMatrix.needsUpdate = true;
    if (caps.instanceColor) caps.instanceColor.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys]);

  const smooth = useRef({ p: 0 });
  const heroPos = useRef(new THREE.Vector3(0, 4.8, 7.0));
  const topPos = useRef(new THREE.Vector3(0, 9.2, 1.2));
  const camPos = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = keyboardState;

    // Bơm xung cho các phím vừa nhấn
    while (state.pressQueue.length > 0) {
      const index = state.pressQueue.pop()!;
      if (index >= 0 && index < keys.length) {
        velocities[index] += IMPULSE;
      }
    }

    // Tích phân lò xo + đo tổng năng lượng
    let energy = 0;
    const caps = capsRef.current;
    for (let i = 0; i < keys.length; i += 1) {
      const off = offsets[i];
      const vel = velocities[i];
      if (off === 0 && vel === 0) continue;
      const acc = -STIFFNESS * off - DAMPING * vel;
      velocities[i] = vel + acc * dt;
      offsets[i] = Math.min(Math.max(off + velocities[i] * dt, 0), TRAVEL);
      if (Math.abs(offsets[i]) < 1e-4 && Math.abs(velocities[i]) < 1e-3) {
        offsets[i] = 0;
        velocities[i] = 0;
      } else {
        energy += Math.abs(offsets[i]) + Math.abs(velocities[i]) * 0.05;
        writeKeyMatrix(i);
      }
    }
    if (caps && energy > 0) caps.instanceMatrix.needsUpdate = true;

    // Underglow chỉ rò sáng khi đang gõ rồi tắt dần
    const glow = glowRef.current;
    if (glow) {
      const target = Math.min(energy * 2.2, 0.5);
      glow.opacity += (target - glow.opacity) * Math.min(dt * 8, 1);
      if (glow.opacity < 0.004) glow.opacity = 0;
    }

    // Camera 3/4 hero → top-down theo cuộn
    easing.damp(smooth.current, "p", state.progress, 0.3, dt);
    const p = smooth.current.p;
    camPos.current.lerpVectors(heroPos.current, topPos.current, p);
    camera.position.copy(camPos.current);
    lookAt.current.set(0, 0, -0.2 + p * 0.2);
    camera.lookAt(lookAt.current);

    if (
      energy > ENERGY_EPS ||
      (glow && glow.opacity > 0) ||
      Math.abs(state.progress - p) > 1e-4
    ) {
      root.invalidate();
    }
  });

  const onKeyPointer = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    keyboardState.pressQueue.push(event.instanceId);
    keyboardState.onKeyClick?.(event.instanceId);
    keyboardState.invalidate?.();
  };

  return (
    <group>
      <hemisphereLight args={["#dfe6ee", "#14161a", 1.0]} />
      <directionalLight position={[3, 6, 4]} intensity={1.1} />

      {/* 61 keycap: 1 draw call, raycast theo instanceId */}
      <instancedMesh
        ref={capsRef}
        args={[undefined, undefined, keys.length]}
        onClick={onKeyPointer}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.72} metalness={0.04} />
      </instancedMesh>

      {/* Case nhôm charcoal */}
      <mesh position={[0, -0.16, 0]}>
        <boxGeometry args={[15.8 * U, 0.52, 5.8 * U]} />
        <meshStandardMaterial color="#22252b" roughness={0.38} metalness={0.5} />
      </mesh>

      {/* Underglow rò từ đáy case khi gõ */}
      <mesh position={[0, -0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[17 * U, 7 * U]} />
        <meshBasicMaterial
          ref={glowRef}
          color={ACCENT}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
