/**
 * Cặp shader của pipeline ASCII — chạy dưới glslVersion GLSL3 (three tự
 * định nghĩa các alias varying/texture2D/gl_FragColor), cho phép index động
 * vào mảng uniform uBayer[64].
 */

export const ASCII_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    // Quad PlaneGeometry(2,2) xuất thẳng clip-space — phủ trọn viewport View.
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const ASCII_FRAGMENT_SHADER = /* glsl */ `
  uniform sampler2D uSource;
  uniform sampler2D uGlyphs;
  uniform float uBayer[64];
  uniform vec2 uResolution;
  uniform float uCellPx;
  uniform vec2 uLens;
  uniform float uLensRadius;
  uniform float uLensStrength;
  uniform float uFocus;
  uniform vec3 uAccent;
  uniform vec3 uInk;
  uniform vec3 uBackground;

  varying vec2 vUv;

  // GLSL3: tự khai báo output — three không cấp alias gl_FragColor ở mode này
  out vec4 fragColor;

  // Rec.709 luminance — tên riêng để không đụng luminance() trong prefix
  // tonemapping mà three chèn sẵn vào fragment shader.
  float lum709(vec3 c) {
    return dot(c, vec3(0.2126, 0.7152, 0.0722));
  }

  void main() {
    vec2 frag = vUv * uResolution;

    // Thấu kính quanh con trỏ + focus toàn bề mặt (hover cover / tap mobile)
    float dLens = distance(frag, uLens);
    float lensT = (1.0 - smoothstep(uLensRadius * 0.25, uLensRadius, dLens)) * uLensStrength;
    float focusT = clamp(max(lensT, uFocus), 0.0, 1.0);

    // Cell co 4 lần khi focus đạt 1 → ký tự mịn dần về ảnh
    float cell = mix(uCellPx, uCellPx * 0.25, focusT);
    vec2 cellCoord = floor(frag / cell);
    vec2 cellCenterUv = (cellCoord + 0.5) * cell / uResolution;
    vec3 src = texture2D(uSource, cellCenterUv).rgb;
    float lum = lum709(src);

    // Ordered dithering — ngưỡng Bayer 8×8 tuần hoàn theo cell
    int bx = int(mod(cellCoord.x, 8.0));
    int by = int(mod(cellCoord.y, 8.0));
    float threshold = uBayer[by * 8 + bx];
    float dithered = clamp(lum + (threshold - 0.5) * 0.24, 0.0, 1.0);

    // Chọn glyph theo bucket độ sáng trong atlas 16 cột
    float glyphIndex = floor(dithered * 15.999);
    vec2 inCell = clamp(fract(frag / cell), 0.0, 1.0);
    vec2 glyphUv = vec2((glyphIndex + inCell.x) / 16.0, inCell.y);
    float glyphMask = texture2D(uGlyphs, glyphUv).r;

    vec3 asciiColor = mix(uBackground, uInk, glyphMask);
    // Vùng sáng nhất nhuộm accent (acid green)
    float accentT = smoothstep(0.82, 0.95, lum);
    asciiColor = mix(asciiColor, uAccent, accentT * glyphMask);

    // Sát focus tối đa: lộ ảnh nguồn mượt bên dưới lớp ký tự
    vec3 smoothColor = texture2D(uSource, vUv).rgb;
    float reveal = smoothstep(0.6, 1.0, focusT);
    vec3 color = mix(asciiColor, smoothColor, reveal);

    fragColor = vec4(color, 1.0);
  }
`;
