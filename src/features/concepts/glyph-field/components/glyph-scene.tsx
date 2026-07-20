"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import {
  HEADINGS,
  PARTICLE_COUNT,
  SAMPLE_HEIGHT,
  SAMPLE_WIDTH,
  fitPoints,
  normalizePoints,
  pointsFromAlpha,
  rowPair,
} from "@/features/concepts/glyph-field/lib/glyph-data";
import { GlyphMaterial } from "@/features/concepts/glyph-field/lib/glyph-material";
import type { GlyphState } from "@/features/concepts/glyph-field/lib/glyph-state";

interface GlyphSceneProps {
  glyphState: GlyphState;
}

const TEX_COLS = 64;
const ROWS_PER_HEADING = PARTICLE_COUNT / TEX_COLS;

/** Sample một heading từ canvas 2D; headless thì fitPoints tự fallback. */
function sampleHeading(text: string): [number, number][] {
  if (typeof document === "undefined") return [];
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_WIDTH;
  canvas.height = SAMPLE_HEIGHT;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  ctx.clearRect(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
  ctx.font = "bold 88px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(text, SAMPLE_WIDTH / 2, SAMPLE_HEIGHT / 2);
  const image = ctx.getImageData(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
  const alpha = new Uint8ClampedArray(SAMPLE_WIDTH * SAMPLE_HEIGHT);
  for (let i = 0; i < alpha.length; i += 1) {
    alpha[i] = image.data[i * 4 + 3];
  }
  return pointsFromAlpha(alpha, SAMPLE_WIDTH, SAMPLE_HEIGHT, 120);
}

/**
 * Toàn bộ typography là MỘT hệ Points 4096 hạt = đúng 1 draw call.
 * Toạ độ 4 heading bake vào một DataTexture float; scroll chỉ đổi cặp
 * hàng + blend, con trỏ khắc wake rồi field tự lành và ngủ (demand).
 */
export function GlyphScene({ glyphState }: GlyphSceneProps) {
  const { geometry, material, texture } = useMemo(() => {
    // Bake 4 heading vào một DataTexture: mỗi heading một block 64 hàng
    const data = new Float32Array(TEX_COLS * ROWS_PER_HEADING * HEADINGS.length * 4);
    HEADINGS.forEach((heading, row) => {
      const sampled = sampleHeading(heading);
      const fitted = fitPoints(sampled, PARTICLE_COUNT, row * 101 + 7);
      const world = normalizePoints(fitted, SAMPLE_WIDTH, SAMPLE_HEIGHT, 8.6);
      world.forEach(([x, y], index) => {
        const offset = (row * PARTICLE_COUNT + index) * 4;
        data[offset] = x;
        data[offset + 1] = y;
        data[offset + 2] = 0;
        data[offset + 3] = 1;
      });
    });
    const targets = new THREE.DataTexture(
      data,
      TEX_COLS,
      ROWS_PER_HEADING * HEADINGS.length,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    targets.needsUpdate = true;

    const ids = new Float32Array(PARTICLE_COUNT);
    const seeds = new Float32Array(PARTICLE_COUNT * 4);
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      ids[i] = i;
      for (let c = 0; c < 4; c += 1) {
        let a = ((i * 4 + c + 1) * 2654435761) >>> 0;
        a ^= a >>> 15;
        seeds[i * 4 + c] = (a >>> 0) / 4294967296;
      }
    }
    const points = new THREE.BufferGeometry();
    points.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    points.setAttribute("aId", new THREE.BufferAttribute(ids, 1));
    points.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));

    const glyphMaterial = new GlyphMaterial();
    glyphMaterial.uniforms.uTargets.value = targets;

    return { geometry: points, material: glyphMaterial, texture: targets };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [geometry, material, texture]);

  const smooth = useRef({ p: 0, strength: 0 });

  useFrame((root, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = glyphState;
    const lambda = 1 - Math.exp(-dt * 6);

    smooth.current.p += (state.progress - smooth.current.p) * lambda;
    smooth.current.strength +=
      (state.pointerStrength - smooth.current.strength) * lambda * 1.4;

    const pair = rowPair(smooth.current.p);
    material.setRows(pair.rowA, pair.rowB, pair.blend);
    material.setPointer(
      state.pointer[0],
      state.pointer[1],
      smooth.current.strength,
    );

    if (
      Math.abs(state.progress - smooth.current.p) > 1e-3 ||
      smooth.current.strength > 1e-2
    ) {
      root.invalidate();
    }
  });

  const onPointerMove = (event: ThreeEvent<PointerEvent>) => {
    glyphState.pointer[0] = event.point.x;
    glyphState.pointer[1] = event.point.y;
    glyphState.pointerStrength = 1;
    glyphState.invalidate?.();
  };

  return (
    <group>
      {/* Cả hệ chữ: đúng 1 draw call */}
      <points geometry={geometry} material={material} />

      {/* Plane vô hình bắt con trỏ trên mặt phẳng field */}
      <mesh
        onPointerMove={onPointerMove}
        onPointerOut={() => {
          glyphState.pointerStrength = 0;
          glyphState.invalidate?.();
        }}
      >
        <planeGeometry args={[24, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
