/**
 * Shader tháp truss. GLSL3 bắt buộc vì vertex index mảng uniform động
 * theo tầng (uStrain[int(aFloor)]) — bài học từ concept resolution:
 * GLSL3 phải tự khai báo `out vec4 fragColor` (three không alias
 * gl_FragColor) và KHÔNG được đặt tên hàm `luminance` (đụng prefix
 * tonemapping). Không light, không shadow: hemisphere bake trong fragment.
 */

export const TRUSS_VERTEX_SHADER = /* glsl */ `
uniform float uYear;
uniform float uCounterfactual;
uniform float uTremor;
uniform float uTime;
uniform float uStrain[12];
uniform float uStrainAlt[12];

in float aFloor;
in float aBuiltYear;
in float aSeed;
in float aRefactorTag;

out float vStrain;
out float vBuild;
out float vRefactor;
out vec3 vNormalW;

void main() {
  float sTrue = uStrain[int(aFloor)];
  float sAlt = uStrainAlt[int(aFloor)];
  float s = mix(sTrue, sAlt, uCounterfactual);

  // Build-in khi uYear vượt aBuiltYear: scale 0 → 1 với overshoot nhẹ
  float build = clamp((uYear - aBuiltYear) / 0.6, 0.0, 1.0);
  float overshoot = 1.0 + 0.22 * sin(build * 3.14159265) * (1.0 - build);
  vec3 p = position * build * overshoot;

  vec4 world = instanceMatrix * vec4(p, 1.0);

  // Shear + sag: tầng càng cao lệch càng xa, nợ càng nặng nghiêng càng sâu
  float hf = (aFloor + 1.0) / 10.0;
  world.x += s * 0.65 * hf * hf;
  world.y -= s * 0.18 * hf;

  // Micro-tremble khi thanh quá 45% ứng suất và cửa sổ tremor đang mở
  float tremble = uTremor * smoothstep(0.45, 0.9, s);
  world.x += tremble * sin(uTime * 42.0 + aSeed * 19.0) * 0.028;
  world.z += tremble * cos(uTime * 37.0 + aSeed * 23.0) * 0.028;

  vStrain = s;
  vBuild = build;
  vRefactor = aRefactorTag;
  vNormalW = normalize(mat3(instanceMatrix) * normal);

  gl_Position = projectionMatrix * modelViewMatrix * world;
}
`;

export const TRUSS_FRAGMENT_SHADER = /* glsl */ `
uniform float uFlash;

in float vStrain;
in float vBuild;
in float vRefactor;
in vec3 vNormalW;

out vec4 fragColor;

void main() {
  vec3 slate = vec3(0.392, 0.455, 0.545);
  vec3 amber = vec3(1.0, 0.706, 0.329);
  vec3 red = vec3(0.898, 0.282, 0.302);
  vec3 cyan = vec3(0.176, 0.831, 0.749);

  // Ramp ứng suất một trục: slate → amber → đỏ tín hiệu
  vec3 color = mix(slate, amber, smoothstep(0.12, 0.55, vStrain));
  color = mix(color, red, smoothstep(0.58, 0.95, vStrain));

  // Thanh thuộc tầng refactor loé cyan trong cửa sổ uFlash
  color = mix(color, cyan, clamp(uFlash * vRefactor, 0.0, 1.0));

  // Hemisphere bake: sáng từ trên, tối dần xuống bụng thanh
  float hemi = dot(normalize(vNormalW), vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
  color *= 0.45 + hemi * 0.75;

  // Thanh đang build-in loé trắng nhẹ rồi nguội
  color += vec3(0.10) * (1.0 - vBuild);

  fragColor = vec4(color, 1.0);
}
`;
