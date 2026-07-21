/**
 * Shader thiên hà: sao ngưng tụ từ bụi tại "star-formation frontier"
 * bám theo uProgress — trước frontier chỉ là bụi trôi mờ, sau frontier
 * là sao đã yên vị. GLSL1 đủ: hai vị trí (bụi/xoắn ốc) là attribute,
 * màu 4 era mix bằng step, không index mảng uniform động.
 */

export const GALAXY_VERTEX_SHADER = /* glsl */ `
attribute float aBirth;
attribute float aEra;
attribute float aSeed;
attribute vec3 aDust;

uniform float uProgress;
uniform float uSize;

varying float vEra;
varying float vIgnite;
varying float vFrontier;

void main() {
  // Sao ngưng tụ khi frontier đi qua tuần sinh của nó
  float ignite = smoothstep(aBirth - 0.06, aBirth, uProgress);

  // Bụi trôi chậm theo seed trước khi bị kéo về xoắn ốc
  vec3 drift = aDust + vec3(
    sin(aSeed * 40.0) * 0.4,
    cos(aSeed * 31.0) * 0.3,
    sin(aSeed * 23.0) * 0.4
  );
  vec3 pos = mix(drift, position, ignite);

  // Sao ngay tại frontier loé to (đang hình thành)
  float frontier = smoothstep(0.08, 0.0, abs(uProgress - aBirth));

  vEra = aEra;
  vIgnite = ignite;
  vFrontier = frontier;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize =
    uSize * (0.5 + ignite * 0.5 + frontier * 1.6) * (10.0 / -mvPosition.z);
}
`;

export const GALAXY_FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uEra0;
uniform vec3 uEra1;
uniform vec3 uEra2;
uniform vec3 uEra3;

varying float vEra;
varying float vIgnite;
varying float vFrontier;

void main() {
  vec2 offset = gl_PointCoord - 0.5;
  float falloff = 1.0 - smoothstep(0.1, 0.5, length(offset));
  if (falloff <= 0.0) discard;

  vec3 color = uEra0;
  color = mix(color, uEra1, step(0.5, vEra));
  color = mix(color, uEra2, step(1.5, vEra));
  color = mix(color, uEra3, step(2.5, vEra));

  // Bụi mờ lạnh, sao sáng, frontier trắng nóng
  float alpha = falloff * (0.08 + vIgnite * 0.72 + vFrontier * 0.4);
  vec3 finalColor = mix(color * 0.5, color, vIgnite) + vec3(vFrontier * 0.6);

  gl_FragColor = vec4(finalColor, alpha);
}
`;
