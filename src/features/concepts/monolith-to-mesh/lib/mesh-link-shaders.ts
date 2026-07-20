/**
 * Shader filament giữa các service: cạnh chỉ tồn tại khi timeline chạm
 * birth của nó, dash pulse chạy dọc cạnh theo uTime đọc như traffic.
 */

export const LINK_VERTEX_SHADER = /* glsl */ `
  attribute float aBirth;
  attribute float aParam;

  varying float vBirth;
  varying float vParam;

  void main() {
    vBirth = aBirth;
    vParam = aParam;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const LINK_FRAGMENT_SHADER = /* glsl */ `
  uniform float uU;
  uniform float uTime;
  uniform vec3 uCyan;
  uniform vec3 uCore;

  varying float vBirth;
  varying float vParam;

  void main() {
    float born = smoothstep(vBirth - 0.03, vBirth, uU);
    if (born <= 0.001) discard;

    // Pulse: dải sáng chạy dọc cạnh
    float p = fract(vParam - uTime * 0.25);
    float band = smoothstep(0.16, 0.0, p);

    vec3 color = mix(uCyan, uCore, band * 0.6);
    float alpha = born * (0.16 + band * 0.7);

    gl_FragColor = vec4(color, alpha);
  }
`;
