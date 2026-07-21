"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import {
  DESK_OBJECTS,
  ERAS,
  popScale,
  type DeskMaterialKey,
} from "@/features/concepts/desk-version-controlled/lib/desk-data";
import {
  notifyDeskHover,
  type DeskState,
} from "@/features/concepts/desk-version-controlled/lib/desk-state";

interface DeskSceneProps {
  deskState: DeskState;
}

const MATERIAL_COLORS: Record<DeskMaterialKey, string> = {
  wood: "#8a6a48",
  plastic: "#2e3138",
  metal: "#9aa2ad",
  screen: "#26433a",
  paper: "#e3dcc8",
};

/** Mốc node trên nhánh git dọc mép bàn */
const BRANCH_NODES = [0, 0.15, 0.3, 0.42, 0.55, 0.66, 0.8, 0.95];
const BRANCH_POINTS = 24;

/**
 * Diorama isometric giả (fov hẹp, camera xa): 19 đồ vật là mesh
 * primitive chia 5 material; mọi chuyển động là hàm thuần popScale(t)
 * của MỘT progress — scrub tới lui hoàn toàn deterministic. Nhánh git
 * mọc dọc mép bàn bằng drawRange, đèn rim đổi màu theo era.
 */
export function DeskScene({ deskState }: DeskSceneProps) {
  const camera = useThree((three) => three.camera);

  const { materials, branchGeometry, eraColors } = useMemo(() => {
    const shared = Object.fromEntries(
      (Object.keys(MATERIAL_COLORS) as DeskMaterialKey[]).map((key) => [
        key,
        new THREE.MeshLambertMaterial({ color: MATERIAL_COLORS[key] }),
      ]),
    ) as Record<DeskMaterialKey, THREE.MeshLambertMaterial>;

    // Nhánh git là các segment pair để dùng được <lineSegments> + drawRange
    const segments = BRANCH_POINTS - 1;
    const points = new Float32Array(segments * 6);
    const xAt = (i: number) => -2.2 + (i / (BRANCH_POINTS - 1)) * 4.4;
    for (let i = 0; i < segments; i += 1) {
      points.set(
        [xAt(i), 0.08, 1.32, xAt(i + 1), 0.08, 1.32],
        i * 6,
      );
    }
    const branch = new THREE.BufferGeometry();
    branch.setAttribute("position", new THREE.BufferAttribute(points, 3));
    branch.setDrawRange(0, 0);

    return {
      materials: shared,
      branchGeometry: branch,
      eraColors: ERAS.map((era) => new THREE.Color(era.accent)),
    };
  }, []);

  useEffect(() => {
    return () => {
      for (const material of Object.values(materials)) material.dispose();
      branchGeometry.dispose();
    };
  }, [materials, branchGeometry]);

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const rimRef = useRef<THREE.DirectionalLight>(null);
  const smooth = useRef({ p: 0 });
  const tmpMatrix = useRef(new THREE.Matrix4());
  const tmpQuat = useRef(new THREE.Quaternion());
  const tmpPos = useRef(new THREE.Vector3());
  const tmpScale = useRef(new THREE.Vector3());
  const tmpColor = useRef(new THREE.Color());

  const applyProgress = (t: number) => {
    DESK_OBJECTS.forEach((object, index) => {
      const mesh = meshRefs.current[index];
      if (!mesh) return;
      const s = popScale(object, t);
      mesh.visible = s > 1e-3;
      mesh.scale.set(
        object.size[0] * s,
        object.size[1] * s,
        object.size[2] * s,
      );
    });

    branchGeometry.setDrawRange(
      0,
      Math.max(2, Math.floor(t * (BRANCH_POINTS - 1)) * 2),
    );

    const nodes = nodesRef.current;
    if (nodes) {
      BRANCH_NODES.forEach((nodeT, index) => {
        const s = t >= nodeT ? 0.06 : 0.0001;
        tmpMatrix.current.compose(
          tmpPos.current.set(-2.2 + nodeT * 4.4, 0.08, 1.32),
          tmpQuat.current,
          tmpScale.current.set(s, s, s),
        );
        nodes.setMatrixAt(index, tmpMatrix.current);
      });
      nodes.instanceMatrix.needsUpdate = true;
    }

    // Đèn rim đổi màu theo era hiện tại
    const rim = rimRef.current;
    if (rim) {
      const clamped = Math.min(Math.max(t, 0), 1);
      let upper = ERAS.findIndex((era) => era.t >= clamped);
      if (upper <= 0) upper = clamped > 0 ? ERAS.length - 1 : 1;
      const a = ERAS[upper - 1];
      const b = ERAS[upper];
      const blend = (clamped - a.t) / Math.max(b.t - a.t, 1e-6);
      tmpColor.current
        .copy(eraColors[upper - 1])
        .lerp(eraColors[upper], Math.min(Math.max(blend, 0), 1));
      rim.color.copy(tmpColor.current);
    }
  };

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = deskState;

    smooth.current.p +=
      (state.progress - smooth.current.p) * (1 - Math.exp(-dt * 6));
    applyProgress(smooth.current.p);

    camera.position.set(9.6, 8.2, 9.6);
    camera.lookAt(0, 0.25, 0);

    if (Math.abs(state.progress - smooth.current.p) > 1e-4) {
      root.invalidate();
    }
  });

  return (
    <group>
      <hemisphereLight args={["#e8ecf2", "#15171c", 0.85]} />
      <directionalLight position={[5, 8, 4]} intensity={0.9} />
      <directionalLight
        ref={rimRef}
        position={[-6, 3, -4]}
        intensity={0.9}
        color={ERAS[0].accent}
      />

      {/* 19 đồ vật: primitive + 5 material chia sẻ, hover đọc commit */}
      {DESK_OBJECTS.map((object, index) => (
        <mesh
          key={object.id}
          ref={(mesh) => {
            meshRefs.current[index] = mesh;
          }}
          position={object.position}
          material={materials[object.material]}
          onPointerOver={(event) => {
            event.stopPropagation();
            notifyDeskHover(deskState, index);
          }}
          onPointerOut={() => notifyDeskHover(deskState, -1)}
        >
          {object.kind === "box" ? (
            <boxGeometry args={[1, 1, 1]} />
          ) : (
            <cylinderGeometry args={[0.5, 0.5, 1, 14]} />
          )}
        </mesh>
      ))}

      {/* Nhánh git mọc dọc mép bàn theo drawRange */}
      <lineSegments geometry={branchGeometry}>
        <lineBasicMaterial color="#fbbf24" transparent opacity={0.85} />
      </lineSegments>

      {/* Node commit trên nhánh */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, BRANCH_NODES.length]}
      >
        <sphereGeometry args={[1, 10, 10]} />
        <meshBasicMaterial color="#fbbf24" toneMapped={false} />
      </instancedMesh>

      {/* Bóng AO giả dưới bàn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.72, 0]}>
        <circleGeometry args={[3.4, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
