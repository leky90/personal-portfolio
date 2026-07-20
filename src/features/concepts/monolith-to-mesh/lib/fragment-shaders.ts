/**
 * Shader mảnh monolith: toàn bộ morph home→target chạy trong VERTEX shader
 * từ một uniform uU duy nhất — scrub timeline không tốn một matrix CPU nào.
 * Kind 2 (tách non) có cửa sổ thứ hai kéo mảnh về lại khối.
 */

export const FRAGMENT_VERTEX_SHADER = /* glsl */ `
  attribute vec3 aHome;
  attribute vec3 aTarget;
  attribute vec2 aPhase;
  attribute vec2 aPhase2;
  attribute float aKind;
  attribute vec3 aSize;
  attribute float aIndex;

  uniform float uU;
  uniform float uLift;
  uniform float uHover;

  varying float vSep;
  varying float vHover;
  varying vec2 vUv;
  varying float vShade;

  void main() {
    float pOut = smoothstep(aPhase.x, aPhase.y, uU);
    float pBack = aKind > 1.5 ? smoothstep(aPhase2.x, aPhase2.y, uU) : 0.0;
    float sep = aKind < 0.5 ? pOut : pOut * (1.0 - pBack);

    vec3 center = mix(aHome, aTarget, sep);
    center.y += sin(sep * 3.14159265) * uLift;

    float isHover = 1.0 - step(0.5, abs(aIndex - uHover));
    center.y += isHover * 0.12;

    float shrink = mix(1.0, 0.9, sep);
    vec3 world = center + position * aSize * shrink;

    // Fake shade đơn giản theo normal — không cần đèn thật
    vec3 lightDir = normalize(vec3(0.5, 0.85, 0.35));
    vShade = 0.55 + 0.45 * max(dot(normalize(normalMatrix * normal), lightDir), 0.0);

    vSep = sep;
    vHover = isHover;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`;

export const FRAGMENT_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uCyan;
  uniform vec3 uGraphite;

  varying float vSep;
  varying float vHover;
  varying vec2 vUv;
  varying float vShade;

  void main() {
    // Viền kerf: rìa mỗi mặt hộp sáng cyan theo độ tách
    vec2 centered = abs(vUv - 0.5) * 2.0;
    float border = max(centered.x, centered.y);
    float edge = smoothstep(0.82, 0.97, border);

    vec3 color = uGraphite * vShade;
    float glow = edge * (0.12 + vSep * 0.88) + vHover * 0.35;
    color += uCyan * glow;

    gl_FragColor = vec4(color, 1.0);
  }
`;
