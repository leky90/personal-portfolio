/**
 * Shader của địa hình ridgeline — toàn bộ displacement chạy trong vertex
 * shader từ data texture; CPU không đụng vào 154k vertex sau khi bake.
 */

export const TERRAIN_VERTEX_SHADER = /* glsl */ `
  uniform sampler2D uHeight;
  uniform float uAmp;
  uniform float uTime;
  uniform float uMotion;
  uniform vec2 uRippleOrigin;
  uniform float uRippleStart;

  varying float vTimeU;
  varying float vHeight;
  varying float vDepth;

  void main() {
    float h = texture2D(uHeight, uv).r;
    vec3 pos = position;

    // "Thở" vài milimet — sống nhưng không bao giờ ồn ào
    float breath = sin(uTime * 0.7 + pos.x * 0.35 + uv.y * 21.0) * 0.07;

    // Gợn sóng lan từ điểm trỏ chuột, tắt dần theo khoảng cách + tuổi
    float age = uTime - uRippleStart;
    float ring = 0.0;
    if (age > 0.0 && age < 2.6) {
      float d = distance(pos.xz, uRippleOrigin);
      ring = sin(d * 2.1 - age * 7.0) * exp(-d * 0.18) * exp(-age * 1.5) * 0.6;
    }

    pos.y = h * uAmp + (breath + ring) * uMotion;

    vTimeU = uv.y;
    vHeight = h;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const TERRAIN_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uInk;
  uniform vec3 uAccent;
  uniform vec3 uBackground;
  uniform float uEraV;
  uniform float uFogDensity;

  varying float vTimeU;
  varying float vHeight;
  varying float vDepth;

  void main() {
    // Sương nuốt phía xa — exponential fog theo depth view-space
    float fogFactor = 1.0 - exp(-vDepth * uFogDensity);

    // Dải contour hổ phách đánh dấu era đang đọc (uEraV < 0 → tắt)
    float band = uEraV < 0.0
      ? 0.0
      : 1.0 - smoothstep(0.0, 0.02, abs(vTimeU - uEraV));

    vec3 color = mix(uInk, uAccent, band);
    float alpha = (0.26 + vHeight * 0.74) * (1.0 - fogFactor);
    alpha = max(alpha, band * 0.9 * (1.0 - fogFactor * 0.7));

    gl_FragColor = vec4(color, alpha);
  }
`;
