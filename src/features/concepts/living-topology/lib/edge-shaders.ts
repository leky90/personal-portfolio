/**
 * Shader cạnh graph — GLSL1 (không cần array uniform). Reveal theo uYear
 * (timeline mọc dần), highlight theo uFocus (hover node / hover project card).
 */

export const EDGE_VERTEX_SHADER = /* glsl */ `
  attribute float aYear;
  attribute vec2 aSystems;

  varying float vYear;
  varying vec2 vSystems;
  varying float vDepth;

  void main() {
    vYear = aYear;
    vSystems = aSystems;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const EDGE_FRAGMENT_SHADER = /* glsl */ `
  uniform float uYear;
  uniform float uFocus;
  uniform vec3 uInk;
  uniform vec3 uAccent;

  varying float vYear;
  varying vec2 vSystems;
  varying float vDepth;

  void main() {
    // Cạnh chỉ tồn tại khi timeline đã chạm tới năm của nó (fade 6 tháng)
    float born = smoothstep(vYear - 0.5, vYear, uYear);
    if (born <= 0.001) discard;

    // Highlight khi một trong hai đầu thuộc hệ thống đang được query
    float match = uFocus < 0.0
      ? 0.0
      : max(
          1.0 - step(0.5, abs(vSystems.x - uFocus)),
          1.0 - step(0.5, abs(vSystems.y - uFocus))
        );
    float dimOthers = uFocus < 0.0 ? 1.0 : mix(0.25, 1.0, match);

    vec3 color = mix(uInk, uAccent, match);
    float depthFade = exp(-vDepth * 0.016);
    float alpha = born * (0.16 + 0.3 * match) * dimOthers * depthFade;

    gl_FragColor = vec4(color, alpha);
  }
`;
