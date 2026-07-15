/**
 * Composite pass terminal: FBO dune → quantize theo cell → Bayer dither →
 * glyph atlas; thấu kính con trỏ "decompile" ký tự về ánh sáng mượt.
 * Chạy GLSL3 (index động vào uBayer[64]) — tự khai báo out vec4, không dùng
 * gl_FragColor, không đặt tên hàm luminance (bài học batch 1).
 */

export const TERMINAL_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const TERMINAL_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uSource;
  uniform sampler2D uGlyphs;
  uniform float uBayer[64];
  uniform vec2 uResolution;
  uniform float uCellPx;
  uniform vec2 uLens;
  uniform float uLensRadius;
  uniform float uLensStrength;
  uniform vec3 uPhosphor;
  uniform vec3 uBackground;

  varying vec2 vUv;

  out vec4 fragColor;

  float lum709(vec3 c) {
    return dot(c, vec3(0.2126, 0.7152, 0.0722));
  }

  void main() {
    vec2 frag = vUv * uResolution;

    // Thấu kính decompile quanh con trỏ
    float dLens = distance(frag, uLens);
    float lensT = (1.0 - smoothstep(uLensRadius * 0.2, uLensRadius, dLens)) * uLensStrength;

    vec2 cellCoord = floor(frag / uCellPx);
    vec2 cellCenterUv = (cellCoord + 0.5) * uCellPx / uResolution;
    vec3 src = texture2D(uSource, cellCenterUv).rgb;
    float lum = lum709(src);

    int bx = int(mod(cellCoord.x, 8.0));
    int by = int(mod(cellCoord.y, 8.0));
    float threshold = uBayer[by * 8 + bx];
    float dithered = clamp(lum + (threshold - 0.5) * 0.26, 0.0, 1.0);

    float glyphIndex = floor(dithered * 15.999);
    vec2 inCell = clamp(fract(frag / uCellPx), 0.0, 1.0);
    vec2 glyphUv = vec2((glyphIndex + inCell.x) / 16.0, inCell.y);
    float glyphMask = texture2D(uGlyphs, glyphUv).r;

    // Phosphor off-white trên nền gần đen
    vec3 ascii = mix(uBackground, uPhosphor, glyphMask * (0.35 + dithered * 0.65));

    // Trong thấu kính: lộ bề mặt lit thật bên dưới lớp quantize
    vec3 raw = texture2D(uSource, vUv).rgb;
    vec3 color = mix(ascii, raw, lensT);

    fragColor = vec4(color, 1.0);
  }
`;
