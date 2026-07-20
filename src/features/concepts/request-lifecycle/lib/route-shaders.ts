/**
 * Shader tube route: xung packet là MỘT draw call, không postprocessing.
 * Glow giả bằng đầu xung sáng + đuôi exp fade trên vPathT (uv.x của
 * TubeGeometry chạy dọc path). Đoạn hàng đợi tint amber qua cửa sổ
 * uQueueT0..uQueueT1. GLSL1 là đủ — không index mảng uniform động.
 */

export const ROUTE_VERTEX_SHADER = /* glsl */ `
varying float vPathT;

void main() {
  vPathT = uv.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const ROUTE_FRAGMENT_SHADER = /* glsl */ `
varying float vPathT;

uniform float uProgress;
uniform float uQueueT0;
uniform float uQueueT1;
uniform vec3 uBaseColor;
uniform vec3 uPulseColor;
uniform vec3 uQueueColor;

void main() {
  // Route mờ luôn hiện để đọc được toàn tuyến
  float base = 0.16;

  // Đầu xung sắc tại uProgress
  float head = exp(-abs(vPathT - uProgress) * 110.0);

  // Đuôi chỉ kéo PHÍA SAU đầu xung, fade exp
  float behind = step(vPathT, uProgress);
  float tail = behind * exp(-(uProgress - vPathT) * 16.0) * 0.55;

  // Chặng hàng đợi tint amber (async detour)
  float inQueue = step(uQueueT0, vPathT) * step(vPathT, uQueueT1);
  vec3 lineColor = mix(uPulseColor, uQueueColor, inQueue);

  float energy = head + tail;
  vec3 color = uBaseColor * base + lineColor * energy;
  float alpha = clamp(base + energy, 0.0, 1.0);

  gl_FragColor = vec4(color, alpha);
}
`;
