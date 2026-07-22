"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { easing } from "maath";
import { buildTopologyGraph } from "@/features/concepts/living-topology/lib/topology-graph";
import {
  advancePacket,
  buildPacketRoutes,
} from "@/features/concepts/living-topology/lib/packet-routes";
import { EdgeMaterial } from "@/features/concepts/living-topology/lib/edge-material";
import {
  yearForProgress,
  type TopologyState,
} from "@/features/concepts/living-topology/lib/topology-state";

interface TopologySceneProps {
  topologyState: TopologyState;
}

const COLOR_STEEL = new THREE.Color("#6f84a3");
const COLOR_DIM = new THREE.Color("#263447");
const COLOR_ACCENT = new THREE.Color("#4af2a1");

/**
 * Toàn graph = 3 draw call: nodes (InstancedMesh octahedron), edges
 * (LineSegments + shader reveal/highlight), packets (InstancedMesh cầu nhỏ).
 * Layout bake một lần lúc mount; useFrame chỉ damp uniform, cập nhật matrix
 * packet và (khi đổi bucket năm) matrix/màu node — zero allocation.
 */
export function TopologyScene({ topologyState }: TopologySceneProps) {
  const camera = useThree((three) => three.camera);
  const clock = useThree((three) => three.clock);

  const density = topologyState.isMobile ? 0.6 : 1;
  const packetCount = topologyState.isMobile ? 8 : 14;

  const { graph, routes, edgeGeometry, edgeMaterial } = useMemo(() => {
    const builtGraph = buildTopologyGraph(7, density);
    const builtRoutes = buildPacketRoutes(builtGraph, packetCount, 23);

    const vertexCount = builtGraph.edges.length;
    const edgePositions = new Float32Array(vertexCount * 3);
    const edgeYears = new Float32Array(vertexCount);
    const edgeSystems = new Float32Array(vertexCount * 2);
    for (let v = 0; v < vertexCount; v += 1) {
      const node = builtGraph.edges[v];
      edgePositions[v * 3] = builtGraph.positions[node * 3];
      edgePositions[v * 3 + 1] = builtGraph.positions[node * 3 + 1];
      edgePositions[v * 3 + 2] = builtGraph.positions[node * 3 + 2];
    }
    for (let e = 0; e < vertexCount; e += 2) {
      const a = builtGraph.edges[e];
      const b = builtGraph.edges[e + 1];
      const bornYear = Math.max(
        builtGraph.nodeYear[a],
        builtGraph.nodeYear[b],
      );
      const sysA = builtGraph.nodeSystem[a];
      const sysB = builtGraph.nodeSystem[b];
      for (const v of [e, e + 1]) {
        edgeYears[v] = bornYear;
        edgeSystems[v * 2] = sysA;
        edgeSystems[v * 2 + 1] = sysB;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    geometry.setAttribute("aYear", new THREE.BufferAttribute(edgeYears, 1));
    geometry.setAttribute("aSystems", new THREE.BufferAttribute(edgeSystems, 2));

    return {
      graph: builtGraph,
      routes: builtRoutes,
      edgeGeometry: geometry,
      edgeMaterial: new EdgeMaterial(),
    };
  }, [density, packetCount]);

  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const packetsRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    return () => {
      edgeGeometry.dispose();
      edgeMaterial.dispose();
    };
  }, [edgeGeometry, edgeMaterial]);

  // Preallocate cho useFrame — không new trong vòng lặp
  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpVec = useRef(new THREE.Vector3());
  const tmpColor = useRef(new THREE.Color());
  const smoothYear = useRef({ y: 2013.5 });
  const lastAppearance = useRef("");

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = topologyState;
    const elapsed = clock.getElapsedTime();

    // Camera trôi rất chậm — mission control sống nhưng tĩnh lặng
    camera.position.set(Math.sin(elapsed * 0.05) * 2.6, 5, 30);
    camera.lookAt(0, 0.5, 0);

    easing.damp(smoothYear.current, "y", yearForProgress(state.progress), 0.35, dt);
    const year = smoothYear.current.y;
    edgeMaterial.uniforms.uYear.value = year;

    const active = state.hoverSystem >= 0 ? state.hoverSystem : state.focusSystem;
    edgeMaterial.uniforms.uFocus.value = active;

    // Node matrix/màu chỉ dựng lại khi bucket năm hoặc hệ thống active đổi
    const nodes = nodesRef.current;
    const appearanceKey = `${Math.round(year * 4)}|${active}`;
    if (nodes && appearanceKey !== lastAppearance.current) {
      lastAppearance.current = appearanceKey;
      for (let i = 0; i < graph.nodeCount; i += 1) {
        const born = graph.nodeYear[i] <= year;
        const scale = born ? 1 : 0;
        tmpMatrix.current.makeScale(scale, scale, scale);
        tmpMatrix.current.setPosition(
          graph.positions[i * 3],
          graph.positions[i * 3 + 1],
          graph.positions[i * 3 + 2],
        );
        nodes.setMatrixAt(i, tmpMatrix.current);

        const sys = graph.nodeSystem[i];
        if (active >= 0 && sys === active) {
          tmpColor.current.copy(COLOR_ACCENT);
        } else if (active >= 0) {
          tmpColor.current.copy(COLOR_DIM);
        } else {
          tmpColor.current.copy(COLOR_STEEL);
        }
        nodes.setColorAt(i, tmpColor.current);
      }
      nodes.instanceMatrix.needsUpdate = true;
      if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
    }

    // Packets chảy liên tục trên các route đã "ra đời"
    const packets = packetsRef.current;
    if (packets) {
      for (let p = 0; p < routes.length; p += 1) {
        const route = routes[p];
        if (route.year <= year) {
          const t = (elapsed * 0.055 + p / routes.length) % 1;
          advancePacket(route, t, tmpVec.current);
          tmpMatrix.current.makeScale(1, 1, 1);
          tmpMatrix.current.setPosition(tmpVec.current);
        } else {
          tmpMatrix.current.makeScale(0, 0, 0);
        }
        packets.setMatrixAt(p, tmpMatrix.current);
      }
      packets.instanceMatrix.needsUpdate = true;
    }

    // Đang damp năm → xin thêm frame cho timeline mọc mượt
    if (Math.abs(year - yearForProgress(state.progress)) > 0.005) {
      root.invalidate();
    }
  });

  const handleNodeMove = (event: ThreeEvent<PointerEvent>) => {
    const instanceId = event.instanceId;
    if (instanceId === undefined) return;
    if (graph.nodeYear[instanceId] > smoothYear.current.y) return;
    const sys = graph.nodeSystem[instanceId];
    if (sys !== topologyState.hoverSystem) {
      topologyState.hoverSystem = sys;
      topologyState.setTelemetry?.(sys);
      topologyState.invalidate?.();
    }
  };

  const handleNodeOut = () => {
    if (topologyState.hoverSystem !== -1) {
      topologyState.hoverSystem = -1;
      topologyState.setTelemetry?.(-1);
      topologyState.invalidate?.();
    }
  };

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 10, 8]} intensity={1.6} color="#dfe8ff" />

      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, graph.nodeCount]}
        onPointerMove={handleNodeMove}
        onPointerOut={handleNodeOut}
      >
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial roughness={0.45} metalness={0.35} />
      </instancedMesh>

      <lineSegments
        geometry={edgeGeometry}
        material={edgeMaterial}
        frustumCulled={false}
      />

      <instancedMesh
        ref={packetsRef}
        args={[undefined, undefined, routes.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshBasicMaterial color="#4af2a1" />
      </instancedMesh>
    </>
  );
}
