"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  CONSTRAINTS,
  RAY_COLORS,
  buildBeamPoints,
  rayTargets,
  spectrumSpread,
} from "@/features/concepts/constraint-prism/lib/prism-data";
import { BeamMaterial } from "@/features/concepts/constraint-prism/lib/beam-material";
import {
  isActive,
  type PrismState,
} from "@/features/concepts/constraint-prism/lib/prism-state";

interface PrismSceneProps {
  prismState: PrismState;
}

const ALL_OFF = CONSTRAINTS.map(() => false);
/** X của 5 wedge = x các kink point 2..6 trên tia */
const WEDGE_XS = buildBeamPoints(ALL_OFF)
  .slice(2, 7)
  .map((point) => point[0]);

const EPS = 1e-3;

/**
 * Quang học ràng buộc: tia = 2 ribbon (core + glow) chia chung 8 control
 * point Vector3 — re-refract là damp 8 giá trị y, zero realloc. 5 wedge
 * là 5 mesh mờ raycast được; phổ 6 tia gói trong 1 LineSegments. Đứng
 * yên là thẩm mỹ: frameloop demand, mọi spring có epsilon cutoff.
 */
export function PrismScene({ prismState }: PrismSceneProps) {
  const { sharedPoints, coreMaterial, glowMaterial, ribbonGeometry, rays } =
    useMemo(() => {
      const points = buildBeamPoints(ALL_OFF).map(
        (p) => new THREE.Vector3(p[0], p[1], p[2]),
      );

      const rayPositions = new Float32Array(6 * 2 * 3);
      const rayColors = new Float32Array(6 * 2 * 3);
      const color = new THREE.Color();
      RAY_COLORS.forEach((hex, ray) => {
        color.set(hex);
        for (const vertex of [0, 1]) {
          const base = (ray * 2 + vertex) * 3;
          rayColors[base] = color.r;
          rayColors[base + 1] = color.g;
          rayColors[base + 2] = color.b;
        }
      });
      const rayGeometry = new THREE.BufferGeometry();
      rayGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(rayPositions, 3),
      );
      rayGeometry.setAttribute(
        "color",
        new THREE.BufferAttribute(rayColors, 3),
      );

      return {
        sharedPoints: points,
        coreMaterial: new BeamMaterial({
          points,
          width: 0.075,
          intensity: 1,
        }),
        glowMaterial: new BeamMaterial({
          points,
          width: 0.34,
          intensity: 0.28,
        }),
        ribbonGeometry: new THREE.PlaneGeometry(1, 1, 95, 1),
        rays: {
          geometry: rayGeometry,
          positions: rayPositions,
          material: new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
          }),
        },
      };
    }, []);

  useEffect(() => {
    return () => {
      coreMaterial.dispose();
      glowMaterial.dispose();
      ribbonGeometry.dispose();
      rays.geometry.dispose();
      rays.material.dispose();
    };
  }, [coreMaterial, glowMaterial, ribbonGeometry, rays]);

  const wedgeMaterials = useMemo(
    () =>
      CONSTRAINTS.map(
        () =>
          new THREE.MeshStandardMaterial({
            color: "#5b7c99",
            emissive: "#7dd3fc",
            emissiveIntensity: 0.03,
            transparent: true,
            opacity: 0.07,
            roughness: 0.25,
            metalness: 0.1,
            side: THREE.DoubleSide,
          }),
      ),
    [],
  );
  useEffect(() => {
    return () => {
      for (const material of wedgeMaterials) material.dispose();
    };
  }, [wedgeMaterials]);

  const wedgeRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Giá trị damp hiện tại: y của 8 control point + spread + trạng thái wedge
  const currentY = useRef(new Float32Array(8));
  const targetY = useRef(new Float32Array(8));
  const spread = useRef({ current: 0.12, target: 0.12 });
  const wedgeAnim = useRef(
    CONSTRAINTS.map(() => ({ y: 1.5, opacity: 0.07, emissive: 0.03 })),
  );
  const lastMask = useRef(-1);

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = prismState;

    // Mask đổi → tính lại đích (rẻ: 8 số + 1 spread)
    if (state.mask !== lastMask.current) {
      lastMask.current = state.mask;
      const active = CONSTRAINTS.map((_, i) => isActive(state.mask, i));
      const points = buildBeamPoints(active);
      for (let i = 0; i < 8; i += 1) targetY.current[i] = points[i][1];
      spread.current.target = spectrumSpread(active);
    }

    // Damp control point y + spread + wedge slide/opacity
    let moving = 0;
    const lambda = 1 - Math.exp(-dt * 7);
    for (let i = 0; i < 8; i += 1) {
      const diff = targetY.current[i] - currentY.current[i];
      if (Math.abs(diff) > EPS) {
        currentY.current[i] += diff * lambda;
        moving += Math.abs(diff);
      } else {
        currentY.current[i] = targetY.current[i];
      }
      sharedPoints[i].y = currentY.current[i];
    }
    const spreadDiff = spread.current.target - spread.current.current;
    if (Math.abs(spreadDiff) > EPS) {
      spread.current.current += spreadDiff * lambda;
      moving += Math.abs(spreadDiff);
    }

    for (let i = 0; i < CONSTRAINTS.length; i += 1) {
      const active = isActive(state.mask, i);
      const anim = wedgeAnim.current[i];
      const targets = {
        y: active ? 0 : 1.5,
        opacity: active ? 0.3 : 0.07,
        emissive: active ? 0.45 : 0.03,
      };
      for (const key of ["y", "opacity", "emissive"] as const) {
        const diff = targets[key] - anim[key];
        if (Math.abs(diff) > EPS) {
          anim[key] += diff * lambda;
          moving += Math.abs(diff);
        }
      }
      const mesh = wedgeRefs.current[i];
      if (mesh) mesh.position.y = anim.y;
      wedgeMaterials[i].opacity = anim.opacity;
      wedgeMaterials[i].emissiveIntensity = anim.emissive;
    }

    // Phổ 6 tia bám exit point + spread hiện tại (ghi thẳng vào attr)
    const exitX = sharedPoints[7].x;
    const exitY = currentY.current[7];
    const targets = rayTargets(ALL_OFF); // chỉ lấy x đích cố định
    for (let ray = 0; ray < 6; ray += 1) {
      const base = ray * 6;
      rays.positions[base] = exitX;
      rays.positions[base + 1] = exitY;
      rays.positions[base + 2] = 0;
      const t = (ray - 2.5) / 2.5;
      rays.positions[base + 3] = targets[ray][0];
      rays.positions[base + 4] = exitY + t * spread.current.current;
      rays.positions[base + 5] = 0;
    }
    rays.geometry.attributes.position.needsUpdate = true;

    if (moving > EPS) {
      root.invalidate();
    }
  });

  const onWedgeClick = (index: number) => (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    prismState.onToggle?.(index);
  };

  return (
    <group>
      <hemisphereLight args={["#c8d4e2", "#0e1116", 0.9]} />
      <directionalLight position={[2, 5, 6]} intensity={0.7} />

      {/* Tia ý tưởng: core + glow, chung geometry + control points */}
      <mesh geometry={ribbonGeometry} material={glowMaterial} />
      <mesh geometry={ribbonGeometry} material={coreMaterial} />

      {/* 5 wedge ràng buộc — kính mờ, rút khỏi stack thì trượt lên */}
      {CONSTRAINTS.map((constraint, index) => (
        <mesh
          key={constraint.id}
          ref={(mesh) => {
            wedgeRefs.current[index] = mesh;
          }}
          position={[WEDGE_XS[index], 1.5, 0]}
          rotation={[0, 0, index % 2 === 0 ? 0.16 : -0.16]}
          material={wedgeMaterials[index]}
          onClick={onWedgeClick(index)}
        >
          <boxGeometry args={[0.5, 2.8, 1.5]} />
        </mesh>
      ))}

      {/* Phổ 6 tia sau stack: 1 LineSegments vertexColors */}
      <lineSegments geometry={rays.geometry} material={rays.material} />
    </group>
  );
}
