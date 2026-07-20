"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  LAYERS,
  SERVICE_LINKS,
  SERVICE_NODES,
  TRACES,
  TRACE_SECONDS,
  buildCity,
  buildCrystals,
  cameraPoseAt,
  requestPathPoints,
  traceStepAt,
} from "@/features/concepts/full-stack-strata/lib/island-data";
import type { IslandState } from "@/features/concepts/full-stack-strata/lib/island-state";

interface IslandSceneProps {
  islandState: IslandState;
}

const TEAL = "#3fd8c7";
const VIOLET = "#8b6cf5";

/**
 * Đảo pre-cut, không clippingPlanes: 3 slab trụ xếp chồng, thành phố 80
 * toà 1 InstancedMesh, 8 service node 1 InstancedMesh, links 1
 * LineSegments dashed, 24 tinh thể 1 InstancedMesh, packet 2 mesh —
 * ~10 draw call. Bấm nút là một request rơi xuyên ba tầng theo đường
 * cong bake sẵn, log trace bắn ra terminal DOM theo mốc thời gian.
 */
export function IslandScene({ islandState }: IslandSceneProps) {
  const camera = useThree((three) => three.camera);

  const { city, crystals, linkGeometry, curves } = useMemo(() => {
    const builtCity = buildCity(7);
    const builtCrystals = buildCrystals(7);

    const linkPositions = new Float32Array(SERVICE_LINKS.length * 6);
    SERVICE_LINKS.forEach(([a, b], index) => {
      linkPositions.set(
        [...SERVICE_NODES[a], ...SERVICE_NODES[b]],
        index * 6,
      );
    });
    const links = new THREE.BufferGeometry();
    links.setAttribute(
      "position",
      new THREE.BufferAttribute(linkPositions, 3),
    );

    return {
      city: builtCity,
      crystals: builtCrystals,
      linkGeometry: links,
      curves: TRACES.map(
        (_, index) =>
          new THREE.CatmullRomCurve3(
            requestPathPoints(index).map((p) => new THREE.Vector3(...p)),
            false,
            "catmullrom",
            0.35,
          ),
      ),
    };
  }, []);

  useEffect(() => {
    return () => {
      linkGeometry.dispose();
    };
  }, [linkGeometry]);

  const cityRef = useRef<THREE.InstancedMesh>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const crystalsRef = useRef<THREE.InstancedMesh>(null);
  const linksRef = useRef<THREE.LineSegments>(null);
  const packetRef = useRef<THREE.Group>(null);
  const lastStep = useRef(-1);
  const smooth = useRef({ p: 0 });
  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpPos = useRef(new THREE.Vector3());
  const tmpScale = useRef(new THREE.Vector3());
  const packetPos = useRef(new THREE.Vector3());

  // Matrix instanced đặt một lần
  useLayoutEffect(() => {
    const color = new THREE.Color();

    const cityMesh = cityRef.current;
    if (cityMesh) {
      city.forEach((building, index) => {
        tmpMatrix.current.compose(
          tmpPos.current.set(
            building.x,
            LAYERS[0].yTop + building.height / 2,
            building.z,
          ),
          tmpQuat.current,
          tmpScale.current.set(0.14, building.height, 0.14),
        );
        cityMesh.setMatrixAt(index, tmpMatrix.current);
        cityMesh.setColorAt(
          index,
          color.set("#2b2e35").lerp(new THREE.Color("#565b66"), building.seed),
        );
      });
      cityMesh.instanceMatrix.needsUpdate = true;
      if (cityMesh.instanceColor) cityMesh.instanceColor.needsUpdate = true;
    }

    const nodeMesh = nodesRef.current;
    if (nodeMesh) {
      SERVICE_NODES.forEach((node, index) => {
        tmpMatrix.current.compose(
          tmpPos.current.set(...node),
          tmpQuat.current,
          tmpScale.current.set(0.16, 0.22, 0.16),
        );
        nodeMesh.setMatrixAt(index, tmpMatrix.current);
      });
      nodeMesh.instanceMatrix.needsUpdate = true;
    }

    const crystalMesh = crystalsRef.current;
    if (crystalMesh) {
      crystals.forEach((crystal, index) => {
        tmpQuat.current.setFromEuler(
          new THREE.Euler(crystal.seed * 2, crystal.seed * 5, 0),
        );
        tmpMatrix.current.compose(
          tmpPos.current.set(crystal.x, crystal.y, crystal.z),
          tmpQuat.current,
          tmpScale.current.set(
            crystal.scale,
            crystal.scale * 1.9,
            crystal.scale,
          ),
        );
        crystalMesh.setMatrixAt(index, tmpMatrix.current);
        crystalMesh.setColorAt(
          index,
          color.set(VIOLET).lerp(new THREE.Color("#4fc9e8"), crystal.seed),
        );
      });
      crystalMesh.instanceMatrix.needsUpdate = true;
      if (crystalMesh.instanceColor) {
        crystalMesh.instanceColor.needsUpdate = true;
      }
      tmpQuat.current.identity();
    }

    linksRef.current?.computeLineDistances();
  }, [city, crystals]);

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = islandState;

    // Chuyến bay request: packet trượt curve, log bắn theo mốc
    const packet = packetRef.current;
    if (state.firing >= 0) {
      state.fireT = Math.min(state.fireT + dt / TRACE_SECONDS, 1);
      const trace = TRACES[state.firing];
      const step = traceStepAt(trace, state.fireT);
      if (step !== lastStep.current && step >= 0) {
        lastStep.current = step;
        state.setTraceLine?.(trace.steps[step].text);
      }
      if (packet) {
        curves[state.firing].getPointAt(state.fireT, packetPos.current);
        packet.position.copy(packetPos.current);
        packet.scale.setScalar(1);
      }
      if (state.fireT >= 1) {
        state.firing = -1;
        lastStep.current = -1;
      }
    } else if (packet && packet.scale.x > 0.001) {
      packet.scale.setScalar(0.0001);
    }

    // Camera tụt dọc lát cắt
    smooth.current.p +=
      (state.progress - smooth.current.p) * (1 - Math.exp(-dt * 5));
    const pose = cameraPoseAt(smooth.current.p);
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);

    if (
      state.firing >= 0 ||
      Math.abs(state.progress - smooth.current.p) > 1e-4
    ) {
      root.invalidate();
    }
  });

  return (
    <group>
      <hemisphereLight args={["#f3e6d5", "#10131a", 0.95]} />
      <directionalLight position={[5, 6, 3]} intensity={1.0} color="#ffdfb8" />

      {/* 3 slab tầng */}
      <mesh position={[0, (LAYERS[0].yTop + LAYERS[0].yBottom) / 2, 0]}>
        <cylinderGeometry
          args={[3.5, 3.4, LAYERS[0].yTop - LAYERS[0].yBottom, 40]}
        />
        <meshStandardMaterial color="#d9a566" roughness={0.85} metalness={0} />
      </mesh>
      <mesh position={[0, (LAYERS[1].yTop + LAYERS[1].yBottom) / 2, 0]}>
        <cylinderGeometry
          args={[3.55, 3.5, LAYERS[1].yTop - LAYERS[1].yBottom, 40]}
        />
        <meshBasicMaterial color="#0d2f2b" />
      </mesh>
      <mesh position={[0, (LAYERS[2].yTop + LAYERS[2].yBottom) / 2, 0]}>
        <cylinderGeometry
          args={[3.35, 2.1, LAYERS[2].yTop - LAYERS[2].yBottom, 40]}
        />
        <meshStandardMaterial color="#221a3f" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Thành phố 80 toà: 1 draw call */}
      <instancedMesh ref={cityRef} args={[undefined, undefined, city.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.6} metalness={0.15} />
      </instancedMesh>

      {/* 8 service node phát sáng: 1 draw call */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, SERVICE_NODES.length]}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={TEAL} toneMapped={false} />
      </instancedMesh>

      {/* Link dịch vụ nét đứt: 1 draw call */}
      <lineSegments ref={linksRef} geometry={linkGeometry}>
        <lineDashedMaterial
          color={TEAL}
          dashSize={0.14}
          gapSize={0.1}
          transparent
          opacity={0.55}
        />
      </lineSegments>

      {/* 24 tinh thể dữ liệu: 1 draw call */}
      <instancedMesh
        ref={crystalsRef}
        args={[undefined, undefined, crystals.length]}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          roughness={0.3}
          metalness={0.2}
          emissive="#3a2a7a"
          emissiveIntensity={0.55}
        />
      </instancedMesh>

      {/* Packet request: lõi + vỏ glow additive */}
      <group ref={packetRef} scale={0.0001}>
        <mesh>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshBasicMaterial color={TEAL} toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshBasicMaterial
            color={TEAL}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Void grid mờ dưới đảo */}
      <gridHelper
        args={[40, 40, "#191d26", "#10131a"]}
        position={[0, -3.2, 0]}
      />
    </group>
  );
}
