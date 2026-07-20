"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import {
  FLOOR_COUNT,
  REFACTOR_YEARS,
  TOWER_HEIGHT,
  buildTruss,
  fillStrain,
} from "@/features/concepts/cost-of-change/lib/ledger-data";
import { TrussMaterial } from "@/features/concepts/cost-of-change/lib/truss-material";
import type { ChangeState } from "@/features/concepts/cost-of-change/lib/change-state";

interface TowerSceneProps {
  changeState: ChangeState;
}

const FLASH_SECONDS = 1.2;

/** Gắn bộ attribute instanced (tầng, năm xây, seed, cờ refactor). */
function attachTrussAttributes(
  geometry: THREE.BufferGeometry,
  floors: number[],
  builtYears: number[],
): void {
  const count = floors.length;
  const seeds = new Float32Array(count);
  const refactorTags = new Float32Array(count);
  const refactorSet = new Set(REFACTOR_YEARS);
  for (let i = 0; i < count; i += 1) {
    seeds[i] = (i * 0.618) % 1;
    refactorTags[i] = refactorSet.has(floors[i]) ? 1 : 0;
  }
  geometry.setAttribute(
    "aFloor",
    new THREE.InstancedBufferAttribute(Float32Array.from(floors), 1),
  );
  geometry.setAttribute(
    "aBuiltYear",
    new THREE.InstancedBufferAttribute(Float32Array.from(builtYears), 1),
  );
  geometry.setAttribute(
    "aSeed",
    new THREE.InstancedBufferAttribute(seeds, 1),
  );
  geometry.setAttribute(
    "aRefactorTag",
    new THREE.InstancedBufferAttribute(refactorTags, 1),
  );
}

/**
 * Tháp truss 10 tầng: 120 thanh + 44 khớp = đúng 2 InstancedMesh chia
 * một TrussMaterial (strain/shear/tremor tính trong vertex shader, màu
 * ramp trong fragment — 0 light, 0 shadow). Cuộn scrub uYear; refactor
 * mở cửa sổ flash cyan 1.2s; counterfactual blend sang đường nợ giả định.
 */
export function TowerScene({ changeState }: TowerSceneProps) {
  const camera = useThree((three) => three.camera);

  const { truss, material, beamGeometry, jointGeometry } = useMemo(() => {
    const built = buildTruss();

    const beams = new THREE.BoxGeometry(1, 1, 1);
    attachTrussAttributes(
      beams,
      built.beams.map((beam) => beam.floor),
      built.beams.map((beam) => beam.floor),
    );

    // Khớp mức L chốt trên đỉnh tầng L-1 → xây cùng tầng đó
    const joints = new THREE.IcosahedronGeometry(0.085, 0);
    attachTrussAttributes(
      joints,
      built.joints.map((joint) => Math.min(joint.level, FLOOR_COUNT - 1)),
      built.joints.map((joint) => Math.max(joint.level - 1, 0)),
    );

    return {
      truss: built,
      material: new TrussMaterial(),
      beamGeometry: beams,
      jointGeometry: joints,
    };
  }, []);

  useEffect(() => {
    return () => {
      beamGeometry.dispose();
      jointGeometry.dispose();
      material.dispose();
    };
  }, [beamGeometry, jointGeometry, material]);

  const beamsRef = useRef<THREE.InstancedMesh>(null);
  const jointsRef = useRef<THREE.InstancedMesh>(null);

  // Matrix đặt một lần — mọi chuyển động sau đó sống trong vertex shader
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();

    const beams = beamsRef.current;
    if (beams) {
      truss.beams.forEach((member, index) => {
        euler.set(...member.rotation);
        matrix.compose(
          position.set(...member.position),
          quaternion.setFromEuler(euler),
          scale.set(...member.scale),
        );
        beams.setMatrixAt(index, matrix);
      });
      beams.instanceMatrix.needsUpdate = true;
    }

    const joints = jointsRef.current;
    if (joints) {
      quaternion.identity();
      truss.joints.forEach((joint, index) => {
        matrix.compose(
          position.set(...joint.position),
          quaternion,
          scale.set(1, 1, 1),
        );
        joints.setMatrixAt(index, matrix);
      });
      joints.instanceMatrix.needsUpdate = true;
    }
  }, [truss]);

  const smooth = useRef({ year: 0, blend: 0 });
  const prevFloor = useRef(0);
  const flashUntil = useRef(-1);
  const lookTarget = useRef(new THREE.Vector3());

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = changeState;
    const now = root.clock.elapsedTime;

    easing.damp(smooth.current, "year", state.year, 0.3, dt);
    easing.damp(smooth.current, "blend", state.counterfactual, 0.25, dt);
    const year = smooth.current.year;
    const blend = smooth.current.blend;

    // Vượt mốc tầng mới: nếu tầng vừa hoàn thành là refactor → flash cyan
    const floorInt = Math.floor(year);
    if (
      floorInt > prevFloor.current &&
      REFACTOR_YEARS.includes(floorInt - 1)
    ) {
      flashUntil.current = now + FLASH_SECONDS;
    }
    prevFloor.current = floorInt;

    const flashWindow = Math.max(
      0,
      (flashUntil.current - now) / FLASH_SECONDS,
    );

    // Mutate uniform tại chỗ — không allocation
    fillStrain(material.uniforms.uStrain.value as Float32Array, year, false);
    fillStrain(
      material.uniforms.uStrainAlt.value as Float32Array,
      year,
      true,
    );
    material.setYear(year);
    material.setCounterfactual(blend);
    material.uniforms.uTime.value = now;
    material.uniforms.uFlash.value = flashWindow;
    material.uniforms.uTremor.value = Math.max(
      flashWindow * 0.6,
      blend * 0.85,
    );

    // Camera leo theo tầng đang xây, nhìn về giữa phần tháp đã dựng
    const climb = (year / 10) * TOWER_HEIGHT * 0.62;
    camera.position.set(6.6, 2.6 + climb, 9.8);
    camera.lookAt(
      lookTarget.current.set(0, Math.min(climb * 0.85, TOWER_HEIGHT * 0.6), 0),
    );

    // Giữ vòng render khi còn damping / flash / tremor (frameloop=demand)
    if (
      Math.abs(state.year - year) > 1e-3 ||
      Math.abs(state.counterfactual - blend) > 1e-3 ||
      flashWindow > 0 ||
      material.uniforms.uTremor.value > 0.01
    ) {
      root.invalidate();
    }
  });

  return (
    <group>
      {/* 120 thanh: 1 draw call */}
      <instancedMesh
        ref={beamsRef}
        args={[beamGeometry, material, truss.beams.length]}
      />
      {/* 44 khớp: 1 draw call, chung material + uniform */}
      <instancedMesh
        ref={jointsRef}
        args={[jointGeometry, material, truss.joints.length]}
      />
      {/* Sàn blueprint mờ */}
      <gridHelper
        args={[46, 46, "#1d2735", "#121a26"]}
        position={[0, -0.01, 0]}
      />
    </group>
  );
}
