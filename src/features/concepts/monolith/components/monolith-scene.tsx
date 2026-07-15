"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import {
  HI_LETTERS,
  MONOLITH_LETTERS,
  letterShape,
  type MonolithLetter,
} from "@/features/concepts/monolith/lib/letterforms";
import {
  DIGIT_ADVANCE,
  layoutSegmentString,
} from "@/features/concepts/monolith/lib/segment-digits";
import {
  createMonolithRig,
  sampleMonolithRig,
} from "@/features/concepts/monolith/lib/monolith-rig";
import type { MonolithState } from "@/features/concepts/monolith/lib/monolith-state";

interface MonolithSceneProps {
  monolithState: MonolithState;
}

interface DigitLabel {
  text: string;
  position: [number, number, number];
  scale: number;
}

/** Năm nghề + số thứ tự project — mỗi nhãn đặt cạnh đường bay camera. */
const DIGIT_LABELS: DigitLabel[] = [
  { text: "2016", position: [3.6, 0.3, 3.5], scale: 1 },
  { text: "2019", position: [-6.4, 0.3, 12.5], scale: 1 },
  { text: "2022", position: [3.8, 0.3, 21.5], scale: 1 },
  { text: "2026", position: [-6.2, 0.3, 30.5], scale: 1 },
  { text: "01", position: [-4.9, 5.6, 10.5], scale: 0.72 },
  { text: "02", position: [4.6, 5.6, 19.5], scale: 0.72 },
  { text: "03", position: [-4.6, 5.6, 28.5], scale: 0.72 },
];

const EXTRUDE_OPTIONS: THREE.ExtrudeGeometryOptions = {
  depth: 0.34,
  bevelEnabled: true,
  bevelThickness: 0.02,
  bevelSize: 0.015,
  bevelSegments: 2,
  steps: 1,
};

function LetterMesh({
  letter,
  material,
}: {
  letter: MonolithLetter;
  material: THREE.Material;
}) {
  const geometry = useMemo(
    () => new THREE.ExtrudeGeometry(letterShape(letter.char), EXTRUDE_OPTIONS),
    [letter.char],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh
      geometry={geometry}
      material={material}
      position={letter.position}
      rotation={[0, letter.rotationY, 0]}
      scale={letter.scale}
    />
  );
}

/**
 * Cả site là một scene: 6 khối chữ extrude + 1 InstancedMesh cho toàn bộ
 * chữ số 7-segment (~12 draw call). Vật liệu tiết chế tuyệt đối — chỉ thấy
 * hình khối nơi rim light warm-white + một cạnh key đỏ chạm vào bevel.
 */
export function MonolithScene({ monolithState }: MonolithSceneProps) {
  const camera = useThree((three) => three.camera);

  const letterMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#34343a",
        roughness: 0.72,
        metalness: 0.25,
      }),
    [],
  );
  const digitMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#55555c",
        roughness: 0.55,
        metalness: 0.3,
      }),
    [],
  );
  useEffect(() => {
    return () => {
      letterMaterial.dispose();
      digitMaterial.dispose();
    };
  }, [letterMaterial, digitMaterial]);

  // Toàn bộ thanh 7-segment của mọi nhãn số → matrix list cho InstancedMesh
  const digitMatrices = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    for (const label of DIGIT_LABELS) {
      const centerOffset =
        (label.text.length * DIGIT_ADVANCE * label.scale) / 2;
      for (const segment of layoutSegmentString(label.text)) {
        // Mirror trục x: camera tiến từ phía -z nên chữ số phải lật ngang
        // mới đọc xuôi (cube đối xứng — chỉ cần mirror vị trí, khỏi xoay).
        position.set(
          label.position[0] + centerOffset - segment.position[0] * label.scale,
          label.position[1] + segment.position[1] * label.scale,
          label.position[2] - segment.position[2] * label.scale,
        );
        scale.set(
          segment.scale[0] * label.scale,
          segment.scale[1] * label.scale,
          segment.scale[2] * label.scale,
        );
        matrices.push(
          new THREE.Matrix4().compose(position, quaternion, scale),
        );
      }
    }
    return matrices;
  }, []);

  const instancedRef = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const instanced = instancedRef.current;
    if (!instanced) return;
    digitMatrices.forEach((matrix, index) => {
      instanced.setMatrixAt(index, matrix);
    });
    instanced.instanceMatrix.needsUpdate = true;
  }, [digitMatrices]);

  const rig = useMemo(() => createMonolithRig(), []);
  // Khởi tạo từ progress hiện tại (đã set trước khi canvas lazy-mount) —
  // deep-link #section mở đúng khung hình, không bay lại từ đầu.
  const smoothProgress = useRef({ t: monolithState.progress });
  const cameraPos = useRef(new THREE.Vector3());
  const cameraTarget = useRef(new THREE.Vector3());

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = monolithState;

    easing.damp(smoothProgress.current, "t", state.progress, 0.3, dt);
    sampleMonolithRig(
      rig,
      smoothProgress.current.t,
      cameraPos.current,
      cameraTarget.current,
    );
    camera.position.copy(cameraPos.current);
    // Parallax ±2 độ từ pointer — dịch nhẹ điểm nhìn, không dịch camera
    cameraTarget.current.x += state.pointer.x * 0.9;
    cameraTarget.current.y += state.pointer.y * 0.55;
    camera.lookAt(cameraTarget.current);

    if (Math.abs(smoothProgress.current.t - state.progress) > 0.0004) {
      root.invalidate();
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={["#050505", 0.03]} />
      <ambientLight intensity={0.14} />
      {/* Key rim warm-white + một cạnh đỏ từ cuối hành trình */}
      <directionalLight position={[7, 9, -8]} intensity={3.2} color="#ffe9d2" />
      <directionalLight position={[-6, 1.5, 46]} intensity={2.2} color="#ff2020" />

      {MONOLITH_LETTERS.map((letter) => (
        <LetterMesh
          key={`${letter.char}-${letter.position[2]}`}
          letter={letter}
          material={letterMaterial}
        />
      ))}
      {HI_LETTERS.map((letter) => (
        <LetterMesh
          key={`hi-${letter.char}`}
          letter={letter}
          material={letterMaterial}
        />
      ))}

      <instancedMesh
        ref={instancedRef}
        args={[undefined, undefined, digitMatrices.length]}
        material={digitMaterial}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>
    </>
  );
}
