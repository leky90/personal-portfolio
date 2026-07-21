/**
 * Lớp phosphor fullscreen: glyph field procedural (chấm/gạch 3 mức theo
 * hash per-cell) + scanline + vignette, phủ TRÊN khối kim loại render
 * thường. Con trỏ là thấu kính: trong bán kính uRadius alpha đục thủng
 * để lộ sự thật, band chuyển tiếp co cell 12px → 4px trước khi tan.
 * Một pass stateless — không FBO, không ping-pong — nên demand thuần.
 */

export const LENS_VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  // Fullscreen quad clip-space: bỏ qua mọi ma trận
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const LENS_FRAGMENT_SHADER = /* glsl */ `
varying vec2 vUv;

uniform vec2 uPointer;
uniform float uRadius;
uniform float uCoverage;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uPhosphor;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

void main() {
  vec2 frag = vUv * uResolution;
  float dist = distance(frag, uPointer);

  // Band chuyển tiếp: cell 12px ngoài xa co về 4px sát mép thấu kính
  float band = smoothstep(uRadius, uRadius * 2.2, dist);
  float cell = mix(4.0, 12.0, band);

  vec2 cellId = floor(frag / cell);
  vec2 cellUv = fract(frag / cell);

  // Glyph giả 3 mức theo hash + shimmer phosphor chậm
  float h = hash21(cellId);
  float shimmer = hash21(cellId + floor(uTime * 2.0));
  float level = h * 0.75 + shimmer * 0.25;

  float glyph = 0.0;
  if (level > 0.66) {
    glyph = step(abs(cellUv.y - 0.5), 0.32) * step(abs(cellUv.x - 0.5), 0.36);
  } else if (level > 0.33) {
    glyph = step(abs(cellUv.y - 0.5), 0.12) * step(abs(cellUv.x - 0.5), 0.34);
  } else {
    glyph = step(length(cellUv - 0.5), 0.14);
  }

  // Scanline CRT + vignette
  float scan = 0.85 + 0.15 * sin(frag.y * 3.14159 * 0.5);
  vec2 fromCenter = vUv - 0.5;
  float vignette = 1.0 - dot(fromCenter, fromCenter) * 0.9;

  // Lỗ thấu kính: trong bán kính alpha về 0 để lộ khối kim loại thật
  float hole = smoothstep(uRadius * 0.55, uRadius, dist);
  float alpha = uCoverage * hole * (0.55 + glyph * 0.45);

  vec3 color = uPhosphor * glyph * scan * vignette
    + vec3(0.012, 0.03, 0.016) * (1.0 - glyph);

  gl_FragColor = vec4(color, alpha);
}
`;
