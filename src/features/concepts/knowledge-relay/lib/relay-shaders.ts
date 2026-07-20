/**
 * Shader vệt gậy: TẤT CẢ hành trình của 5 practice merge vào một
 * LineSegments duy nhất; mỗi vertex mang năm của nó (aYear) và fragment
 * chỉ lộ phần quá khứ bằng step(vYear, uYear) + cửa sổ glow quanh đầu
 * gậy. GLSL1 là đủ — không index mảng uniform động.
 */

export const TRAIL_VERTEX_SHADER = /* glsl */ `
attribute float aYear;

varying float vYear;

void main() {
  vYear = aYear;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const TRAIL_FRAGMENT_SHADER = /* glsl */ `
uniform float uYear;
uniform vec3 uColor;

varying float vYear;

void main() {
  // Chỉ phần hành trình đã xảy ra mới hiện
  float revealed = step(vYear, uYear);

  // Đầu gậy sáng rực trong cửa sổ 0.7 năm ngay sau uYear đi qua
  float head = smoothstep(uYear - 0.7, uYear, vYear);

  float alpha = revealed * (0.22 + head * 0.78);
  gl_FragColor = vec4(uColor * (0.5 + head * 0.9), alpha);
}
`;
