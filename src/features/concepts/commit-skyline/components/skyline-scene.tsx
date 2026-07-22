"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  LANDMARKS,
  buildSkyline,
  cameraAlong,
} from "@/features/concepts/commit-skyline/lib/skyline-data";
import {
  notifyBuildingHover,
  type SkylineState,
} from "@/features/concepts/commit-skyline/lib/skyline-state";

interface SkylineSceneProps {
  skylineState: SkylineState;
}

const DARK = new THREE.Color("#131c26");
const WARM = new THREE.Color("#ffb45c");
const LANDMARK_BLUE = "#60a5fa";

/**
 * Toàn bộ ngày (2012 → 2026) = MỘT InstancedMesh (matrix scale theo commit,
 * instanceColor ấm dần theo cường độ), 6 tháp landmark + 6 beacon mỗi
 * loại một draw call, fogExp2 nuốt thành phố vào sương xanh đen.
 * Camera bay thấp dọc đại lộ theo scroll — trang đứng yên là 0% GPU.
 */
export function SkylineScene({ skylineState }: SkylineSceneProps) {
  const camera = useThree((three) => three.camera);

  const { skyline, landmarkPoses } = useMemo(() => {
    const buildings = buildSkyline();
    return {
      skyline: buildings,
      landmarkPoses: LANDMARKS.map((landmark) => {
        const building = buildings[landmark.dayIndex];
        return { x: building.x, z: building.z };
      }),
    };
  }, []);

  const buildingsRef = useRef<THREE.InstancedMesh>(null);
  const towersRef = useRef<THREE.InstancedMesh>(null);
  const beaconsRef = useRef<THREE.InstancedMesh>(null);
  const smooth = useRef({ p: 0 });
  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpPos = useRef(new THREE.Vector3());
  const tmpScale = useRef(new THREE.Vector3());
  const tmpColor = useRef(new THREE.Color());

  // Toàn bộ thành phố đặt matrix + màu MỘT lần
  useLayoutEffect(() => {
    const buildings = buildingsRef.current;
    if (buildings) {
      skyline.forEach((building, index) => {
        tmpMatrix.current.compose(
          tmpPos.current.set(building.x, building.height / 2, building.z),
          tmpQuat.current,
          tmpScale.current.set(0.2, building.height, 0.24),
        );
        buildings.setMatrixAt(index, tmpMatrix.current);
        tmpColor.current
          .copy(DARK)
          .lerp(WARM, Math.pow(building.intensity, 1.5));
        buildings.setColorAt(index, tmpColor.current);
      });
      buildings.instanceMatrix.needsUpdate = true;
      if (buildings.instanceColor) buildings.instanceColor.needsUpdate = true;
    }

    const towers = towersRef.current;
    const beacons = beaconsRef.current;
    landmarkPoses.forEach((pose, index) => {
      if (towers) {
        tmpMatrix.current.compose(
          tmpPos.current.set(pose.x, 1.3, pose.z),
          tmpQuat.current,
          tmpScale.current.set(0.26, 2.6, 0.3),
        );
        towers.setMatrixAt(index, tmpMatrix.current);
      }
      if (beacons) {
        tmpMatrix.current.compose(
          tmpPos.current.set(pose.x, 2.75, pose.z),
          tmpQuat.current,
          tmpScale.current.set(0.09, 0.09, 0.09),
        );
        beacons.setMatrixAt(index, tmpMatrix.current);
      }
    });
    if (towers) towers.instanceMatrix.needsUpdate = true;
    if (beacons) beacons.instanceMatrix.needsUpdate = true;
  }, [skyline, landmarkPoses]);

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = skylineState;

    smooth.current.p +=
      (state.progress - smooth.current.p) * (1 - Math.exp(-dt * 5));
    const pose = cameraAlong(smooth.current.p);
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);

    if (Math.abs(state.progress - smooth.current.p) > 1e-4) {
      root.invalidate();
    }
  });

  const onBuildingPointer = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    notifyBuildingHover(skylineState, event.instanceId);
  };

  return (
    <>
      {/* Sương xanh đen nuốt thành phố xa */}
      <fogExp2 attach="fog" args={["#0a0f14", 0.048]} />

      <group>
        <hemisphereLight args={["#31404f", "#05070a", 0.9]} />
        <directionalLight position={[30, 20, 10]} intensity={0.35} />

        {/* Mọi ngày commit của 15 block năm: MỘT draw call */}
        <instancedMesh
          ref={buildingsRef}
          args={[undefined, undefined, skyline.length]}
          onPointerMove={onBuildingPointer}
          onPointerOut={() => notifyBuildingHover(skylineState, -1)}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial />
        </instancedMesh>

        {/* 6 tháp landmark + beacon */}
        <instancedMesh
          ref={towersRef}
          args={[undefined, undefined, LANDMARKS.length]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color={LANDMARK_BLUE} emissive="#16324f" />
        </instancedMesh>
        <instancedMesh
          ref={beaconsRef}
          args={[undefined, undefined, LANDMARKS.length]}
        >
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial
            color={LANDMARK_BLUE}
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </instancedMesh>

        {/* Mặt phố ướt tối — dài đủ 15 block năm */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[130, -0.01, 1.5]}>
          <planeGeometry args={[400, 40]} />
          <meshLambertMaterial color="#0b1016" />
        </mesh>
      </group>
    </>
  );
}
