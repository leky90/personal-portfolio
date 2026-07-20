/**
 * Shader hệ hạt glyph. GLSL3 bắt buộc vì vertex texelFetch bảng toạ độ
 * heading (DataTexture float 64 cột × 64 hàng mỗi heading) theo aId.
 * Bài học cũ giữ nguyên: tự khai `out vec4 fragColor`, cấm tên hàm
 * `luminance`. Tan/hợp là stagger per-seed + puff sin — stateless,
 * không FBO sim.
 */

export const GLYPH_VERTEX_SHADER = /* glsl */ `
uniform sampler2D uTargets;
uniform float uRowA;
uniform float uRowB;
uniform float uBlend;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uSize;

in float aId;
in vec4 aSeed;

out float vSeed;
out float vPuff;

vec3 fetchTarget(float row, float id) {
  int index = int(id);
  ivec2 texel = ivec2(index % 64, index / 64 + int(row) * 64);
  return texelFetch(uTargets, texel, 0).xyz;
}

void main() {
  vec3 targetA = fetchTarget(uRowA, aId);
  vec3 targetB = fetchTarget(uRowB, aId);

  // Stagger theo seed: chữ bong ra không đều thay vì tween cả khối
  float stag = clamp((uBlend - aSeed.x * 0.3) / 0.7, 0.0, 1.0);
  vec3 pos = mix(targetA, targetB, stag);

  // Puff giữa hành trình: hạt phồng ra theo pseudo-curl rẻ tiền
  float puff = sin(3.14159265 * stag);
  pos.x += sin(aSeed.y * 40.0 + stag * 6.0) * puff * 0.6;
  pos.y += cos(aSeed.z * 40.0 + stag * 5.0) * puff * 0.45;

  // Con trỏ khắc wake vào hệ chữ rồi tự lành
  vec2 away = pos.xy - uPointer;
  float dist = length(away);
  float repel = uPointerStrength * smoothstep(1.1, 0.0, dist);
  pos.xy += (away / max(dist, 1e-4)) * repel * 0.55;

  vSeed = aSeed.w;
  vPuff = puff;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * (1.0 + puff * 1.3);
}
`;

export const GLYPH_FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uColor;

in float vSeed;
in float vPuff;

out vec4 fragColor;

void main() {
  // Hạt tròn, ngoài đĩa thì bỏ
  vec2 offset = gl_PointCoord - 0.5;
  if (dot(offset, offset) > 0.25) discard;

  // Shimmer Bayer 2×2 theo seed — ăn khớp identity dither của site
  float bayer = mod(
    floor(gl_FragCoord.x) + floor(gl_FragCoord.y) * 2.0,
    4.0
  ) / 4.0;
  float alpha = 0.9 - step(0.72, fract(vSeed * 7.31 + bayer)) * 0.4;

  // Hạt đang bay mờ hơn hạt đã xếp thành chữ
  alpha *= 1.0 - vPuff * 0.35;

  fragColor = vec4(uColor, alpha);
}
`;
