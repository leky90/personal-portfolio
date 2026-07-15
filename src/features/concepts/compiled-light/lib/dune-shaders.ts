/**
 * Shader dune-field FBM — cảnh nguồn render vào FBO trước khi qua pass
 * terminal. GLSL1 (three tự thêm compat define trên WebGL2).
 */

export const DUNE_VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uScale;
  uniform float uDrift;

  varying vec3 vNormal;
  varying float vHeight;
  varying vec3 vViewDir;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float vnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  // FBM 3 octave — đủ gợn cho dune, đủ rẻ cho 40k vertex
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.55;
    for (int i = 0; i < 3; i++) {
      v += amp * vnoise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 world = position.xy * uScale + vec2(uDrift * uTime, uTime * 0.013);
    float h = fbm(world);

    // Normal bằng finite difference của chính trường FBM
    float eps = 0.09;
    float hx = fbm(world + vec2(eps, 0.0));
    float hz = fbm(world + vec2(0.0, eps));
    vNormal = normalize(vec3(-(hx - h) * uAmp / eps, 1.0, -(hz - h) * uAmp / eps));

    vec3 displaced = vec3(position.x, h * uAmp, -position.y);
    vHeight = h;

    vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const DUNE_FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uLightDir;

  varying vec3 vNormal;
  varying float vHeight;
  varying vec3 vViewDir;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 l = normalize(uLightDir);

    // Raking light: diffuse gắt một phía + specular streak hẹp
    float diffuse = max(dot(n, l), 0.0);
    vec3 halfway = normalize(l + normalize(vViewDir));
    float spec = pow(max(dot(n, halfway), 0.0), 28.0) * 0.4;

    float tone = 0.04 + diffuse * 0.82 + spec + vHeight * 0.1;
    vec3 color = vec3(tone) * vec3(1.0, 0.99, 0.94);

    gl_FragColor = vec4(color, 1.0);
  }
`;
