"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import {
  EVENTS,
  severityAt,
} from "@/features/concepts/incident-black-box/lib/incident-data";
import { TapeMaterial } from "@/features/concepts/incident-black-box/lib/tape-material";
import type { BlackBoxState } from "@/features/concepts/incident-black-box/lib/black-box-state";

interface TapeSceneProps {
  blackBoxState: BlackBoxState;
}

const TAPE_LENGTH = 44;

const KIND_COLORS: Record<string, string> = {
  signal: "#8b95a3",
  alert: "#ff5a1f",
  decision: "#f5f7fa",
  deploy: "#6ce0ff",
  resolve: "#3fb950",
};

/**
 * Băng chạy qua vạch đọc cố định giữa màn: scroll kéo băng, mỗi event chạm
 * playhead dock một dòng log (báo DOM qua callback + cú giật băng nhỏ).
 * 15% cuối camera nhấc lên nhìn toàn cục — góc nhìn postmortem.
 */
export function TapeScene({ blackBoxState }: TapeSceneProps) {
  const camera = useThree((three) => three.camera);

  const { tapeMaterial } = useMemo(
    () => ({ tapeMaterial: new TapeMaterial() }),
    [],
  );

  useEffect(() => {
    return () => {
      (tapeMaterial.uniforms.uMetrics.value as THREE.Texture).dispose();
      tapeMaterial.dispose();
    };
  }, [tapeMaterial]);

  const tapeGroup = useRef<THREE.Group>(null);
  const pinsRef = useRef<THREE.InstancedMesh>(null);
  const reelARef = useRef<THREE.Mesh>(null);
  const reelBRef = useRef<THREE.Mesh>(null);

  // Pin sự kiện đứng trên mép băng — matrix + màu đặt một lần
  useLayoutEffect(() => {
    const pins = pinsRef.current;
    if (!pins) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    EVENTS.forEach((event, index) => {
      matrix.makeTranslation((event.t - 0.5) * TAPE_LENGTH, 1.95, 0.02);
      pins.setMatrixAt(index, matrix);
      pins.setColorAt(index, color.set(KIND_COLORS[event.kind]));
    });
    pins.instanceMatrix.needsUpdate = true;
    if (pins.instanceColor) pins.instanceColor.needsUpdate = true;
  }, []);

  const smooth = useRef({ t: 0, jolt: 0 });
  const lastT = useRef(0);
  const lastDocked = useRef(-1);
  const baseCam = useRef(new THREE.Vector3(0, 1.6, 8.5));
  const topCam = useRef(new THREE.Vector3(0, 10, 2.5));
  const tmpCam = useRef(new THREE.Vector3());
  const baseLook = useRef(new THREE.Vector3(0, 0.4, 0));
  const topLook = useRef(new THREE.Vector3(0, 0, -0.5));
  const tmpLook = useRef(new THREE.Vector3());

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = blackBoxState;

    easing.damp(smooth.current, "t", state.progress, 0.28, dt);
    const t = smooth.current.t;

    // Băng trượt qua playhead cố định tại worldX = 0
    const group = tapeGroup.current;
    if (group) {
      group.position.x = TAPE_LENGTH / 2 - t * TAPE_LENGTH;
      easing.damp(smooth.current, "jolt", 0, 0.12, dt);
      group.position.y = smooth.current.jolt;
    }

    // Reels quay theo lượng băng vừa kéo
    const spun = (t - lastT.current) * 40;
    lastT.current = t;
    if (reelARef.current) reelARef.current.rotation.z -= spun;
    if (reelBRef.current) reelBRef.current.rotation.z -= spun;

    easing.damp(tapeMaterial.uniforms.uSeverity, "value", severityAt(t), 0.25, dt);

    // Event vừa qua vạch đọc → dock log + giật băng nhẹ
    let docked = -1;
    for (let i = 0; i < EVENTS.length; i += 1) {
      if (EVENTS[i].t <= t + 0.004) docked = i;
    }
    if (docked !== lastDocked.current) {
      lastDocked.current = docked;
      state.docked = docked;
      state.setDocked?.(docked);
      smooth.current.jolt = 0.07;
    }

    // 15% cuối: nhấc camera lên góc nhìn postmortem
    const lift = THREE.MathUtils.smoothstep(t, 0.85, 1);
    tmpCam.current.lerpVectors(baseCam.current, topCam.current, lift);
    camera.position.copy(tmpCam.current);
    tmpLook.current.lerpVectors(baseLook.current, topLook.current, lift);
    camera.lookAt(tmpLook.current);

    if (Math.abs(t - state.progress) > 0.0005 || smooth.current.jolt > 0.001) {
      root.invalidate();
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 6]} intensity={1.7} color="#fff2e6" />

      {/* Băng + pin sự kiện trượt cùng nhau */}
      <group ref={tapeGroup}>
        <mesh material={tapeMaterial} frustumCulled={false} position={[0, 0.4, 0]}>
          <planeGeometry args={[TAPE_LENGTH, 3.2, 220, 1]} />
        </mesh>
        <instancedMesh
          ref={pinsRef}
          args={[undefined, undefined, EVENTS.length]}
          frustumCulled={false}
        >
          <octahedronGeometry args={[0.14, 0]} />
          <meshBasicMaterial />
        </instancedMesh>
      </group>

      {/* Hộp đen international orange + hai cuộn băng */}
      <group position={[-6.6, 0.4, 1.2]} rotation={[0, 0.5, 0]}>
        <mesh>
          <boxGeometry args={[2.1, 1.5, 0.8]} />
          <meshStandardMaterial color="#ff5a1f" roughness={0.65} metalness={0.2} />
        </mesh>
        <mesh ref={reelARef} position={[-0.5, 0.28, 0.45]}>
          <cylinderGeometry args={[0.34, 0.34, 0.1, 24]} />
          <meshStandardMaterial color="#22252a" roughness={0.4} metalness={0.5} />
        </mesh>
        <mesh ref={reelBRef} position={[0.5, 0.28, 0.45]}>
          <cylinderGeometry args={[0.34, 0.34, 0.1, 24]} />
          <meshStandardMaterial color="#22252a" roughness={0.4} metalness={0.5} />
        </mesh>
      </group>

      {/* Cổng playhead cyan cố định giữa màn */}
      <mesh position={[0, 0.4, 0.3]}>
        <boxGeometry args={[0.05, 4.1, 0.05]} />
        <meshBasicMaterial color="#6ce0ff" />
      </mesh>
    </>
  );
}
