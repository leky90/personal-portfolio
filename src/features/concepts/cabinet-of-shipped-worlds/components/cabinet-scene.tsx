"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  CELLS,
  CELL_HEIGHT,
  CELL_WIDTH,
  buildDiorama,
  cameraForCell,
  cellCenter,
} from "@/features/concepts/cabinet-of-shipped-worlds/lib/cabinet-data";
import {
  enterCell,
  notifyCell,
  type CabinetState,
} from "@/features/concepts/cabinet-of-shipped-worlds/lib/cabinet-state";

interface CabinetSceneProps {
  cabinetState: CabinetState;
}

const FROST_IDLE = 0.55;
const FROST_STORAGE = 0.72;
const FROST_CLEAR = 0.06;

/**
 * Tủ kính 4×2: khung 1 InstancedMesh mullion, mỗi ô live là một cụm
 * primitive nhỏ sau tấm frost; hover làm sương tan (opacity damp) và
 * đánh thức đúng MỘT chi tiết animated của ô đó; click dolly camera
 * xuyên lớp kính. Ô không hover giữ nguyên khung hình — demand đúng
 * nghĩa "frozen portal economy".
 */
export function CabinetScene({ cabinetState }: CabinetSceneProps) {
  const camera = useThree((three) => three.camera);

  const { dioramas, frostMaterials, mullions } = useMemo(() => {
    const builtDioramas = CELLS.map((cell) =>
      cell.world ? buildDiorama(cell.world) : null,
    );
    const frosts = CELLS.map(
      (cell) =>
        new THREE.MeshStandardMaterial({
          color: "#cfd8dc",
          transparent: true,
          opacity: cell.world ? FROST_IDLE : FROST_STORAGE,
          roughness: 0.9,
          metalness: 0,
        }),
    );

    // Khung tủ: thanh dọc 5 + ngang 3 = 8 mullion instanced
    const bars: { position: [number, number, number]; scale: [number, number, number] }[] = [];
    for (let i = 0; i <= 4; i += 1) {
      bars.push({
        position: [(i - 2) * CELL_WIDTH, 0.65, 0.02],
        scale: [0.07, CELL_HEIGHT * 2 + 0.1, 0.3],
      });
    }
    for (let j = 0; j <= 2; j += 1) {
      bars.push({
        position: [0, 0.65 + (1 - j) * CELL_HEIGHT, 0.02],
        scale: [CELL_WIDTH * 4 + 0.1, 0.07, 0.3],
      });
    }

    return { dioramas: builtDioramas, frostMaterials: frosts, mullions: bars };
  }, []);

  useEffect(() => {
    return () => {
      for (const material of frostMaterials) material.dispose();
    };
  }, [frostMaterials]);

  const mullionsRef = useRef<THREE.InstancedMesh>(null);
  const animatedRefs = useRef<(THREE.Mesh | null)[]>([]);
  const smooth = useRef({ px: 0, py: 0.7, pz: 6.4, tx: 0, ty: 0.6, tz: 0 });
  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpPos = useRef(new THREE.Vector3());
  const tmpScale = useRef(new THREE.Vector3());

  useEffect(() => {
    const mesh = mullionsRef.current;
    if (!mesh) return;
    mullions.forEach((bar, index) => {
      tmpMatrix.current.compose(
        tmpPos.current.set(...bar.position),
        tmpQuat.current,
        tmpScale.current.set(...bar.scale),
      );
      mesh.setMatrixAt(index, tmpMatrix.current);
    });
    mesh.instanceMatrix.needsUpdate = true;
     
  }, [mullions]);

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = cabinetState;
    const lambda = 1 - Math.exp(-dt * 6);
    let moving = 0;

    // Sương tan/đọng theo hover + entered
    CELLS.forEach((cell, index) => {
      const material = frostMaterials[index];
      const awake = state.hovered === index || state.entered === index;
      const target = cell.world
        ? awake
          ? FROST_CLEAR
          : FROST_IDLE
        : FROST_STORAGE;
      const diff = target - material.opacity;
      if (Math.abs(diff) > 1e-3) {
        material.opacity += diff * lambda;
        moving += Math.abs(diff);
      }
    });

    // Chi tiết animated của ô đang thức quay chậm
    const awakeCell = state.entered >= 0 ? state.entered : state.hovered;
    if (awakeCell >= 0) {
      const spinner = animatedRefs.current[awakeCell];
      if (spinner) {
        spinner.rotation.y += dt * 1.8;
        moving += 1;
      }
    }

    // Camera dolly xuyên kính
    const pose = cameraForCell(state.entered);
    const s = smooth.current;
    s.px += (pose.position[0] - s.px) * lambda;
    s.py += (pose.position[1] - s.py) * lambda;
    s.pz += (pose.position[2] - s.pz) * lambda;
    s.tx += (pose.target[0] - s.tx) * lambda;
    s.ty += (pose.target[1] - s.ty) * lambda;
    s.tz += (pose.target[2] - s.tz) * lambda;
    moving += Math.abs(pose.position[2] - s.pz);
    camera.position.set(s.px, s.py, s.pz);
    camera.lookAt(s.tx, s.ty, s.tz);

    if (moving > 1e-3) {
      root.invalidate();
    }
  });

  const onCellOver = (index: number) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    notifyCell(cabinetState, index);
    cabinetState.invalidate?.();
  };

  const onCellClick = (index: number) => (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (CELLS[index].world === null) return;
    enterCell(cabinetState, index);
  };

  return (
    <group>
      <hemisphereLight args={["#dfe7e2", "#0f1412", 0.8]} />
      <directionalLight position={[3, 5, 5]} intensity={0.9} color="#ffe7c4" />

      {/* Khung tủ walnut + thép: 1 InstancedMesh */}
      <instancedMesh
        ref={mullionsRef}
        args={[undefined, undefined, mullions.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3a2c22" roughness={0.55} metalness={0.2} />
      </instancedMesh>

      {/* Lưng tủ */}
      <mesh position={[0, 0.65, -0.5]}>
        <boxGeometry args={[CELL_WIDTH * 4 + 0.2, CELL_HEIGHT * 2 + 0.2, 0.08]} />
        <meshStandardMaterial color="#141a17" roughness={0.9} />
      </mesh>

      {/* 8 ô: diorama (nếu live) + tấm frost raycast */}
      {CELLS.map((cell, index) => {
        const [x, y] = cellCenter(cell.col, cell.row);
        return (
          <group key={cell.id} position={[x, y, 0]}>
            {dioramas[index]?.map((part, partIndex) => (
              <mesh
                key={`${cell.id}-${partIndex}`}
                ref={
                  part.animated
                    ? (mesh) => {
                        animatedRefs.current[index] = mesh;
                      }
                    : undefined
                }
                position={part.position}
                scale={part.scale}
              >
                {part.kind === "box" ? (
                  <boxGeometry args={[1, 1, 1]} />
                ) : (
                  <cylinderGeometry args={[0.5, 0.5, 1, 16]} />
                )}
                <meshLambertMaterial color={part.color} />
              </mesh>
            ))}
            <mesh
              position={[0, 0, 0.42]}
              material={frostMaterials[index]}
              onPointerOver={onCellOver(index)}
              onPointerOut={() => notifyCell(cabinetState, -1)}
              onClick={onCellClick(index)}
            >
              <planeGeometry args={[CELL_WIDTH - 0.12, CELL_HEIGHT - 0.12]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
