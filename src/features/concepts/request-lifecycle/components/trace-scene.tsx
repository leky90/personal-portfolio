"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import {
  STATION_US,
  buildNodes,
  buildRoute,
} from "@/features/concepts/request-lifecycle/lib/trace-data";
import { RouteMaterial } from "@/features/concepts/request-lifecycle/lib/route-material";
import {
  notifySpan,
  type TraceState,
} from "@/features/concepts/request-lifecycle/lib/trace-state";

interface TraceSceneProps {
  traceState: TraceState;
}

const PULSE_GREEN = "#4ade80";

/**
 * Diorama-plus-terminal: route là 1 tube 1 draw call (xung trong shader),
 * hạ tầng flat-grey gom về 2 InstancedMesh (29 hộp + 3 trụ) + 1 hex prism,
 * packet icosahedron + vỏ glow additive. Camera dolly theo offset của
 * chính route; mọi chuyển động damp từ state.progress, 0% GPU khi đứng yên.
 */
export function TraceScene({ traceState }: TraceSceneProps) {
  const camera = useThree((three) => three.camera);

  const {
    route,
    tubeGeometry,
    routeMaterial,
    nodes,
    stations,
    greyMaterial,
  } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      buildRoute().map((p) => new THREE.Vector3(...p)),
      false,
      "catmullrom",
      0.5,
    );
    return {
      route: curve,
      tubeGeometry: new THREE.TubeGeometry(curve, 240, 0.05, 10, false),
      routeMaterial: new RouteMaterial(),
      nodes: buildNodes(),
      stations: STATION_US.map((u) => curve.getPointAt(u)),
      greyMaterial: new THREE.MeshLambertMaterial(),
    };
  }, []);

  useEffect(() => {
    return () => {
      tubeGeometry.dispose();
      routeMaterial.dispose();
      greyMaterial.dispose();
    };
  }, [tubeGeometry, routeMaterial, greyMaterial]);

  const boxesRef = useRef<THREE.InstancedMesh>(null);
  const cylindersRef = useRef<THREE.InstancedMesh>(null);
  const packetRef = useRef<THREE.Group>(null);

  // Matrix + xám matcap đặt một lần
  useLayoutEffect(() => {
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const color = new THREE.Color();

    const writeFamily = (
      mesh: THREE.InstancedMesh | null,
      family: ReturnType<typeof buildNodes>["boxes"],
    ) => {
      if (!mesh) return;
      family.forEach((node, index) => {
        const station = stations[node.spanIndex];
        matrix.compose(
          new THREE.Vector3(
            station.x + node.offset[0],
            station.y + node.offset[1],
            station.z + node.offset[2],
          ),
          quaternion,
          new THREE.Vector3(...node.scale),
        );
        mesh.setMatrixAt(index, matrix);
        mesh.setColorAt(index, color.setScalar(node.grey));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };

    writeFamily(boxesRef.current, nodes.boxes);
    writeFamily(cylindersRef.current, nodes.cylinders);
  }, [nodes, stations]);

  const smooth = useRef({ p: 0 });
  const packetPos = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());
  const camPos = useRef(new THREE.Vector3());

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = traceState;

    easing.damp(smooth.current, "p", state.progress, 0.28, dt);
    const p = smooth.current.p;

    routeMaterial.setProgress(p);

    // Packet trượt trên route + thở nhẹ lúc idle
    route.getPointAt(THREE.MathUtils.clamp(p, 0, 1), packetPos.current);
    const packet = packetRef.current;
    if (packet) {
      packet.position.copy(packetPos.current);
      const breath = 1 + Math.sin(root.clock.elapsedTime * 2.2) * 0.1;
      packet.scale.setScalar(breath);
    }

    // Camera dolly phía sau + chếch phải, nhìn về phía trước packet
    const camU = THREE.MathUtils.clamp(p - 0.055, 0, 1);
    route.getPointAt(camU, camPos.current);
    camera.position.set(
      camPos.current.x + 1.9,
      camPos.current.y + 1.75,
      camPos.current.z + 2.6,
    );
    route.getPointAt(THREE.MathUtils.clamp(p + 0.04, 0, 1), lookTarget.current);
    camera.lookAt(lookTarget.current);

    notifySpan(state, p);

    // Tự invalidate khi còn đang đuổi target (frameloop=demand)
    if (Math.abs(state.progress - p) > 1e-4) {
      root.invalidate();
    }
  });

  return (
    <group>
      <hemisphereLight args={["#cfd8e3", "#12161c", 0.95]} />
      <directionalLight position={[4, 7, 3]} intensity={0.7} />

      {/* Route + xung packet: 1 draw call */}
      <mesh geometry={tubeGeometry} material={routeMaterial} />

      {/* 29 hộp hạ tầng (edge ring + mesh grid + queue rail): 1 draw call */}
      <instancedMesh
        ref={boxesRef}
        args={[undefined, undefined, nodes.boxes.length]}
        material={greyMaterial}
      >
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>

      {/* 3 trụ database chồng nhau: 1 draw call */}
      <instancedMesh
        ref={cylindersRef}
        args={[undefined, undefined, nodes.cylinders.length]}
        material={greyMaterial}
      >
        <cylinderGeometry args={[0.5, 0.5, 1, 20]} />
      </instancedMesh>

      {/* Load balancer: hex prism đơn tại station 1 */}
      <mesh
        position={[stations[1].x, stations[1].y - 0.1, stations[1].z]}
        material={greyMaterial}
      >
        <cylinderGeometry args={[0.5, 0.5, 0.9, 6]} />
      </mesh>

      {/* Packet: lõi icosahedron + vỏ glow additive */}
      <group ref={packetRef}>
        <mesh>
          <icosahedronGeometry args={[0.085, 1]} />
          <meshBasicMaterial color={PULSE_GREEN} />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.17, 1]} />
          <meshBasicMaterial
            color={PULSE_GREEN}
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Sàn lưới mờ của void */}
      <gridHelper
        args={[90, 60, "#1c2530", "#131a23"]}
        position={[0, -1.4, -8]}
      />
    </group>
  );
}
