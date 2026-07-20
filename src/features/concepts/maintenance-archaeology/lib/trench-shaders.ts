import {
  STRATA,
  TRENCH_HEIGHT,
  TRENCH_TOP,
} from "@/features/concepts/maintenance-archaeology/lib/strata-data";

/**
 * Vách hố: màu địa tầng KHÔNG tính trong shader mà bake CPU thành một era
 * ramp 256×1 (kèm seam tối ở ranh giới) — fragment chỉ việc sample, cộng
 * grain noise và vạch nén. Ấm dần theo độ sâu = tuổi.
 */

const BAND_COLORS: [number, number, number][] = [
  [42, 45, 49], // I graphite
  [59, 55, 51], // II
  [92, 74, 56], // III clay
  [138, 98, 56], // IV ochre
  [163, 84, 47], // V terracotta bedrock
];

/** 256 texel RGBA: depth-fraction → màu stratum, seam tối tại ranh giới. */
export function buildEraRamp(): Uint8Array {
  const ramp = new Uint8Array(256 * 4);
  const boundaries = STRATA.map(
    (s) => (TRENCH_TOP - s.yBottom) / TRENCH_HEIGHT,
  );
  for (let i = 0; i < 256; i += 1) {
    const depth = i / 255;
    let band = STRATA.length - 1;
    for (let b = 0; b < boundaries.length; b += 1) {
      if (depth <= boundaries[b] + 1e-6) {
        band = b;
        break;
      }
    }
    let [r, g, b2] = BAND_COLORS[band];
    // Seam ẩm tối quanh ranh giới (trừ đáy)
    for (let b = 0; b < boundaries.length - 1; b += 1) {
      const distance = Math.abs(depth - boundaries[b]);
      if (distance < 0.012) {
        const k = 0.3 + (distance / 0.012) * 0.4;
        r *= k;
        g *= k;
        b2 *= k;
      }
    }
    ramp[i * 4] = Math.round(r);
    ramp[i * 4 + 1] = Math.round(g);
    ramp[i * 4 + 2] = Math.round(b2);
    ramp[i * 4 + 3] = 255;
  }
  return ramp;
}

export const TRENCH_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const TRENCH_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uEraRamp;

  varying vec2 vUv;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    float depth = 1.0 - vUv.y;
    vec3 color = texture2D(uEraRamp, vec2(depth, 0.5)).rgb;

    // Hạt trầm tích + vạch nén ngang mảnh
    float grain = hash21(floor(vUv * vec2(420.0, 300.0))) * 0.10;
    float compaction = step(0.94, fract(vUv.y * 70.0)) * 0.06;
    color *= 0.92 + grain - compaction;

    // Vignette nhẹ hai mép hố
    float edge = smoothstep(0.5, 0.0, abs(vUv.x - 0.5));
    color *= 0.72 + edge * 0.28;

    gl_FragColor = vec4(color, 1.0);
  }
`;
