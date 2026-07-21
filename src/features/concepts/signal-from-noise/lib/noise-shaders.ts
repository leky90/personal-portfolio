/**
 * Shader trường hạt tín-hiệu-giữa-nhiễu. GLSL3 vì texelFetch bảng toạ
 * độ 3 form. Ordering lens CỐ Ý đảo chiều trope repel cũ: hạt GẦN con
 * trỏ trật tự hoá SỚM hơn (order nở ra dưới bàn tay), rời đi thì thả
 * lại về nhiễu. Màu hai stop lạnh → ấm theo độ trật tự từng hạt.
 */

export const NOISE_VERTEX_SHADER = /* glsl */ `
uniform sampler2D uTargets;
uniform float uFormA;
uniform float uFormB;
uniform float uBlend;
uniform vec2 uPointer;
uniform float uPointerStrength;
uniform float uSize;

in float aId;
in vec4 aSeed;

out float vOrder;

vec3 fetchForm(float form, float id) {
  int index = int(id);
  ivec2 texel = ivec2(index % 64, index / 64 + int(form) * 64);
  return texelFetch(uTargets, texel, 0).xyz;
}

vec3 chaosOf(vec4 seed, float id) {
  return vec3(
    sin(seed.x * 431.0 + id * 0.017) * 2.6,
    cos(seed.y * 517.0 + id * 0.013) * 1.5,
    sin(seed.z * 379.0 + id * 0.011) * 1.2
  );
}

void main() {
  vec3 targetA = fetchForm(uFormA, aId);
  vec3 targetB = fetchForm(uFormB, aId);

  // Stagger per-seed: form tan/hợp không đều
  float settle = clamp((uBlend - aSeed.x * 0.25) / 0.75, 0.0, 1.0);
  vec3 target = mix(targetA, targetB, settle);

  // Độ trật tự cơ bản: giữa hành trình là nhiễu nhất
  float chaosAmount = sin(3.14159265 * settle);

  // Ordering lens đảo chiều: gần con trỏ → trật tự hoá sớm
  float dist = distance(target.xy, uPointer);
  float lensOrder = uPointerStrength * smoothstep(1.0, 0.0, dist);
  chaosAmount *= 1.0 - lensOrder;

  vec3 chaos = chaosOf(aSeed, aId);
  vec3 pos = mix(target, chaos, chaosAmount * (0.55 + aSeed.w * 0.45));

  vOrder = 1.0 - chaosAmount;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = uSize * (0.8 + vOrder * 0.6);
}
`;

export const NOISE_FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uCold;
uniform vec3 uWarm;

in float vOrder;

out vec4 fragColor;

void main() {
  vec2 offset = gl_PointCoord - 0.5;
  if (dot(offset, offset) > 0.25) discard;

  // Ramp hai stop: nhiễu lạnh mờ → tín hiệu ấm đặc
  vec3 color = mix(uCold, uWarm, smoothstep(0.35, 0.95, vOrder));
  float alpha = mix(0.35, 0.95, vOrder);

  fragColor = vec4(color, alpha);
}
`;
