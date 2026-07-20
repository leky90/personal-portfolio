/**
 * Ribbon tia ý tưởng: topology cố định 96×2 vert, vertex shader nội suy
 * Catmull-Rom qua 8 control point uniform — re-refract chỉ là 8 lần ghi
 * vec3, zero realloc. GLSL3 bắt buộc vì index mảng uniform bằng int
 * runtime; bài học cũ: tự khai `out vec4 fragColor`, cấm tên `luminance`.
 * Glow là ribbon thứ hai rộng hơn cùng shader — không postprocessing.
 */

export const BEAM_VERTEX_SHADER = /* glsl */ `
uniform vec3 uPoints[8];
uniform float uWidth;

out float vT;
out float vEdge;

// Catmull-Rom chuẩn qua 8 điểm, clamp đầu mút
vec3 sampleCurve(float t) {
  float ft = clamp(t, 0.0, 1.0) * 7.0;
  int i = int(floor(ft));
  i = clamp(i, 0, 6);
  float f = ft - float(i);

  vec3 p0 = uPoints[max(i - 1, 0)];
  vec3 p1 = uPoints[i];
  vec3 p2 = uPoints[min(i + 1, 7)];
  vec3 p3 = uPoints[min(i + 2, 7)];

  float f2 = f * f;
  float f3 = f2 * f;
  return 0.5 * (
    2.0 * p1 +
    (-p0 + p2) * f +
    (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * f2 +
    (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * f3
  );
}

void main() {
  float t = uv.x;
  vec3 center = sampleCurve(t);

  // Pháp tuyến 2D trong mặt phẳng xy (tia chỉ gập theo y)
  vec3 ahead = sampleCurve(t + 0.01);
  vec3 back = sampleCurve(t - 0.01);
  vec2 tangent = normalize(ahead.xy - back.xy);
  vec2 normal2 = vec2(-tangent.y, tangent.x);

  vec3 pos = center;
  pos.xy += normal2 * (uv.y - 0.5) * uWidth;

  vT = t;
  vEdge = abs(uv.y - 0.5) * 2.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const BEAM_FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uColor;
uniform float uIntensity;

in float vT;
in float vEdge;

out vec4 fragColor;

void main() {
  // Lõi sáng giữa ribbon, fade mượt ra mép — bloom giả bằng additive
  float core = pow(1.0 - vEdge, 2.4);

  // Tia nhú sáng dần ở đoạn vào từ mép trái
  float entry = smoothstep(0.0, 0.05, vT);

  float energy = core * uIntensity * entry;
  fragColor = vec4(uColor * (0.35 + 0.65 * core), energy);
}
`;
