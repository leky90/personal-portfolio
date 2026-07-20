"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  EDGES,
  NODES,
  bfsFrom,
  layoutConstellation,
} from "@/features/concepts/dependency-constellation/lib/constellation-data";
import {
  queryNode,
  type ConstellationState,
} from "@/features/concepts/dependency-constellation/lib/constellation-state";

interface ConstellationSceneProps {
  constellationState: ConstellationState;
}

const KIND_COLORS = {
  role: new THREE.Color("#f5f0e6"),
  project: new THREE.Color("#ffb454"),
  skill: new THREE.Color("#38bdf8"),
} as const;
const KIND_SCALES = { role: 1.7, project: 1.25, skill: 1.0 } as const;
const EDGE_BASE = new THREE.Color("#232a35");
const EDGE_LIT = new THREE.Color("#7cd6ff");
const DIM = 0.22;
const RAMP_SECONDS = 1.1;

/**
 * Đồ thị KHÔNG mọc và không mô phỏng gì: nó đã resolve xong từ frame
 * đầu và chỉ trả lời query. Hover một node = chạy `pnpm why`: BFS bake
 * thắp cạnh theo từng tầng sâu trong ~1.1s rồi ngủ lại. 27 sao 1
 * InstancedMesh, 40 cạnh 1 LineSegments, bụi 1 Points — 4 draw call.
 */
export function ConstellationScene({
  constellationState,
}: ConstellationSceneProps) {
  const camera = useThree((three) => three.camera);

  const { positions, edgeGeometry, edgeColors, dustGeometry } =
    useMemo(() => {
      const nodeLayout = layoutConstellation();

      const edgePositions = new Float32Array(EDGES.length * 6);
      const colors = new Float32Array(EDGES.length * 6);
      EDGES.forEach(([a, b], index) => {
        const pa = nodeLayout.get(a)!;
        const pb = nodeLayout.get(b)!;
        edgePositions.set([...pa, ...pb], index * 6);
      });
      const edges = new THREE.BufferGeometry();
      edges.setAttribute(
        "position",
        new THREE.BufferAttribute(edgePositions, 3),
      );
      edges.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const dustPositions = new Float32Array(150 * 3);
      for (let i = 0; i < 150; i += 1) {
        const radius = 7 + ((i * 2654435761) % 1000) / 1000 * 6;
        const theta = i * 2.39996;
        const phi = (((i * 40503) % 997) / 997 - 0.5) * Math.PI * 0.8;
        dustPositions[i * 3] = Math.cos(theta) * Math.cos(phi) * radius;
        dustPositions[i * 3 + 1] = Math.sin(phi) * radius * 0.55;
        dustPositions[i * 3 + 2] = Math.sin(theta) * Math.cos(phi) * radius;
      }
      const dust = new THREE.BufferGeometry();
      dust.setAttribute(
        "position",
        new THREE.BufferAttribute(dustPositions, 3),
      );

      return {
        positions: NODES.map((node) => nodeLayout.get(node.id)!),
        edgeGeometry: edges,
        edgeColors: colors,
        dustGeometry: dust,
      };
    }, []);

  useEffect(() => {
    return () => {
      edgeGeometry.dispose();
      dustGeometry.dispose();
    };
  }, [edgeGeometry, dustGeometry]);

  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const lastQueried = useRef<string | null>("__init__");
  const ramp = useRef(1);
  const depthsRef = useRef<Map<string, number> | null>(null);
  const smooth = useRef({ p: 0 });
  const tmpColor = useRef(new THREE.Color());

  // Matrix + màu gốc theo kind đặt một lần
  useLayoutEffect(() => {
    const nodes = nodesRef.current;
    if (!nodes) return;
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const vec = new THREE.Vector3();
    const scale = new THREE.Vector3();
    NODES.forEach((node, index) => {
      const s = 0.15 * KIND_SCALES[node.kind];
      matrix.compose(
        vec.set(...positions[index]),
        quaternion,
        scale.set(s, s, s),
      );
      nodes.setMatrixAt(index, matrix);
      nodes.setColorAt(index, KIND_COLORS[node.kind]);
    });
    nodes.instanceMatrix.needsUpdate = true;
    if (nodes.instanceColor) nodes.instanceColor.needsUpdate = true;
  }, [positions]);

  const paintQuery = (rampT: number) => {
    const nodes = nodesRef.current;
    const depths = depthsRef.current;
    const reach = rampT * 3;

    NODES.forEach((node, index) => {
      const depth = depths?.get(node.id) ?? Infinity;
      const related = depths !== null && depth <= 2;
      const lit = related && depth <= reach;
      tmpColor.current.copy(KIND_COLORS[node.kind]);
      if (depths !== null && !lit) {
        tmpColor.current.multiplyScalar(related ? 0.55 : DIM);
      }
      nodes?.setColorAt(index, tmpColor.current);
    });
    if (nodes?.instanceColor) nodes.instanceColor.needsUpdate = true;

    EDGES.forEach(([a, b], index) => {
      const da = depths?.get(a) ?? Infinity;
      const db = depths?.get(b) ?? Infinity;
      const onPath =
        depths !== null &&
        Math.max(da, db) <= 2 &&
        Math.abs(da - db) === 1 &&
        Math.max(da, db) <= reach;
      tmpColor.current.copy(onPath ? EDGE_LIT : EDGE_BASE);
      if (depths !== null && !onPath) tmpColor.current.multiplyScalar(0.6);
      for (const vertex of [0, 1]) {
        edgeColors.set(
          [tmpColor.current.r, tmpColor.current.g, tmpColor.current.b],
          index * 6 + vertex * 3,
        );
      }
    });
    edgeGeometry.attributes.color.needsUpdate = true;
  };

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = constellationState;

    // Query đổi → BFS mới + reset ramp thắp sáng theo tầng
    if (state.queried !== lastQueried.current) {
      lastQueried.current = state.queried;
      depthsRef.current = state.queried ? bfsFrom(state.queried) : null;
      ramp.current = 0;
    }
    if (ramp.current < 1) {
      ramp.current = Math.min(ramp.current + dt / RAMP_SECONDS, 1);
      paintQuery(ramp.current);
    }

    // Camera orbit chậm theo cuộn
    smooth.current.p +=
      (state.progress - smooth.current.p) * (1 - Math.exp(-dt * 5));
    const p = smooth.current.p;
    const angle = 0.45 + p * 1.15;
    camera.position.set(
      Math.sin(angle) * 10.5,
      1.6 + p * 1.8,
      Math.cos(angle) * 10.5,
    );
    camera.lookAt(0, 0, 0);

    if (ramp.current < 1 || Math.abs(state.progress - p) > 1e-4) {
      root.invalidate();
    }
  });

  const onNodePointer = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (event.instanceId === undefined || constellationState.pinned) return;
    queryNode(constellationState, NODES[event.instanceId].id);
  };

  const onNodeClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.instanceId === undefined) return;
    const id = NODES[event.instanceId].id;
    if (constellationState.pinned && constellationState.queried === id) {
      constellationState.pinned = false;
    } else {
      constellationState.pinned = true;
      queryNode(constellationState, id);
    }
  };

  return (
    <group>
      {/* 27 ngôi sao: 1 draw call, raycast instanceId */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, NODES.length]}
        onPointerMove={onNodePointer}
        onPointerOut={() => {
          if (!constellationState.pinned) {
            queryNode(constellationState, null);
          }
        }}
        onClick={onNodeClick}
      >
        <icosahedronGeometry args={[0.15, 1]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* 40 cạnh phụ thuộc: 1 LineSegments vertexColors */}
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.9} />
      </lineSegments>

      {/* Bụi nền: 1 Points tĩnh */}
      <points geometry={dustGeometry}>
        <pointsMaterial color="#1d2531" size={0.05} sizeAttenuation />
      </points>
    </group>
  );
}
