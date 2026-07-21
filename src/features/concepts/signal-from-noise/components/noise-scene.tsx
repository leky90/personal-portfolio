"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  PARTICLE_TOTAL,
  buildGlobePoints,
  buildLatticePoints,
  buildNamePoints,
  formPhase,
} from "@/features/concepts/signal-from-noise/lib/noise-data";
import { NoiseMaterial } from "@/features/concepts/signal-from-noise/lib/noise-material";
import type { NoiseState } from "@/features/concepts/signal-from-noise/lib/noise-state";

interface NoiseSceneProps {
  noiseState: NoiseState;
}

const TEX_COLS = 64;
const ROWS_PER_FORM = PARTICLE_TOTAL / TEX_COLS;

/**
 * MỘT trường hạt, MỘT draw call: toạ độ 3 form bake vào một
 * DataTexture float, vertex shader mix theo phase với stagger seed;
 * ordering lens đảo chiều nở trật tự dưới con trỏ. Không additive,
 * không bloom — chống particle-soup có chủ đích.
 */
export function NoiseScene({ noiseState }: NoiseSceneProps) {
  const { geometry, material, texture } = useMemo(() => {
    const forms = [
      buildNamePoints(PARTICLE_TOTAL),
      buildGlobePoints(PARTICLE_TOTAL),
      buildLatticePoints(PARTICLE_TOTAL),
    ];
    const data = new Float32Array(TEX_COLS * ROWS_PER_FORM * forms.length * 4);
    forms.forEach((points, formIndex) => {
      points.forEach(([x, y, z], index) => {
        const offset = (formIndex * PARTICLE_TOTAL + index) * 4;
        data[offset] = x;
        data[offset + 1] = y;
        data[offset + 2] = z;
        data[offset + 3] = 1;
      });
    });
    const targets = new THREE.DataTexture(
      data,
      TEX_COLS,
      ROWS_PER_FORM * forms.length,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    targets.needsUpdate = true;

    const ids = new Float32Array(PARTICLE_TOTAL);
    const seeds = new Float32Array(PARTICLE_TOTAL * 4);
    const positions = new Float32Array(PARTICLE_TOTAL * 3);
    for (let i = 0; i < PARTICLE_TOTAL; i += 1) {
      ids[i] = i;
      for (let c = 0; c < 4; c += 1) {
        let a = ((i * 4 + c + 11) * 2654435761) >>> 0;
        a ^= a >>> 15;
        seeds[i * 4 + c] = (a >>> 0) / 4294967296;
      }
    }
    const points = new THREE.BufferGeometry();
    points.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    points.setAttribute("aId", new THREE.BufferAttribute(ids, 1));
    points.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));

    const noiseMaterial = new NoiseMaterial();
    noiseMaterial.uniforms.uTargets.value = targets;

    return { geometry: points, material: noiseMaterial, texture: targets };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [geometry, material, texture]);

  const smooth = useRef({ phase: 0, strength: 0 });

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = noiseState;
    const lambda = 1 - Math.exp(-dt * 5);

    smooth.current.phase += (state.phase - smooth.current.phase) * lambda;
    smooth.current.strength +=
      (state.pointerStrength - smooth.current.strength) * lambda * 1.4;

    const phase = formPhase(smooth.current.phase);
    material.setPhase(phase.formA, phase.formB, phase.blend);
    material.setPointer(
      state.pointer[0],
      state.pointer[1],
      smooth.current.strength,
    );

    if (
      Math.abs(state.phase - smooth.current.phase) > 1e-3 ||
      smooth.current.strength > 1e-2
    ) {
      root.invalidate();
    }
  });

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    noiseState.pointer[0] = event.point.x;
    noiseState.pointer[1] = event.point.y;
    noiseState.pointerStrength = 1;
    noiseState.invalidate?.();
  };

  return (
    <group>
      {/* Toàn bộ trường hạt: đúng 1 draw call */}
      <points geometry={geometry} material={material} />

      {/* Plane vô hình bắt ordering lens */}
      <mesh
        onPointerMove={onPointerMove}
        onPointerOut={() => {
          noiseState.pointerStrength = 0;
          noiseState.invalidate?.();
        }}
      >
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
