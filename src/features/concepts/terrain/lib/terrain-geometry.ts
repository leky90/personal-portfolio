import * as THREE from "three";
import {
  TERRAIN_DEPTH,
  TERRAIN_WIDTH,
} from "@/features/concepts/terrain/lib/camera-path";

/**
 * Toàn bộ địa hình là MỘT BufferGeometry cho LineSegments — 1 draw call.
 * lines × samples vertex; index chỉ nối các cặp kề nhau TRONG một line
 * (không có cạnh vắt ngang giữa hai line). Y để 0 — displacement nằm hết
 * trong vertex shader.
 */
export function buildRidgelineGeometry(
  lines: number,
  samples: number,
  width: number = TERRAIN_WIDTH,
  depth: number = TERRAIN_DEPTH,
): THREE.BufferGeometry {
  const vertexCount = lines * samples;
  const positions = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);

  let p = 0;
  let q = 0;
  for (let line = 0; line < lines; line += 1) {
    const v = lines === 1 ? 0 : line / (lines - 1);
    const z = v * depth;
    for (let s = 0; s < samples; s += 1) {
      const u = samples === 1 ? 0 : s / (samples - 1);
      positions[p++] = (u - 0.5) * width;
      positions[p++] = 0;
      positions[p++] = z;
      uvs[q++] = u;
      uvs[q++] = v;
    }
  }

  const indices = new Uint32Array(lines * (samples - 1) * 2);
  let k = 0;
  for (let line = 0; line < lines; line += 1) {
    const rowStart = line * samples;
    for (let s = 0; s < samples - 1; s += 1) {
      indices[k++] = rowStart + s;
      indices[k++] = rowStart + s + 1;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  return geometry;
}
